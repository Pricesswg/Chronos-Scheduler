"""Electricity price series: read today's hourly prices from whatever shape
the price integration publishes, and rank the current hour."""
from __future__ import annotations


def parse_price_series(attrs: dict) -> list[float] | None:
    """Today's hourly electricity prices, read from a price sensor.

    Every integration publishes them differently, so the known shapes are
    tried in order:
      * ``raw_today``    = [{"start": .., "end": .., "value": 0.12}, ..]  Nordpool
      * ``prices_today`` = [{"time": .., "price": 0.12}, ..]              ENTSO-e
      * ``today``        = [0.12, 0.15, ..]                               Nordpool

    Returns None when nothing usable is found. That is deliberate: a rule
    whose variable reads None evaluates to false, so a sensor that is not a
    price sensor (or has not published tomorrow's data yet) can never make a
    rule fire by accident.
    """
    if not isinstance(attrs, dict):
        return None

    def _numbers(rows, *keys) -> list[float]:
        out: list[float] = []
        for row in rows:
            if isinstance(row, dict):
                val = next((row[k] for k in keys if k in row), None)
            else:
                val = row
            try:
                num = float(val)
            except (TypeError, ValueError):
                continue
            out.append(num)
        return out

    for key in ("raw_today", "prices_today", "today"):
        rows = attrs.get(key)
        if isinstance(rows, list) and rows:
            series = _numbers(rows, "value", "price")
            # A partial series would rank the wrong hour, so require enough
            # of the day to be present before trusting it.
            if len(series) >= 20:
                return series
    return None




def price_rank(series: list[float], hour: int) -> int | None:
    """Position of `hour` among today's prices, 1 = cheapest hour of the day.

    This is the piece no price integration publishes, and the one that makes
    "run during the four cheapest hours" expressible as `price.rank_today <= 4`
    with the ordinary rule engine.
    """
    if not series or hour < 0 or hour >= len(series):
        return None
    mine = series[hour]
    # Ties share the better rank, so two hours at the same price both count.
    return sum(1 for v in series if v < mine) + 1
