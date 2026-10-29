"""Single-date schedules (issue #33): run on given dates with their year,
then disable themselves after the last block of the last date."""
from __future__ import annotations

from datetime import datetime

from custom_components.chronos.gate import once_window, runs_on_day, schedule_is_live
from custom_components.chronos.scheduler import ChronosScheduler

from .conftest import DAY, local, make_device, make_schedule, names, tick_at

# DAY is Monday 2026-09-07.
NEXT = "2026-09-08"


def test_window_and_gate():
    sched = {"enabled": True, "days": [0] * 7, "once": {"from": DAY, "to": DAY}}
    assert once_window(sched) is not None
    assert schedule_is_live(sched, datetime(2026, 9, 7, 12)) is None, "the weekday mask does not apply"
    assert schedule_is_live(sched, datetime(2026, 9, 8, 12)) == "outside the schedule's dates"
    assert schedule_is_live(sched, datetime(2027, 9, 7, 12)) is not None, "the year matters"
    assert runs_on_day({"once": {"from": DAY, "to": NEXT}}, datetime(2026, 9, 8))
    assert once_window({"once": {"from": "garbage"}}) is None, "unreadable = ordinary schedule"
    assert once_window({"once": {"from": NEXT, "to": DAY}}) is not None, "swapped dates are tolerated"


def _heating(store, hass, *, frm=DAY, to=DAY):
    store.devices = [make_device("d1", "switch.heater")]
    sched = make_schedule("s1", ["d1"], [
        {"start": 18, "end": 22, "action": {"id": "turn_on", "trigger": "both", "end_action": {"id": "turn_off"}}},
    ], days=[0] * 7)
    sched["once"] = {"from": frm, "to": to}
    store.schedules = [sched]
    hass.states.async_set("switch.heater", "off")
    return sched


async def test_runs_on_the_date_then_disables_after_the_end_action(hass, store, scheduler, calls, clock):
    sched = _heating(store, hass)
    await tick_at(scheduler, hass, clock, 18, 0)
    assert names(calls) == ["switch.turn_on"]
    assert sched["enabled"] is True
    await tick_at(scheduler, hass, clock, 22, 0)
    assert names(calls) == ["switch.turn_on", "switch.turn_off"], "the end action goes out first"
    assert sched["enabled"] is False, "then the schedule disables itself"
    assert any(e.get("action_id") == "once_finished" for e in store.history)
    await tick_at(scheduler, hass, clock, 18, 0, day=NEXT)
    assert len(calls) == 2, "nothing the day after"


async def test_silent_before_its_date(hass, store, scheduler, calls, clock):
    sched = _heating(store, hass, frm=NEXT, to=NEXT)
    for h in (18, 20, 22):
        await tick_at(scheduler, hass, clock, h, 0)
    assert calls == [] and sched["enabled"] is True


async def test_a_range_runs_every_day_and_finishes_on_the_last(hass, store, scheduler, calls, clock):
    sched = _heating(store, hass, frm=DAY, to=NEXT)
    await tick_at(scheduler, hass, clock, 18, 0)
    await tick_at(scheduler, hass, clock, 22, 0)
    assert sched["enabled"] is True, "not the last date yet"
    await tick_at(scheduler, hass, clock, 18, 0, day=NEXT)
    await tick_at(scheduler, hass, clock, 22, 0, day=NEXT)
    assert names(calls) == ["switch.turn_on", "switch.turn_off"] * 2
    assert sched["enabled"] is False


async def test_catch_up_after_a_restart_past_the_date(hass, store, calls, clock):
    sched = _heating(store, hass)
    fresh = ChronosScheduler(hass, store)
    await tick_at(fresh, hass, clock, 9, 0, day=NEXT)
    assert sched["enabled"] is False and calls == []


async def test_a_pending_switch_off_keeps_it_enabled_until_it_goes_out(hass, store, scheduler, calls, clock):
    sched = _heating(store, hass)
    await tick_at(scheduler, hass, clock, 18, 0)
    hass.states.async_set("switch.heater", "unavailable")
    await tick_at(scheduler, hass, clock, 22, 0)
    assert scheduler._pending_recalls, "the switch-off is waiting for the heater"
    assert sched["enabled"] is True, "disabling now would drop it"
    await tick_at(scheduler, hass, clock, 9, 0, day=NEXT)
    assert sched["enabled"] is True, "still waiting the next morning"
    hass.states.async_set("switch.heater", "on")
    await hass.async_block_till_done()
    assert names(calls)[-1] == "switch.turn_off", "the lost switch-off went out"
    await tick_at(scheduler, hass, clock, 9, 1, day=NEXT)
    assert sched["enabled"] is False


async def test_status_and_next_change(hass, store, scheduler, clock):
    sched = _heating(store, hass, frm="2026-09-20", to="2026-09-20")
    clock.move_to(local(12))
    status = scheduler.schedule_status(sched)
    assert status["running"] is False
    nxt = status["next_change"]
    assert nxt is not None and nxt.date().isoformat() == "2026-09-20" and nxt.hour == 18, \
        "a date weeks away is found, not only the next seven days"
