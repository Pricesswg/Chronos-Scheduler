"""The tick transition table: what a block does at its start, at its end,
when another block takes over, when the schedule is off, after a restart."""
from __future__ import annotations

from custom_components.chronos.scheduler import ChronosScheduler

from .conftest import chained_to_chronos, make_device, make_schedule, names, tick_at


def _lamp(store, hass, *, trigger_both=True, enabled=True, days=None):
    store.devices = [make_device("d1", "switch.lamp")]
    action = {"id": "turn_on"}
    if trigger_both:
        action.update(trigger="both", end_action={"id": "turn_off"})
    store.schedules = [make_schedule("s1", ["d1"], [{"start": 18, "end": 22, "action": action}],
                                    enabled=enabled, days=days)]
    hass.states.async_set("switch.lamp", "off")
    return store.schedules[0]


async def test_block_start_dispatches_once_with_chronos_context(hass, store, scheduler, calls, events, clock):
    _lamp(store, hass)
    await tick_at(scheduler, hass, clock, 18, 0)
    assert names(calls) == ["switch.turn_on"]
    assert calls[0].data["entity_id"] == "switch.lamp"
    assert chained_to_chronos(calls[0], events), "logbook must attribute the change to Chronos"
    await tick_at(scheduler, hass, clock, 18, 30)
    assert names(calls) == ["switch.turn_on"], "same block, no re-dispatch"


async def test_block_end_sends_the_end_action_with_context(hass, store, scheduler, calls, events, clock):
    _lamp(store, hass)
    await tick_at(scheduler, hass, clock, 18, 0)
    await tick_at(scheduler, hass, clock, 22, 0)
    assert names(calls) == ["switch.turn_on", "switch.turn_off"]
    assert chained_to_chronos(calls[1], events), "end-of-block switch-off must be attributed too"


async def test_block_without_the_end_switch_never_switches_off(hass, store, scheduler, calls, clock):
    _lamp(store, hass, trigger_both=False)
    await tick_at(scheduler, hass, clock, 18, 0)
    await tick_at(scheduler, hass, clock, 22, 0)
    assert names(calls) == ["switch.turn_on"]


async def test_following_block_defines_the_state_no_end_action_in_between(hass, store, scheduler, calls, clock):
    store.devices = [make_device("d1", "light.lamp", "light")]
    store.schedules = [make_schedule("s1", ["d1"], [
        {"start": 18, "end": 20, "action": {"id": "turn_on", "value": 80, "trigger": "both", "end_action": {"id": "turn_off"}}},
        {"start": 20, "end": 22, "action": {"id": "turn_on", "value": 30}},
    ], dtype="light")]
    hass.states.async_set("light.lamp", "off")
    await tick_at(scheduler, hass, clock, 18, 0)
    await tick_at(scheduler, hass, clock, 20, 0)
    assert names(calls) == ["light.turn_on", "light.turn_on"], "no turn_off flicker between the two blocks"


async def test_disabled_schedule_never_acts(hass, store, scheduler, calls, clock):
    _lamp(store, hass, enabled=False)
    for h in (18, 20, 22):
        await tick_at(scheduler, hass, clock, h, 0)
    assert calls == []


async def test_day_mask_is_respected(hass, store, scheduler, calls, clock):
    _lamp(store, hass, days=[0, 1, 1, 1, 1, 1, 1])  # every day but Monday, the test day
    await tick_at(scheduler, hass, clock, 18, 0)
    assert calls == []


async def test_restart_after_the_block_ended_fires_nothing(hass, store, calls, clock):
    _lamp(store, hass)
    fresh = ChronosScheduler(hass, store)
    await tick_at(fresh, hass, clock, 22, 5)
    assert calls == [], "an empty _last_executed must not produce a spurious end action"


async def test_restart_inside_the_block_catches_up(hass, store, calls, clock):
    _lamp(store, hass)
    fresh = ChronosScheduler(hass, store)
    await tick_at(fresh, hass, clock, 19, 0)
    assert names(calls) == ["switch.turn_on"]
