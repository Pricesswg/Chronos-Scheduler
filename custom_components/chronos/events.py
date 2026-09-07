"""History entries, Chronos events and the context chain that makes the HA
logbook attribute a state change to Chronos."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.core import Context, HomeAssistant
from homeassistant.util import dt as dt_util

from .const import ACTIONS_BY_TYPE

_LOGGER = logging.getLogger(__name__)


def get_action_def(device_type: str, action_id: str) -> dict[str, Any] | None:
    actions = ACTIONS_BY_TYPE.get(device_type, [])
    return next((a for a in actions if a["id"] == action_id), None)




def make_history_entry(
    sched: dict,
    *,
    kind: str,
    action_id: str,
    entity_id: str | None,
    value: Any = None,
    outcome: str = "ok",
    error: str | None = None,
    rule_idx: int | None = None,
    rule_id: str | None = None,
) -> dict[str, Any]:
    """Build a history entry. Schedule name is snapshotted so deletions
    don't lose context for past entries. rule_idx is the legacy positional
    reference (pre-1.17 entries); new rule firings carry rule_id."""
    return {
        "ts": dt_util.utcnow().isoformat(),
        "schedule_id": str(sched.get("id", "")),
        "schedule_name": sched.get("name", ""),
        "device_type": sched.get("device_type", ""),
        "kind": kind,
        "action_id": action_id,
        "entity_id": entity_id,
        "value": value,
        "outcome": outcome,
        "error": error,
        "rule_idx": rule_idx,
        "rule_id": rule_id,
    }




def fire_with_context(
    hass: HomeAssistant,
    event_type: str,
    data: dict[str, Any],
    sched: dict,
) -> Context:
    """Fire a Chronos event with its own Context, augment the data with
    schedule name (snapshotted for the logbook describer), and return a
    child Context whose parent_id points at the just-fired event. The
    caller passes that child Context to async_call so HA chains the
    resulting state_changed back to our event in the logbook timeline."""
    parent_ctx = Context()
    enriched = {
        "schedule_id": str(sched.get("id", "")),
        "schedule_name": sched.get("name", ""),
        **data,
    }
    hass.bus.async_fire(event_type, enriched, context=parent_ctx)
    return Context(parent_id=parent_ctx.id)




async def log_to_logbook(
    hass: HomeAssistant,
    sched: dict,
    *,
    action_id: str,
    entity_id: str | None,
    extra: str = "",
) -> None:
    """Write a logbook entry via HA's `logbook.log` service. Issue #5:
    the chronos custom event was visible in the global Activity timeline
    via async_describe_event, but not when the user filtered the timeline
    by a specific entity. logbook.log writes a LOGBOOK_ENTRY which HA
    indexes by entity_id, so the resulting line appears in both the
    unfiltered view and in entity-scoped searches. We keep firing the
    chronos_block_executed event for our own History screen consumers
    (the WS endpoint reads the in-store ring buffer, not the logbook).
    """
    if not entity_id:
        return
    try:
        msg = f"executed action {action_id}"
        if extra:
            msg = f"{msg} ({extra})"
        await hass.services.async_call(
            "logbook",
            "log",
            {
                "name": f"Chronos · {sched.get('name', '?')}",
                "message": msg,
                "domain": "chronos",
                "entity_id": entity_id,
            },
            blocking=False,
        )
    except Exception:
        # Logbook is non-critical: don't let a logbook.log hiccup break
        # the actual dispatch. Errors are logged at debug level only.
        _LOGGER.debug("Chronos: logbook.log failed for %s", entity_id, exc_info=True)
