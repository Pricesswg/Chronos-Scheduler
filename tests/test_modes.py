"""Modes: a schedule restricted to some modes is idle in the others, and a
mode switch closes what leaves and applies what enters, at once."""
from __future__ import annotations

from datetime import datetime

from custom_components.chronos.gate import schedule_is_live, schedule_runs_in_mode

from .conftest import make_device, make_schedule, tick_at

NOON = datetime(2026, 9, 7, 12, 0)


def test_gate_reads_the_modes():
    sched = {"enabled": True, "days": [1] * 7}
    assert schedule_is_live(sched, NOON, mode="away") is None, "no list: every mode"
    assert schedule_is_live({**sched, "modes": []}, NOON, mode="away") is None, "empty list: every mode"
    assert schedule_is_live({**sched, "modes": ["home"]}, NOON, mode="home") is None
    assert schedule_is_live({**sched, "modes": ["home"]}, NOON, mode="away") == "not active in mode away"
    assert schedule_is_live({**sched, "modes": ["home"]}, NOON) is None, "no mode given: no check"
    assert schedule_runs_in_mode(None, "home")


def _two(store, hass):
    store.devices = [make_device("d1", "switch.lamp"), make_device("d2", "switch.porch")]
    both = {"id": "turn_on", "trigger": "both", "end_action": {"id": "turn_off"}}
    store.schedules = [
        {**make_schedule("home_only", ["d1"], [{"start": 18, "end": 22, "action": dict(both)}]), "modes": ["home"]},
        {**make_schedule("away_only", ["d2"], [{"start": 18, "end": 22, "action": dict(both)}]), "modes": ["away"]},
    ]
    hass.states.async_set("switch.lamp", "off")
    hass.states.async_set("switch.porch", "off")


def _by_entity(calls):
    return [(c.service, c.data["entity_id"]) for c in calls]


async def test_mode_switch_closes_leaving_and_applies_entering(hass, store, scheduler, calls, clock):
    _two(store, hass)
    await tick_at(scheduler, hass, clock, 19, 0)
    assert _by_entity(calls) == [("turn_on", "switch.lamp")], "home: only the home schedule acts"
    result = await scheduler.set_mode("away")
    await hass.async_block_till_done()
    assert result == {"ok": True, "mode": "away"}
    assert store.settings["mode"] == "away"
    assert _by_entity(calls)[1:] == [("turn_off", "switch.lamp"), ("turn_on", "switch.porch")], \
        "the lamp's end action goes out, the porch block applies at once"
    await tick_at(scheduler, hass, clock, 20, 0)
    assert len(calls) == 3, "nothing new while the mode is stable"
    await scheduler.set_mode("home")
    await hass.async_block_till_done()
    assert _by_entity(calls)[3:] == [("turn_off", "switch.porch"), ("turn_on", "switch.lamp")]


async def test_unknown_mode_is_refused_and_same_mode_is_a_noop(hass, store, scheduler, calls, clock):
    _two(store, hass)
    assert (await scheduler.set_mode("party"))["ok"] is False
    assert await scheduler.set_mode("home") == {"ok": True, "mode": "home"}
    assert calls == []


async def test_status_is_idle_outside_the_schedule_modes(hass, store, scheduler, clock):
    _two(store, hass)
    clock.move_to(__import__("tests.conftest", fromlist=["local"]).local(19))
    assert scheduler.schedule_status(store.schedules[0])["running"] is True
    assert scheduler.schedule_status(store.schedules[1])["running"] is False


async def test_modes_survive_a_save(hass, store):
    _two(store, hass)
    saved = await store.async_save_schedule({**store.schedules[1], "name": "renamed"})
    assert saved.get("modes") == ["away"]
    assert store.get_schedule("away_only").get("modes") == ["away"]
