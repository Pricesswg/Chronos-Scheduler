"""Off-recall: a switch-off lost because the device was offline is retried
when it comes back, unless its schedule was disabled or deleted meanwhile."""
from __future__ import annotations

from .conftest import chained_to_chronos, make_device, make_schedule, names, tick_at


def _arm(store, hass):
    store.devices = [make_device("d1", "switch.lamp")]
    store.schedules = [make_schedule("s1", ["d1"], [
        {"start": 18, "end": 22, "action": {"id": "turn_on", "trigger": "both", "end_action": {"id": "turn_off"}}},
    ])]
    hass.states.async_set("switch.lamp", "on")
    return store.schedules[0]


async def _run_to_block_end_offline(hass, scheduler, clock):
    await tick_at(scheduler, hass, clock, 18, 0)
    hass.states.async_set("switch.lamp", "unavailable")
    await tick_at(scheduler, hass, clock, 22, 0)


async def test_offline_device_arms_a_recall_instead_of_failing(hass, store, scheduler, calls, clock):
    _arm(store, hass)
    await _run_to_block_end_offline(hass, scheduler, clock)
    assert names(calls) == ["switch.turn_on"], "no switch-off could be sent"
    assert len(scheduler._pending_recalls) == 1
    assert next(iter(scheduler._pending_recalls.values()))["mode"] == "off"


async def test_recall_fires_when_the_device_returns(hass, store, scheduler, calls, events, clock):
    _arm(store, hass)
    await _run_to_block_end_offline(hass, scheduler, clock)
    hass.states.async_set("switch.lamp", "on")
    await hass.async_block_till_done()
    assert names(calls) == ["switch.turn_on", "switch.turn_off"]
    assert chained_to_chronos(calls[1], events), "recall must be attributed in the logbook"
    assert scheduler._pending_recalls == {}


async def test_recall_dies_with_a_disabled_schedule(hass, store, scheduler, calls, clock):
    sched = _arm(store, hass)
    await _run_to_block_end_offline(hass, scheduler, clock)
    sched["enabled"] = False
    hass.states.async_set("switch.lamp", "on")
    await hass.async_block_till_done()
    assert names(calls) == ["switch.turn_on"], "a disabled schedule must not switch anything"
    assert scheduler._pending_recalls == {}
    assert any("disabled or removed" in str(e.get("error")) for e in store.history)


async def test_recall_dies_with_a_deleted_schedule(hass, store, scheduler, calls, clock):
    _arm(store, hass)
    await _run_to_block_end_offline(hass, scheduler, clock)
    store.schedules = []
    hass.states.async_set("switch.lamp", "on")
    await hass.async_block_till_done()
    assert names(calls) == ["switch.turn_on"]
    assert scheduler._pending_recalls == {}
