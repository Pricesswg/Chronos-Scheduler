"""A disabled schedule must not touch a device through ANY path.

Issue #21 and #23 (same user, three reports): "the schedule is off but the
light still switches on and off at the configured times". The tick is
obviously gated, but Chronos dispatches from several other places (rules,
holds, presence, on-demand scenes, offline recalls, the fire_block service),
so this test arms all of them at once on one disabled schedule and asserts
that nothing at all is sent, while an identical enabled schedule on another
device does act, proving the harness itself is not the reason for silence.
"""
from __future__ import annotations

from .conftest import local, make_device, make_schedule, names, tick_at


def _armed(store, hass, *, enabled: bool, sid="s1", ent="switch.aquarium", dev="d1"):
    """A schedule with everything that can dispatch attached to it."""
    store.devices.append(make_device(dev, ent))
    sched = make_schedule(sid, [dev], [
        # Same shape as the reported one: off / on / off across the day.
        {"start": 0, "end": 12, "action": {"id": "turn_off"}},
        {"start": 12, "end": 22, "action": {"id": "turn_on", "trigger": "both", "end_action": {"id": "turn_off"}}},
        {"start": 22, "end": 24, "action": {"id": "turn_off"}},
    ], enabled=enabled)
    store.schedules.append(sched)
    store.rules.extend([
        {
            "id": f"{sid}_force", "if": "temperature > 10", "then": "Force action", "effect": "force_action",
            "active": True, "fire_mode": "every", "action_id": "turn_on", "action_value": None,
            "targets": [{"schedule_id": sid, "block_index": None}],
        },
        {
            "id": f"{sid}_hold", "if": "illuminance", "then": "Hold", "effect": "hold", "active": True,
            "fire_mode": "every", "hold_variable": "illuminance", "hold_on": 20, "hold_off": 40,
            "hold_action_on": "turn_on", "hold_action_off": "turn_off",
            "targets": [{"schedule_id": sid, "block_index": 1}],
        },
    ])
    hass.states.async_set(ent, "off")
    return sched


async def test_a_disabled_schedule_is_silent_on_every_path(hass, store, scheduler, calls, clock):
    store.settings["weather_entity"] = "weather.casa"
    hass.states.async_set("weather.casa", "sunny", {"temperature": 25})
    hass.states.async_set("sensor.lux", "5")
    store.settings["weather_sensor_map"] = {"illuminance": "sensor.lux"}

    disabled = _armed(store, hass, enabled=False)
    # An off-recall armed before the schedule was disabled (the one path that
    # is not under the tick's gate, fixed in 1.37.2).
    scheduler._pending_recalls["s1:switch.aquarium"] = {
        "entity_id": "switch.aquarium", "schedule_id": "s1", "schedule_name": "s1",
        "mode": "off", "off_service": "switch.turn_off", "action_id": "turn_off",
        "device_type": "plug", "attempts": 0, "armed_at": local(11).isoformat(),
    }
    scheduler._refresh_recall_listener()

    # A whole day, minute by minute around every edge of the schedule.
    for hour, minute in [(0, 0), (11, 59), (12, 0), (12, 1), (13, 0), (21, 59), (22, 0), (22, 1), (23, 59)]:
        await tick_at(scheduler, hass, clock, hour, minute)
    # The device coming back online is what fires a pending recall.
    hass.states.async_set("switch.aquarium", "on")
    await hass.async_block_till_done()
    # The service, too, refuses a disabled schedule.
    assert (await scheduler.fire_now("s1"))["ok"] is False

    assert calls == [], f"a disabled schedule dispatched: {names(calls)}"
    assert disabled.get("enabled") is False


async def test_an_identical_enabled_schedule_does_act(hass, store, scheduler, calls, clock):
    """Control: same setup, enabled, on a second device. If this one were
    silent too the test above would prove nothing."""
    store.settings["weather_entity"] = "weather.casa"
    hass.states.async_set("weather.casa", "sunny", {"temperature": 25})
    _armed(store, hass, enabled=False)
    _armed(store, hass, enabled=True, sid="s2", ent="switch.gazebo", dev="d2")

    await tick_at(scheduler, hass, clock, 12, 0)
    sent = [(c.service, c.data["entity_id"]) for c in calls]
    assert ("turn_on", "switch.gazebo") in sent
    assert not any(e == "switch.aquarium" for _, e in sent), "only the enabled twin acts"
