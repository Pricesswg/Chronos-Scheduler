"""Issue #35: a skip rule can resume its block when the condition clears.
Issue #34: set_temperature carries hvac_mode in the same call."""
from __future__ import annotations

from .conftest import make_device, make_schedule, names, tick_at


def _heating(store, hass, *, resume=True, extra_rule=None):
    store.devices = [make_device("d1", "switch.heater")]
    store.schedules = [make_schedule("s1", ["d1"], [{"start": 6, "end": 22, "action": {"id": "turn_on"}}])]
    rules = [{
        "id": "r1", "if": "binary_sensor.presence == off", "then": "Skip", "effect": "skip",
        "active": True, "resume": resume, "targets": [{"schedule_id": "s1", "block_index": None}],
    }]
    if extra_rule:
        rules.append(extra_rule)
    store.rules = rules
    hass.states.async_set("switch.heater", "off")
    hass.states.async_set("binary_sensor.presence", "off")


async def test_the_block_runs_as_soon_as_the_condition_clears(hass, store, scheduler, calls, clock):
    _heating(store, hass)
    await tick_at(scheduler, hass, clock, 6, 0)
    assert calls == [], "skipped while nobody is home"
    await tick_at(scheduler, hass, clock, 8, 0)
    assert calls == []
    hass.states.async_set("binary_sensor.presence", "on")
    await tick_at(scheduler, hass, clock, 9, 0)
    assert names(calls) == ["switch.turn_on"], "the active block runs"
    assert any(e.get("action_id") == "resume" for e in store.history)
    await tick_at(scheduler, hass, clock, 9, 1)
    assert len(calls) == 1, "once, not every minute"


async def test_without_the_option_nothing_changes(hass, store, scheduler, calls, clock):
    _heating(store, hass, resume=False)
    await tick_at(scheduler, hass, clock, 6, 0)
    hass.states.async_set("binary_sensor.presence", "on")
    await tick_at(scheduler, hass, clock, 9, 0)
    assert calls == [], "a plain skip still holds for the whole block"


async def test_no_resume_after_the_block_has_ended(hass, store, scheduler, calls, clock):
    _heating(store, hass)
    await tick_at(scheduler, hass, clock, 6, 0)
    await tick_at(scheduler, hass, clock, 22, 0)
    hass.states.async_set("binary_sensor.presence", "on")
    await tick_at(scheduler, hass, clock, 22, 30)
    assert calls == []


async def test_a_second_skip_rule_still_holding_keeps_it_skipped(hass, store, scheduler, calls, clock):
    _heating(store, hass, extra_rule={
        "id": "r2", "if": "binary_sensor.window == on", "then": "Skip", "effect": "skip",
        "active": True, "resume": True, "targets": [{"schedule_id": "s1", "block_index": None}],
    })
    hass.states.async_set("binary_sensor.window", "on")
    await tick_at(scheduler, hass, clock, 6, 0)
    hass.states.async_set("binary_sensor.presence", "on")
    await tick_at(scheduler, hass, clock, 9, 0)
    assert calls == [], "the window is still open"
    hass.states.async_set("binary_sensor.window", "off")
    await tick_at(scheduler, hass, clock, 9, 5)
    assert names(calls) == ["switch.turn_on"]


async def test_a_non_resumable_rule_among_the_skippers_blocks_resuming(hass, store, scheduler, calls, clock):
    _heating(store, hass, extra_rule={
        "id": "r2", "if": "binary_sensor.window == on", "then": "Skip", "effect": "skip",
        "active": True, "targets": [{"schedule_id": "s1", "block_index": None}],
    })
    hass.states.async_set("binary_sensor.window", "on")
    await tick_at(scheduler, hass, clock, 6, 0)
    hass.states.async_set("binary_sensor.presence", "on")
    hass.states.async_set("binary_sensor.window", "off")
    await tick_at(scheduler, hass, clock, 9, 0)
    assert calls == [], "the window rule did not allow resuming"


def test_set_temperature_carries_hvac_mode(scheduler):
    data = scheduler._build_service_data(
        "thermostat", "set_temperature", {"id": "set_temperature", "value": 21, "extras": {"hvac_mode": "heat"}},
        "climate.living",
    )
    assert data == {"entity_id": "climate.living", "temperature": 21.0, "hvac_mode": "heat"}
    plain = scheduler._build_service_data("thermostat", "set_temperature", {"value": 21}, "climate.living")
    assert "hvac_mode" not in plain, "without the extra the call is unchanged"
