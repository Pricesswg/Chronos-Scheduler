"""Rule variables: weather entity and sensor overrides, sun position, price
sensor, hourly forecast cache."""
from __future__ import annotations

import logging
from datetime import timedelta
from typing import Any

from homeassistant.util import dt as dt_util

from .pricing import parse_price_series, price_rank

_LOGGER = logging.getLogger(__name__)



class WeatherMixin:
    """Methods of ChronosScheduler that live here for readability. They run
    on the scheduler instance and use its attributes (_hass, _store, the
    per-feature state dicts set up in ChronosScheduler.__init__)."""

    def _is_daytime(self) -> bool:
        sun = self._hass.states.get("sun.sun")
        return bool(sun and sun.state == "above_horizon")


    def _current_daytime_start(self, local_now):
        """Datetime of the most recent sunrise (or None if unknown)."""
        sun = self._hass.states.get("sun.sun")
        if sun is None or sun.state != "above_horizon":
            return None
        iso = sun.attributes.get("next_rising")
        if not iso:
            return None
        try:
            t = dt_util.parse_datetime(str(iso))
            if t is None:
                return None
            return dt_util.as_local(t - timedelta(days=1))
        except Exception:
            return None


    def _current_nighttime_start(self, local_now):
        """Datetime of the most recent sunset (or None if unknown)."""
        sun = self._hass.states.get("sun.sun")
        if sun is None or sun.state != "below_horizon":
            return None
        iso = sun.attributes.get("next_setting")
        if not iso:
            return None
        try:
            t = dt_util.parse_datetime(str(iso))
            if t is None:
                return None
            return dt_util.as_local(t - timedelta(days=1))
        except Exception:
            return None


    # Domains accepted as direct entity references in IF expressions.
    # Anything starting with "sensor.<X>", "binary_sensor.<X>", … is read
    # directly from hass.states bypassing the weather/sun resolver. This
    # lets users build rules on arbitrary HA sensors (e.g. battery SOC,
    # PV forecast aggregators), introduced in v1.10.
    _DIRECT_DOMAINS = {"sensor", "binary_sensor", "number", "input_number"}

    def _read_attribute(self, key: str) -> Any:
        """Read a weather attribute. If the user mapped the key to a
        specific sensor entity (override), read from that one; otherwise
        from the main weather.* entity. sun.* keys read from HA's sun.sun.
        Keys that look like entity_ids (sensor.X, binary_sensor.X,
        number.X, input_number.X) read straight from hass.states."""
        overrides = self._store.settings.get("weather_sensor_map") or {}
        sensor_id = overrides.get(key)
        if sensor_id:
            state = self._hass.states.get(sensor_id)
            if state is None:
                return None
            if state.state in (None, "unknown", "unavailable"):
                return None
            return state.state

        # Direct entity reference: keys like "sensor.battery_soc" go straight
        # to hass.states. Keep this BEFORE the sun.* check so future "sensor.*"
        # weather attributes (none today) couldn't accidentally shadow sensors.
        if "." in key:
            domain, _ = key.split(".", 1)
            if domain in self._DIRECT_DOMAINS:
                state = self._hass.states.get(key)
                if state is None:
                    return None
                if state.state in (None, "unknown", "unavailable"):
                    return None
                return state.state

        # Sun attributes come from the sun.sun entity (always present in HA)
        if key.startswith("sun."):
            return self._read_sun_attribute(key.split(".", 1)[1])

        # Electricity price attributes come from the configured price entity.
        if key.startswith("price."):
            return self._read_price_attribute(key.split(".", 1)[1])

        weather_entity = self._store.settings.get("weather_entity", "")
        if not weather_entity:
            return None
        weather_state = self._hass.states.get(weather_entity)
        if weather_state is None:
            return None
        if key == "condition":
            return weather_state.state
        return weather_state.attributes.get(key)


    def _read_price_attribute(self, sub: str) -> Any:
        """Electricity price variables, from the entity set in Settings.

        Only the three things price integrations do NOT publish themselves:
        they already expose average/min/max/low_price, so recomputing those
        here would be duplicated logic. What is missing everywhere is the
        current hour's position in the day (`rank_today`), and a measure of
        cheapness that survives a market whose level moves daily
        (`vs_average_pct`), because rule thresholds are constants.
        """
        entity_id = self._store.settings.get("price_entity", "")
        if not entity_id:
            return None
        state = self._hass.states.get(entity_id)
        if state is None:
            return None
        attrs = state.attributes or {}

        def _now_price() -> float | None:
            raw = attrs.get("current_price")
            if raw is None:
                raw = state.state
            try:
                return float(raw)
            except (TypeError, ValueError):
                return None

        if sub == "now":
            return _now_price()

        series = parse_price_series(attrs)
        if not series:
            return None

        if sub == "rank_today":
            return price_rank(series, dt_util.now().hour)

        if sub == "vs_average_pct":
            avg = sum(series) / len(series)
            now = _now_price()
            if now is None or avg == 0:
                return None
            return round(100 * now / avg, 1)

        return None


    def _read_sun_attribute(self, sub: str) -> Any:
        """Read attributes from the sun.sun entity.

        Exposes elevation, azimuth and state directly, plus two convenient
        derived values: minutes_until_sunrise and minutes_until_sunset.
        """
        sun = self._hass.states.get("sun.sun")
        if sun is None:
            return None
        attrs = sun.attributes

        if sub == "state":
            return sun.state  # "above_horizon" / "below_horizon"
        if sub == "elevation":
            return attrs.get("elevation")
        if sub == "azimuth":
            return attrs.get("azimuth")

        if sub in ("minutes_until_sunrise", "minutes_until_sunset"):
            from datetime import datetime, timezone
            field = "next_rising" if sub == "minutes_until_sunrise" else "next_setting"
            iso = attrs.get(field)
            if not iso:
                return None
            try:
                t = datetime.fromisoformat(str(iso).replace("Z", "+00:00"))
                now = datetime.now(timezone.utc)
                return max(0, int((t - now).total_seconds() / 60))
            except Exception:
                _LOGGER.debug("Cannot parse sun.%s timestamp: %s", field, iso)
                return None

        return None


    async def _refresh_forecast_cache(self) -> None:
        """Fetch the hourly forecast from the configured weather entity and
        store it in memory. Called by the polling timer and lazily when the
        cache is stale. A failed fetch keeps the previous cache: stale data
        beats no data for rule evaluation."""
        weather_entity = self._store.settings.get("weather_entity", "")
        if not weather_entity:
            self._forecast_cache = []
            self._forecast_cache_at = None
            return
        try:
            result = await self._hass.services.async_call(
                "weather",
                "get_forecasts",
                {"entity_id": weather_entity, "type": "hourly"},
                blocking=True,
                return_response=True,
            )
        except Exception:
            _LOGGER.debug("Failed to get forecast for %s", weather_entity)
            return

        forecasts = []
        if isinstance(result, dict):
            for entity_data in result.values():
                if isinstance(entity_data, dict):
                    forecasts = entity_data.get("forecast", [])
                    break
        if forecasts:
            self._forecast_cache = forecasts
            self._forecast_cache_at = dt_util.utcnow()


    def _forecast_stale(self) -> bool:
        if self._forecast_cache_at is None:
            return True
        polling = self._store.settings.get("polling_minutes", 15) or 15
        # Twice the polling interval: tolerates one missed/failed poll
        # before forcing an inline refresh on the async rule path.
        return dt_util.utcnow() - self._forecast_cache_at > timedelta(
            minutes=max(5, polling) * 2
        )


    def _forecast_value_from_cache(self, key: str) -> float | str | None:
        """Derive a forecast.* attribute from the cached hourly forecast.
        Synchronous, so continuous effects (shift/extend/scale_*) can use
        forecast clauses too."""
        forecasts = self._forecast_cache
        if not forecasts:
            return None
        sub_key = key.split(".", 1)[1]
        if sub_key == "temp_max_today":
            return max((f.get("temperature", 0) for f in forecasts[:24]), default=None)
        if sub_key == "temp_min_today":
            return min((f.get("temperature", 0) for f in forecasts[:24]), default=None)
        if sub_key == "rain_6h":
            return sum(f.get("precipitation", 0) or 0 for f in forecasts[:6])
        if sub_key == "condition_6h":
            return forecasts[5].get("condition") if len(forecasts) > 5 else None
        return None


    async def _get_forecast_value(self, key: str) -> float | str | None:
        if self._forecast_stale():
            await self._refresh_forecast_cache()
        return self._forecast_value_from_cache(key)


    async def _weather_poll(self, _now) -> None:
        await self._refresh_forecast_cache()
