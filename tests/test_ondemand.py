"""On-demand scenes: armed at block start, applied when a member is switched
on by hand during the block, never on their own, disarmed at block end."""
from __future__ import annotations

from .conftest import make_schedule, tick_at


def _scene(store, hass, *, lights_on=()):
    store.devices = []
    store.schedules = [make_schedule("s1", [], [
        {"start": 18, "end": 23, "action": {"id": "activate", "mode": "on_demand", "value": "scene.serata"}},
    ], dtype="scene")]
    hass.states.async_set("scene.serata", "unknown", {"entity_id": ["light.a", "light.b"]})
    for e in ("light.a", "light.b"):
        hass.states.async_set(e, "on" if e in lights_on else "off")


def _scenes(calls):
    return [c.data["entity_id"] for c in calls if c.domain == "scene"]


async def test_scene_waits_for_a_manual_turn_on(hass, store, scheduler, calls, clock):
    _scene(store, hass)
    await tick_at(scheduler, hass, clock, 18, 0)
    assert _scenes(calls) == [], "nothing lights up on its own"
    assert "s1" in scheduler._pending_scenes
    hass.states.async_set("light.a", "on")
    await hass.async_block_till_done()
    assert _scenes(calls) == ["scene.serata"], "a member switched on by hand gets the scene"
    hass.states.async_set("light.b", "on")
    await hass.async_block_till_done()
    assert _scenes(calls) == ["scene.serata"], "the scene's own echo is suppressed"
    await tick_at(scheduler, hass, clock, 23, 30)
    assert scheduler._pending_scenes == {}, "disarmed when the block ends"


async def test_members_already_on_get_the_scene_at_block_start(hass, store, scheduler, calls, clock):
    _scene(store, hass, lights_on=("light.a",))
    await tick_at(scheduler, hass, clock, 18, 0)
    assert _scenes(calls) == ["scene.serata"]


async def test_turn_off_and_brightness_changes_do_not_fire(hass, store, scheduler, calls, clock):
    _scene(store, hass)
    await tick_at(scheduler, hass, clock, 18, 0)
    hass.states.async_set("light.a", "off", {"brightness": 0})
    await hass.async_block_till_done()
    assert _scenes(calls) == []
