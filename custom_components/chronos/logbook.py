"""Logbook integration for Chronos.

Registers a describer for our three event types so HA's Logbook component
attributes scheduled actions to Chronos clearly. Without this module the
state_changed entry of a target entity (e.g. an input_boolean toggled at
the right time) shows only the bare service call, with no hint that
Chronos was the trigger source. With it, HA collects our event into the
context chain of the resulting state_changed and renders a friendly
"triggered by Chronos · <schedule name>" line in the activity feed.

The mechanism: the scheduler fires `chronos_block_executed` /
`chronos_rule_triggered` / `chronos_command_error` events with their own
Context, then makes the actual service call passing the same Context as
parent_id. HA's logbook follows the parent_id chain back to our event,
runs the describer registered here, and uses its returned `name` and
`message` to label the originating row.
"""
from __future__ import annotations

from typing import Callable

from homeassistant.core import Event, HomeAssistant, callback

from .const import (
    DOMAIN,
    EVENT_BLOCK_EXECUTED,
    EVENT_COMMAND_ERROR,
    EVENT_RULE_TRIGGERED,
)


@callback
def async_describe_events(
    hass: HomeAssistant,
    async_describe_event: Callable[[str, str, Callable[[Event], dict]], None],
) -> None:
    """Tell the Logbook how to render Chronos events. Called once at setup
    by HA's logbook component when it discovers logbook.py in our domain."""

    @callback
    def describe_block(event: Event) -> dict:
        data = event.data
        sched = data.get("schedule_name") or data.get("schedule_id") or "?"
        action = data.get("action_id") or "executed"
        entity = data.get("entity_id")
        # Compose a sentence that reads naturally next to the affected
        # entity row in the activity log.
        msg = f"executed action {action}"
        if entity:
            msg = f"{msg} on {entity}"
        return {
            "name": f"Chronos · {sched}",
            "message": msg,
            "entity_id": entity,
        }

    @callback
    def describe_rule(event: Event) -> dict:
        data = event.data
        sched = data.get("schedule_name") or data.get("schedule_id") or "?"
        rule_idx = data.get("rule_idx")
        rule_str = data.get("rule_if") or (
            f"weather rule #{rule_idx + 1}" if isinstance(rule_idx, int) else "weather rule"
        )
        action = data.get("action_id") or "triggered"
        entity = data.get("entity_id")
        msg = f"triggered by {rule_str} → forced action {action}"
        return {
            "name": f"Chronos · {sched}",
            "message": msg,
            "entity_id": entity,
        }

    @callback
    def describe_error(event: Event) -> dict:
        data = event.data
        sched = data.get("schedule_name") or data.get("schedule_id") or "?"
        err = data.get("error") or "command failed"
        entity = data.get("entity_id")
        return {
            "name": f"Chronos · {sched}",
            "message": err,
            "entity_id": entity,
        }

    async_describe_event(DOMAIN, EVENT_BLOCK_EXECUTED, describe_block)
    async_describe_event(DOMAIN, EVENT_RULE_TRIGGERED, describe_rule)
    async_describe_event(DOMAIN, EVENT_COMMAND_ERROR, describe_error)
