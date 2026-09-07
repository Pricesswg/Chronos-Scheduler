"""Presence simulation driven minute by minute through the real tick."""
from __future__ import annotations

from custom_components.chronos.scheduler import ChronosScheduler

from .conftest import make_device, make_schedule, tick_at

LIGHTS = ["light.sala", "light.cucina", "light.studio"]


def _setup(store, hass):
    store.devices = [make_device(f"d{i}", e, "light") for i, e in enumerate(LIGHTS)]
    store.schedules = [make_schedule("s1", [f"d{i}" for i in range(3)], [
        {"start": 18.5, "end": 23.5, "action": {
            "id": "turn_on", "value": 70, "mode": "presence",
            "presence_cycles": 4, "presence_min_min": 20, "presence_max_min": 90,
        }},
    ], dtype="light")]
    for e in LIGHTS:
        hass.states.async_set(e, "off")


async def _run(scheduler, hass, clock, calls, from_h, to_h):
    out = []
    for minute in range(from_h * 60, to_h * 60):
        before = len(calls)
        await tick_at(scheduler, hass, clock, minute // 60, minute % 60)
        for c in calls[before:]:
            out.append((minute, c.service, c.data["entity_id"]))
    return out


async def test_evening_is_balanced_inside_the_window_and_ends_off(hass, store, scheduler, calls, clock):
    _setup(store, hass)
    log = await _run(scheduler, hass, clock, calls, 18, 24)
    ons = [x for x in log if x[1] == "turn_on"]
    assert 1 <= len(ons) <= 4
    assert all(18 * 60 + 30 <= m < 23 * 60 + 30 for m, _, _ in ons), "activations stay inside the window"
    # Per entity: strictly alternating on/off, and off at the end.
    for e in LIGHTS:
        seq = [s for _, s, ent in log if ent == e]
        for a, b in zip(seq, seq[1:]):
            assert a != b, f"{e}: two {a} in a row"
        assert not seq or seq[-1] == "turn_off"
    # The block's normal start-of-block dispatch must not fire on all lights.
    assert log[0][1] == "turn_on"
    assert len({ent for _, s, ent in log if s == "turn_on" and _ == log[0][0]}) == 1


async def test_restart_mid_evening_resumes_the_same_plan(hass, store, scheduler, calls, clock):
    _setup(store, hass)
    full = await _run(scheduler, hass, clock, calls, 18, 24)
    calls.clear()
    for e in LIGHTS:
        hass.states.async_set(e, "off")
    fresh = ChronosScheduler(hass, store)
    resumed = await _run(fresh, hass, clock, calls, 20, 24)
    # The very first tick re-asserts whatever should be running at 20:00
    # (or nothing); everything after that must match the original evening.
    tail = [x for x in full if x[0] > 20 * 60]
    assert [x for x in resumed if x[0] > 20 * 60] == tail
