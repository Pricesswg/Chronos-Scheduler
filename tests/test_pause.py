"""Pause / skip today: a paused schedule leaves its devices alone, what was
running is closed first, and the resume re-applies the active block."""
from __future__ import annotations

from datetime import datetime

from homeassistant.util import dt as dt_util

from custom_components.chronos.gate import is_paused, schedule_is_live, skip_today_deadline
from custom_components.chronos.scheduler import ChronosScheduler

from .conftest import local, make_device, make_schedule, names, tick_at


def test_gate_reads_the_pause():
    noon = datetime(2026, 9, 7, 12, 0)
    sched = {"enabled": True, "days": [1] * 7, "paused_until": "2026-09-07T18:00:00"}
    assert is_paused(sched, noon)
    assert schedule_is_live(sched, noon) == "paused until 2026-09-07 18:00"
    assert not is_paused(sched, datetime(2026, 9, 7, 18, 0))
    assert schedule_is_live(sched, datetime(2026, 9, 7, 18, 0)) is None
    assert not is_paused({**sched, "paused_until": "garbage"}, noon)
    assert is_paused({**sched, "paused_until": "2026-09-07T18:00:00+02:00"}, noon), "mixed awareness compares wall clock"


def test_skip_today_is_midnight_tomorrow():
    until = skip_today_deadline(datetime(2026, 9, 7, 23, 59))
    assert until == datetime(2026, 9, 8, 0, 0)


def _lamp(store, hass, *, trigger_both=True):
    store.devices = [make_device("d1", "switch.lamp")]
    action = {"id": "turn_on"}
    if trigger_both:
        action.update(trigger="both", end_action={"id": "turn_off"})
    store.schedules = [make_schedule("s1", ["d1"], [{"start": 18, "end": 22, "action": action}])]
    hass.states.async_set("switch.lamp", "off")
    return store.schedules[0]


async def test_paused_schedule_does_nothing(hass, store, scheduler, calls, clock):
    sched = _lamp(store, hass)
    sched["paused_until"] = local(23, 30).isoformat()
    for h in (18, 20, 22):
        await tick_at(scheduler, hass, clock, h, 0)
    assert calls == []


async def test_pause_mid_block_closes_it_and_resume_reapplies(hass, store, scheduler, calls, clock):
    _lamp(store, hass)
    await tick_at(scheduler, hass, clock, 18, 0)
    assert names(calls) == ["switch.turn_on"]
    clock.move_to(local(19))
    result = await scheduler.pause_schedule("s1", dt_util.as_local(local(21)))
    await hass.async_block_till_done()
    assert result["ok"] and store.schedules[0]["paused_until"]
    assert names(calls) == ["switch.turn_on", "switch.turn_off"], "the running block's end action is sent at once"
    await tick_at(scheduler, hass, clock, 20, 0)
    assert names(calls) == ["switch.turn_on", "switch.turn_off"], "nothing while paused"
    # The pause runs out inside the block: the tick clears it and re-applies.
    await tick_at(scheduler, hass, clock, 21, 0)
    assert "paused_until" not in store.schedules[0]
    assert names(calls) == ["switch.turn_on", "switch.turn_off", "switch.turn_on"]
    await tick_at(scheduler, hass, clock, 22, 0)
    assert names(calls)[-1] == "switch.turn_off"


async def test_pause_mid_block_without_end_action_sends_nothing(hass, store, scheduler, calls, clock):
    _lamp(store, hass, trigger_both=False)
    await tick_at(scheduler, hass, clock, 18, 0)
    clock.move_to(local(19))
    await scheduler.pause_schedule("s1", dt_util.as_local(local(23)))
    await hass.async_block_till_done()
    assert names(calls) == ["switch.turn_on"], "no end action configured: the device is left as it is"


async def test_explicit_resume_reapplies_immediately(hass, store, scheduler, calls, clock):
    _lamp(store, hass)
    await tick_at(scheduler, hass, clock, 18, 0)
    clock.move_to(local(19))
    await scheduler.pause_schedule("s1", dt_util.as_local(local(23)))
    await hass.async_block_till_done()
    clock.move_to(local(19, 30))
    await scheduler.pause_schedule("s1", None)
    await hass.async_block_till_done()
    assert names(calls) == ["switch.turn_on", "switch.turn_off", "switch.turn_on"]
    assert "paused_until" not in store.schedules[0]


async def test_status_reports_the_pause(hass, store, scheduler, clock):
    sched = _lamp(store, hass)
    clock.move_to(local(19))
    assert scheduler.schedule_status(sched)["running"] is True
    sched["paused_until"] = local(23).isoformat()
    status = scheduler.schedule_status(sched)
    assert status["running"] is False and status["paused_until"] is not None


async def test_restart_keeps_the_pause(hass, store, calls, clock):
    sched = _lamp(store, hass)
    sched["paused_until"] = local(23).isoformat()
    fresh = ChronosScheduler(hass, store)
    await tick_at(fresh, hass, clock, 19, 0)
    assert calls == [], "the deadline is on the schedule record, so a restart honours it"
