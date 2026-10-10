"""Notifications: a skipped block produces exactly one, in English.

Issue #31: both `notify_rule_triggered` and `notify_sched_skipped` describe
the same event, so every skip sent two notifications, one of them a leftover
Italian string and the other calling every rule a weather rule.
"""
from __future__ import annotations

import pytest

from .conftest import make_device, make_schedule, tick_at


@pytest.fixture
def notifications(hass) -> list:
    sent: list = []

    async def handler(call):
        sent.append(call.data)

    hass.services.async_register("persistent_notification", "create", handler)
    return sent


def _skipping(store, hass, **settings):
    store.devices = [make_device("d1", "switch.pump")]
    store.schedules = [make_schedule("s1", ["d1"], [{"start": 6, "end": 7, "action": {"id": "turn_on"}}])]
    store.rules = [{
        "id": "r1", "if": "binary_sensor.workday_sensor == off", "then": "Skip",
        "effect": "skip", "active": True, "fire_mode": "every",
        "targets": [{"schedule_id": "s1", "block_index": None}],
    }]
    store.settings.update(settings)
    hass.states.async_set("switch.pump", "off")
    hass.states.async_set("binary_sensor.workday_sensor", "off")


async def test_a_skip_sends_exactly_one_notification(hass, store, scheduler, calls, clock, notifications):
    _skipping(store, hass, notify_rule_triggered=True, notify_sched_skipped=True)
    await tick_at(scheduler, hass, clock, 6, 0)
    assert calls == [], "the block was skipped"
    assert len(notifications) == 1, notifications
    message = notifications[0]["message"]
    assert message == "Block skipped by rule: binary_sensor.workday_sensor == off"
    assert "weather" not in message.lower(), "not every rule is a weather rule"
    assert "Regola" not in message, "the backend speaks English"


@pytest.mark.parametrize("settings", [
    {"notify_rule_triggered": True, "notify_sched_skipped": False},
    {"notify_rule_triggered": False, "notify_sched_skipped": True},
])
async def test_either_setting_alone_still_notifies_once(hass, store, scheduler, clock, notifications, settings):
    _skipping(store, hass, **settings)
    await tick_at(scheduler, hass, clock, 6, 0)
    assert len(notifications) == 1


async def test_both_off_means_silence(hass, store, scheduler, clock, notifications):
    _skipping(store, hass, notify_rule_triggered=False, notify_sched_skipped=False)
    await tick_at(scheduler, hass, clock, 6, 0)
    assert notifications == []
