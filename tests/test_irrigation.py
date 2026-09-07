"""Irrigation programs: timed (all valves, one duration) and sequential
(one valve after the other), their persistence for restart recovery, and
the valve closing on cancellation and on recovery."""
from __future__ import annotations

import asyncio

from .conftest import local, make_device, make_schedule, tick_at


def _calls(calls):
    return [(c.service, c.data["entity_id"]) for c in calls]


def _program(store, hass, *, sequence=None, minutes=15):
    store.devices = [make_device("v1", "valve.a", "irrigation"), make_device("v2", "valve.b", "irrigation")]
    action = {"id": "turn_on", "mode": "sequential", "sequence": sequence} if sequence else {"id": "turn_on", "value": minutes}
    store.schedules = [make_schedule("s1", ["v1", "v2"], [{"start": 6, "end": 7, "action": action}], dtype="irrigation")]
    for e in ("valve.a", "valve.b"):
        hass.states.async_set(e, "closed")


async def test_sequential_program_runs_the_legs_in_order(hass, store, scheduler, calls, clock, fast_sleep):
    _program(store, hass, sequence=[{"entity_id": "valve.a", "minutes": 15}, {"entity_id": "valve.b", "minutes": 5}])
    await tick_at(scheduler, hass, clock, 6, 0)
    assert _calls(calls) == [("open_valve", "valve.a"), ("close_valve", "valve.a"), ("open_valve", "valve.b"), ("close_valve", "valve.b")]
    assert fast_sleep() == [15 * 60, 5 * 60]
    assert store.active_sequences == {}, "the in-flight record is cleared once the program ends"
    await tick_at(scheduler, hass, clock, 6, 30)
    assert len(calls) == 4, "same block, no second run"


async def test_timed_program_opens_all_and_closes_all(hass, store, scheduler, calls, clock, fast_sleep):
    _program(store, hass, minutes=20)
    await tick_at(scheduler, hass, clock, 6, 0)
    assert _calls(calls)[:2] == [("open_valve", "valve.a"), ("open_valve", "valve.b")]
    assert sorted(_calls(calls)[2:]) == [("close_valve", "valve.a"), ("close_valve", "valve.b")]
    assert fast_sleep() == [20 * 60]
    assert store.active_sequences == {}


async def test_malformed_sequence_rows_are_skipped(hass, store, scheduler, calls, clock, fast_sleep):
    _program(store, hass, sequence=[{"entity_id": "valve.a", "minutes": "x"}, "junk", {"entity_id": "valve.b", "minutes": 3}])
    await tick_at(scheduler, hass, clock, 6, 0)
    assert _calls(calls) == [("open_valve", "valve.b"), ("close_valve", "valve.b")]


async def test_stop_closes_the_valve_that_is_open(hass, store, scheduler, calls, clock):
    _program(store, hass, sequence=[{"entity_id": "valve.a", "minutes": 15}, {"entity_id": "valve.b", "minutes": 5}])
    gate = asyncio.Event()
    real = asyncio.sleep

    async def blocking(delay, *args, **kwargs):
        if delay >= 60:
            await gate.wait()
        else:
            await real(delay)

    from unittest.mock import patch
    with patch("asyncio.sleep", blocking):
        clock.move_to(local(6))
        await scheduler._tick(local(6))
        for _ in range(5):
            await real(0)
        assert _calls(calls) == [("open_valve", "valve.a")], "waiting inside the first leg"
        assert "s1:6-7" in store.active_sequences
        await scheduler.stop()
        for _ in range(5):
            await real(0)
    assert _calls(calls)[-1] == ("close_valve", "valve.a"), "cancellation closes the valve that was open"


async def test_recovery_closes_valves_left_open_by_a_restart(hass, store, scheduler, calls):
    _program(store, hass, minutes=10)
    store.active_sequences = {"s1:global": {"schedule_id": "s1", "schedule_name": "s1", "entity_ids": ["valve.a", "valve.b"], "started_at": "2026-09-07T06:00:00+00:00"}}
    await scheduler._recover_interrupted_sequences()
    await hass.async_block_till_done()
    assert sorted(_calls(calls)) == [("close_valve", "valve.a"), ("close_valve", "valve.b")]
    assert store.active_sequences == {}
    assert any(e.get("kind") == "system" for e in store.history), "the restart is recorded in History"
