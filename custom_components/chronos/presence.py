"""Presence simulation: drive the day's plan from timing.presence_plan on
every tick, re-asserting the activation that should be running."""
from __future__ import annotations

import logging

from .const import ACTIONS_BY_TYPE
from .timing import presence_plan

_LOGGER = logging.getLogger(__name__)



class PresenceMixin:
    """Methods of ChronosScheduler that live here for readability. They run
    on the scheduler instance and use its attributes (_hass, _store, the
    per-feature state dicts set up in ChronosScheduler.__init__)."""

    async def _evaluate_presence(
        self, sched: dict, local_now, current_block: dict | None, current_idx: int,
    ) -> None:
        """Presence simulation: inside the block's window, switch devices on
        and off at times drawn for today, instead of holding one state for
        the whole window.

        The user owns the ceiling (how many activations, how long each may
        last) and the action; which minute and which device is ours, because
        that is the part that has to look unplanned. Today's plan is derived
        from a hash, so every tick rebuilds the same one and a restart in the
        middle of the evening picks it straight back up.
        """
        sched_id = str(sched.get("id", ""))
        action = (current_block or {}).get("action") or {}
        active_presence = action.get("mode") == "presence"

        # Close any activation left running when the window (or the mode) is
        # gone. Without this the last device of the evening would stay on.
        for key in list(self._presence_state):
            if key.startswith(f"{sched_id}:") and (
                not active_presence or key != f"{sched_id}:{current_idx}"
            ):
                await self._presence_switch_off(sched, key)

        if not active_presence:
            return

        entities = self._presence_entities(sched, current_block)
        if not entities:
            return

        try:
            cycles = int(action.get("presence_cycles") or 3)
            dur_min = float(action.get("presence_min_min") or 20)
            dur_max = float(action.get("presence_max_min") or 90)
        except (TypeError, ValueError):
            return

        block_start = self._resolve_block_time(current_block, "start")
        block_end = self._resolve_block_time(current_block, "end")
        plan = presence_plan(
            f"{sched_id}:{current_idx}:{local_now.date().isoformat()}",
            block_start, block_end, cycles, dur_min, dur_max, len(entities),
        )
        if not plan:
            return

        now_h = local_now.hour + local_now.minute / 60
        cycle_idx = next(
            (i for i, c in enumerate(plan) if c["start"] <= now_h < c["end"]),
            None,
        )

        key = f"{sched_id}:{current_idx}"
        state = self._presence_state.setdefault(key, {"cycle": None, "entity": None})
        if state["cycle"] == cycle_idx:
            return

        # Leaving an activation: switch its device off before the next one.
        if state["entity"]:
            await self._presence_switch_off(sched, key, keep_state=True)

        state["cycle"] = cycle_idx
        state["entity"] = None
        if cycle_idx is None:
            return

        entity_id = entities[min(plan[cycle_idx]["device"], len(entities) - 1)]
        state["entity"] = entity_id
        _LOGGER.info(
            "Chronos: PRESENCE schedule=%s cycle %d/%d on %s until %.2f",
            sched.get("name", "?"), cycle_idx + 1, len(plan), entity_id,
            plan[cycle_idx]["end"],
        )
        # Reuse the normal dispatcher on a single device: History, extras and
        # offline handling all behave as they do for a regular block. The
        # mode is dropped so the presence guard doesn't skip this one.
        on_action = {k: v for k, v in action.items() if k not in ("mode", "presence_cycles", "presence_min_min", "presence_max_min")}
        await self._dispatch_action(
            sched, {"start": 0, "end": 0, "action": on_action, "device_ids": [
                d for d in (sched.get("device_ids") or [])
                if (self._store.get_device(d) or {}).get("entity_id") == entity_id
            ]},
        )


    def _presence_entities(self, sched: dict, block: dict | None) -> list[str]:
        """Entity ids the presence simulation may pick from: the block's own
        device subset when it has one, the schedule's devices otherwise."""
        sched_ids = sched.get("device_ids", []) or []
        subset = (block or {}).get("device_ids")
        ids = [d for d in subset if d in set(sched_ids)] if isinstance(subset, list) and subset else list(sched_ids)
        out = []
        for device_id in ids:
            device = self._store.get_device(device_id)
            if device and device.get("entity_id"):
                out.append(device["entity_id"])
        return out


    async def _presence_switch_off(self, sched: dict, key: str, keep_state: bool = False) -> None:
        """Switch off whatever the presence simulation last turned on."""
        state = self._presence_state.get(key)
        entity_id = (state or {}).get("entity")
        if entity_id:
            off_def = next(
                (a for a in ACTIONS_BY_TYPE.get(sched.get("device_type", ""), [])
                 if a.get("kind") == "off"),
                None,
            )
            if off_def and off_def.get("service"):
                await self._off_or_arm(sched, entity_id, off_def["service"], off_def["id"])
        if keep_state and state is not None:
            state["entity"] = None
        else:
            self._presence_state.pop(key, None)
