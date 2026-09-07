"""Pure functions: no hass, no store, no clock."""
from __future__ import annotations

from custom_components.chronos.expressions import hold_candidate, parse_expression, split_and
from custom_components.chronos.pricing import parse_price_series, price_rank
from custom_components.chronos.scheduler import ChronosScheduler
from custom_components.chronos.timing import jitter_minutes, presence_plan


def test_hold_candidate_twilight_orientation():
    # On under 20 lx, off over 40 lx, deadband in between.
    assert hold_candidate(10, 20, 40) is True
    assert hold_candidate(50, 20, 40) is False
    assert hold_candidate(30, 20, 40) is None


def test_hold_candidate_fan_orientation():
    # On over 28 °C, off under 25 °C: thresholds the other way round.
    assert hold_candidate(30, 28, 25) is True
    assert hold_candidate(20, 28, 25) is False
    assert hold_candidate(26, 28, 25) is None


def _hours(n):
    return [0.10 + 0.01 * i for i in range(n)]


def test_price_series_accepts_the_three_integration_shapes():
    nordpool_raw = {"raw_today": [{"start": f"2026-09-07T{i:02d}:00", "end": "", "value": v} for i, v in enumerate(_hours(24))]}
    entsoe = {"prices_today": [{"time": f"{i:02d}:00", "price": v} for i, v in enumerate(_hours(24))]}
    plain = {"today": _hours(24)}
    for attrs in (nordpool_raw, entsoe, plain):
        series = parse_price_series(attrs)
        assert series is not None and len(series) == 24
        assert series[0] == 0.10


def test_price_series_rejects_short_or_garbage():
    assert parse_price_series({"today": _hours(19)}) is None
    assert parse_price_series({"today": "not a list"}) is None
    assert parse_price_series({}) is None
    assert parse_price_series({"raw_today": [{"value": "x"}] * 24}) is None


def test_price_rank_cheapest_is_one_and_ties_share():
    series = [0.30] * 24
    series[3] = 0.10
    series[4] = 0.10
    series[10] = 0.20
    assert price_rank(series, 3) == 1
    assert price_rank(series, 4) == 1
    assert price_rank(series, 10) == 3
    assert price_rank(series, 0) == 4
    assert price_rank(series, 99) is None


def test_jitter_is_stable_for_the_day_bounded_and_varies_by_day():
    first = jitter_minutes("s1", 0, "2026-09-07", 15)
    assert all(jitter_minutes("s1", 0, "2026-09-07", 15) == first for _ in range(100))
    assert -15 <= first <= 15
    week = {jitter_minutes("s1", 0, f"2026-09-{d:02d}", 15) for d in range(7, 14)}
    assert len(week) > 1
    assert jitter_minutes("s1", 0, "2026-09-07", 0) == 0


def test_presence_plan_invariants_over_a_year():
    for d in range(400):
        day = f"2026-{1 + d % 12:02d}-{1 + d % 28:02d}"
        plan = presence_plan(f"s:{d}:{day}", 18.5, 23.5, 4, 20, 90, 3)
        assert len(plan) <= 4
        prev_end = 18.5
        for a in plan:
            assert a["start"] >= prev_end - 1e-9, "activations overlap"
            assert a["end"] <= 23.5 + 1e-9, "activation leaves the window"
            assert 20 - 1e-6 <= (a["end"] - a["start"]) * 60 <= 90 + 1e-6
            assert 0 <= a["device"] < 3
            prev_end = a["end"]


def test_presence_plan_is_deterministic_and_changes_tomorrow():
    today = presence_plan("s:0:2026-09-07", 18.5, 23.5, 4, 20, 90, 3)
    assert all(presence_plan("s:0:2026-09-07", 18.5, 23.5, 4, 20, 90, 3) == today for _ in range(50))
    assert presence_plan("s:0:2026-09-08", 18.5, 23.5, 4, 20, 90, 3) != today


def test_presence_plan_degenerate_inputs_are_safe():
    # A window shorter than the minimum duration still yields one
    # activation, cut to the window: doing nothing would look broken.
    tiny = presence_plan("x", 20, 20.1, 4, 20, 90, 1)
    assert len(tiny) == 1 and tiny[0]["start"] >= 20 and tiny[0]["end"] <= 20.1 + 1e-9
    assert presence_plan("x", 18, 23, 0, 20, 90, 1) == []
    # No devices: the plan still resolves (index 0) and the caller finds
    # no entity to drive; it must not crash or go out of range.
    assert all(a["device"] == 0 for a in presence_plan("x", 18, 23, 3, 20, 90, 0))


def test_write_block_value_scales_sequential_program_as_a_total():
    block = {"action": {"id": "run_sequence", "mode": "sequential",
                        "sequence": [{"entity_id": "valve.a", "minutes": 15}, {"entity_id": "valve.b", "minutes": 5}]}}
    ChronosScheduler._write_block_value(block, 60)
    legs = [row["minutes"] for row in block["action"]["sequence"]]
    assert legs == [45, 15], "20 minutes scaled to 60 keeps the 3:1 proportion"
    ChronosScheduler._write_block_value(block, 1)
    assert min(row["minutes"] for row in block["action"]["sequence"]) >= 1, "a leg never drops below one minute"


def test_write_block_value_plain_mode_sets_value():
    block = {"action": {"id": "set_duration", "value": 30}}
    ChronosScheduler._write_block_value(block, 75)
    assert block["action"]["value"] == 75


def test_expression_parsing():
    assert parse_expression("temperature > 22") == ("temperature", ">", "22")
    assert parse_expression("price.rank_today <= 4") == ("price.rank_today", "<=", "4")
    assert parse_expression("garbage") is None
    assert split_and("temperature > 22 AND humidity < 60") == ["temperature > 22", "humidity < 60"]
    assert split_and("") == []
