"""Pause and resume through the WebSocket command the card uses (issue #39).
The other pause tests call the scheduler directly; this one goes through the
real command, so it covers what the card actually sends: a string to pause,
null to resume."""
from __future__ import annotations

from custom_components.chronos import _register_websocket_commands
from custom_components.chronos.const import DOMAIN

from .conftest import make_device, make_schedule


async def test_resume_from_the_card(hass, hass_ws_client, store, scheduler):
    # The whole integration needs HA's frontend package, absent from the test
    # environment: register only the WebSocket commands, on a real store.
    # No frozen clock: the WebSocket auth token would look issued in the future.
    hass.data[DOMAIN] = {"store": store, "scheduler": scheduler}
    _register_websocket_commands(hass)
    store.devices = [make_device("d1", "climate.living", "thermostat")]
    store.schedules = [make_schedule("s1", ["d1"], [
        {"start": 0, "end": 8, "action": {"id": "set_temperature", "value": 18}},
        {"start": 8, "end": 24, "action": {"id": "set_temperature", "value": 20}},
    ], dtype="thermostat")]
    hass.states.async_set("climate.living", "heat", {"temperature": 20})

    ws = await hass_ws_client(hass)
    await ws.send_json({"id": 1, "type": "chronos/schedules/pause", "schedule_id": "s1",
                        "until": "2099-01-01T00:00:00"})
    paused = await ws.receive_json()
    assert paused["success"], paused
    assert paused["result"]["paused_until"]

    await ws.send_json({"id": 2, "type": "chronos/schedules/pause", "schedule_id": "s1", "until": None})
    resumed = await ws.receive_json()
    assert resumed["success"], resumed
    assert "paused_until" not in resumed["result"]
    assert "paused_until" not in store.get_schedule("s1")
