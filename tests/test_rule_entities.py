"""Rules may name on/off entities directly: workday sensor, calendars,
input booleans, HA schedule helpers, people."""
from __future__ import annotations

from .conftest import make_device, make_schedule, names, tick_at


async def test_state_entities_compare_as_text(hass, store, scheduler):
    hass.states.async_set("binary_sensor.workday_sensor", "off")
    hass.states.async_set("calendar.ferie", "on", {"message": "Ferie"})
    hass.states.async_set("input_boolean.ospiti", "on")
    hass.states.async_set("person.alessandro", "not_home")
    assert scheduler._evaluate_single_clause("binary_sensor.workday_sensor == off")
    assert not scheduler._evaluate_single_clause("binary_sensor.workday_sensor == on")
    assert scheduler._evaluate_single_clause("calendar.ferie == on")
    assert scheduler._evaluate_single_clause("input_boolean.ospiti != off")
    assert scheduler._evaluate_single_clause("person.alessandro != home")
    assert not scheduler._evaluate_single_clause("calendar.missing == on"), "unknown entity never matches"


async def test_skip_rule_on_a_public_holiday(hass, store, scheduler, calls, clock):
    store.devices = [make_device("d1", "switch.coffee")]
    store.schedules = [make_schedule("s1", ["d1"], [{"start": 6.5, "end": 7, "action": {"id": "turn_on"}}])]
    store.rules = [{
        "id": "r1", "if": "binary_sensor.workday_sensor == off", "then": "Skip",
        "effect": "skip", "active": True, "fire_mode": "every",
        "targets": [{"schedule_id": "s1", "block_index": None}],
    }]
    hass.states.async_set("switch.coffee", "off")
    hass.states.async_set("binary_sensor.workday_sensor", "off")
    await tick_at(scheduler, hass, clock, 6, 30)
    assert calls == [], "public holiday: the block is skipped"
    await tick_at(scheduler, hass, clock, 7, 30)
    hass.states.async_set("binary_sensor.workday_sensor", "on")
    await tick_at(scheduler, hass, clock, 6, 30, day="2026-09-08")
    assert names(calls) == ["switch.turn_on"], "workday: the block fires"
