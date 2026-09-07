"""schedule_is_live is the only gate; every acting path goes through it."""
from __future__ import annotations

from datetime import datetime

from custom_components.chronos.gate import is_in_date_range, schedule_is_live

from .conftest import local, make_device, make_schedule, names

MONDAY = datetime(2026, 9, 7, 12, 0)


def test_gate_reasons_in_priority_order():
    sched = {"enabled": True, "days": [1] * 7}
    assert schedule_is_live(sched, MONDAY) is None
    assert schedule_is_live(None, MONDAY) == "schedule disabled"
    assert schedule_is_live({**sched, "enabled": False}, MONDAY) == "schedule disabled"
    assert schedule_is_live({**sched, "days": [0, 1, 1, 1, 1, 1, 1]}, MONDAY) == "not scheduled today"
    winter = {"start_month": 12, "start_day": 1, "end_month": 2, "end_day": 28}
    assert schedule_is_live({**sched, "date_range": winter}, MONDAY) == "outside the schedule's date range"
    assert schedule_is_live({**sched, "date_range": winter}, datetime(2026, 1, 15)) is None


def test_date_range_wraps_the_year_end_and_tolerates_garbage():
    winter = {"start_month": 12, "start_day": 1, "end_month": 2, "end_day": 28}
    assert is_in_date_range({"date_range": winter}, datetime(2026, 12, 25))
    assert is_in_date_range({"date_range": winter}, datetime(2026, 2, 1))
    assert not is_in_date_range({"date_range": winter}, datetime(2026, 7, 1))
    assert is_in_date_range({"date_range": {"start_month": "x"}}, datetime(2026, 7, 1))
    assert is_in_date_range({}, datetime(2026, 7, 1))


async def test_fire_now_refuses_a_disabled_schedule(hass, store, scheduler, calls, clock):
    store.devices = [make_device("d1", "switch.lamp")]
    store.schedules = [make_schedule("s1", ["d1"], [{"start": 10, "end": 14, "action": {"id": "turn_on"}}], enabled=False)]
    hass.states.async_set("switch.lamp", "off")
    clock.move_to(local(12))
    result = await scheduler.fire_now("s1")
    assert result == {"ok": False, "error": "schedule disabled"}
    assert calls == []
    store.schedules[0]["enabled"] = True
    result = await scheduler.fire_now("s1")
    await hass.async_block_till_done()
    assert result["ok"] is True
    assert names(calls) == ["switch.turn_on"]
