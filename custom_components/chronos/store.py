from __future__ import annotations

import uuid
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    DEVICELESS_SCHEDULE_TYPES,
    DOMAIN_TO_TYPE,
    HISTORY_MAX_ENTRIES,
    STORAGE_KEY_DEVICES,
    STORAGE_KEY_HISTORY,
    STORAGE_KEY_RULES,
    STORAGE_KEY_SCHEDULES,
    STORAGE_KEY_SEQUENCES,
    STORAGE_KEY_SETTINGS,
    STORAGE_VERSION,
    DEFAULT_SETTINGS,
)


def _migrate_rule(rule: dict) -> bool:
    """One-shot migration of a weather rule from pre-v1.7 schema to v1.7+.

    Returns True if the rule was modified.
    """
    if "effect" in rule:
        return False  # already migrated

    then_lower = (rule.get("then") or "").lower()
    trigger_action = rule.get("trigger_action") or {}

    if "salta" in then_lower or "skip" in then_lower:
        rule["effect"] = "skip"
    elif trigger_action:
        rule["effect"] = "force_action"
        rule["action_id"] = trigger_action.get("action_id")
        if "value" in trigger_action:
            rule["action_value"] = trigger_action["value"]
        rule.pop("trigger_action", None)
    else:
        # Could be a legacy "shift" / "duration" textual rule that was never
        # actually executed (the old scheduler ignored those). Default to skip.
        rule["effect"] = "skip"

    if "block_index" not in rule:
        rule["block_index"] = None  # = all blocks
    return True


class ChronosStore:
    def __init__(self, hass: HomeAssistant) -> None:
        self._hass = hass
        self._store_devices = Store(hass, STORAGE_VERSION, STORAGE_KEY_DEVICES)
        self._store_schedules = Store(hass, STORAGE_VERSION, STORAGE_KEY_SCHEDULES)
        self._store_settings = Store(hass, STORAGE_VERSION, STORAGE_KEY_SETTINGS)
        self._store_history = Store(hass, STORAGE_VERSION, STORAGE_KEY_HISTORY)
        self._store_sequences = Store(hass, STORAGE_VERSION, STORAGE_KEY_SEQUENCES)
        self._store_rules = Store(hass, STORAGE_VERSION, STORAGE_KEY_RULES)
        self.devices: list[dict[str, Any]] = []
        self.schedules: list[dict[str, Any]] = []
        # Weather rules v2: global list, each with a stable `id` and
        # `targets: [{schedule_id, block_index}]`. Effect params stay at
        # rule level; only the target block differs per schedule.
        self.rules: list[dict[str, Any]] = []
        self.settings: dict[str, Any] = {}
        # Map of currently-running sequential irrigation programs, keyed by
        # f"{schedule_id}:{block_idx}". Each value: {schedule_id,
        # schedule_name, entity_ids: [...], started_at: ISO}. Persisted on
        # every change so a restart can defensively close still-open valves.
        self.active_sequences: dict[str, dict[str, Any]] = {}
        # Append-only ring buffer of dispatch events. Capped at
        # HISTORY_MAX_ENTRIES; oldest dropped when full. Each entry is a
        # dict with: ts (ISO), schedule_id, schedule_name, kind
        # (block | rule | error), action_id, entity_id, value, outcome
        # (ok | error), error (str | None), rule_idx (int | None).
        self.history: list[dict[str, Any]] = []
        self._history_dirty = False

    async def async_load(self) -> None:
        self.devices = (await self._store_devices.async_load()) or []
        self.schedules = (await self._store_schedules.async_load()) or []
        self.rules = (await self._store_rules.async_load()) or []
        stored_settings = (await self._store_settings.async_load()) or {}
        self.settings = {**DEFAULT_SETTINGS, **stored_settings}
        self.history = (await self._store_history.async_load()) or []
        self.active_sequences = (await self._store_sequences.async_load()) or {}

        # v1.9 migration: drop legacy scene-as-device entries from v1.8.0.
        # Scenes are now selected per-block via the action's value field; the
        # generic dispatcher iterates over the entity_id list. Any remaining
        # device with type=="scene" is dead data — remove it and clean up
        # references in schedules.
        dropped_scene_ids = {d["id"] for d in self.devices if d.get("type") == "scene"}
        dirty_devices = bool(dropped_scene_ids)
        if dropped_scene_ids:
            self.devices = [d for d in self.devices if d.get("type") != "scene"]

        # Normalise ids to strings: some may have been stored as ints in
        # the past (171, 42, ...), today the WS commands require str.
        for d in self.devices:
            if not isinstance(d.get("id"), str):
                d["id"] = str(d.get("id", ""))
                dirty_devices = True
        dirty_schedules = False
        dirty_rules = False
        for s in self.schedules:
            if not isinstance(s.get("id"), str):
                s["id"] = str(s.get("id", ""))
                dirty_schedules = True
            ids = s.get("device_ids") or []
            if any(not isinstance(x, str) for x in ids):
                s["device_ids"] = [str(x) for x in ids]
                dirty_schedules = True
            # Drop references to legacy scene-as-device ids removed above.
            if dropped_scene_ids:
                cleaned = [x for x in (s.get("device_ids") or []) if x not in dropped_scene_ids]
                if len(cleaned) != len(s.get("device_ids") or []):
                    s["device_ids"] = cleaned
                    dirty_schedules = True
            # Same purge for any block-level device_ids overrides (v1.9+).
            for blk in s.get("blocks") or []:
                if not isinstance(blk, dict):
                    continue
                blk_ids = blk.get("device_ids")
                if isinstance(blk_ids, list) and dropped_scene_ids:
                    cleaned = [x for x in blk_ids if x not in dropped_scene_ids]
                    if len(cleaned) != len(blk_ids):
                        blk["device_ids"] = cleaned
                        dirty_schedules = True
                # Issue #7: blocks created before v1.12.6 may store end == 24
                # (the wizard's old default). The native <input type="time">
                # caps at 23:59 and our editor would show 23:00 for such
                # blocks while the chip header rendered 24:00 — visually
                # inconsistent. Functionally a block that ends at 23:59
                # covers the same range (the dispatcher uses start <= h < end
                # at minute resolution), so this migration is lossless.
                if blk.get("end") in (24, 24.0):
                    blk["end"] = 23 + 59 / 60
                    dirty_schedules = True
                if blk.get("start") in (24, 24.0):
                    blk["start"] = 23 + 59 / 60
                    dirty_schedules = True
            # v1.17 migration: weather rules move out of the schedule into
            # the global rules store, each with a stable id and a single
            # target pointing back at this schedule. The presence of the
            # `weather_rules` key marks a pre-migration schedule, so this
            # runs exactly once per schedule. The legacy pre-1.7 shim
            # (_migrate_rule) still runs first so very old rules arrive in
            # the v2 store already normalised.
            if "weather_rules" in s:
                for rule in s.get("weather_rules") or []:
                    _migrate_rule(rule)
                    block_index = rule.pop("block_index", None)
                    rule["id"] = uuid.uuid4().hex[:8]
                    rule["targets"] = [{
                        "schedule_id": s["id"],
                        "block_index": block_index if isinstance(block_index, int) else None,
                    }]
                    self.rules.append(rule)
                    dirty_rules = True
                del s["weather_rules"]
                dirty_schedules = True
            # Issue #4 defensive cleanup: device-based schedules left empty
            # by previous unlinks (before v1.11.4) might still have
            # enabled=true. Disable them on first load so the UI matches
            # reality (the dispatcher already skips them silently).
            if (
                s.get("device_type") not in DEVICELESS_SCHEDULE_TYPES
                and not (s.get("device_ids") or [])
                and s.get("enabled")
            ):
                s["enabled"] = False
                dirty_schedules = True
        if dirty_devices:
            await self._save_devices()
        if dirty_schedules:
            await self._save_schedules()
        if dirty_rules:
            await self._save_rules()

    async def _save_devices(self) -> None:
        await self._store_devices.async_save(self.devices)

    async def _save_schedules(self) -> None:
        await self._store_schedules.async_save(self.schedules)

    async def _save_rules(self) -> None:
        await self._store_rules.async_save(self.rules)

    async def _save_settings(self) -> None:
        await self._store_settings.async_save(self.settings)

    async def _save_sequences(self) -> None:
        await self._store_sequences.async_save(self.active_sequences)

    async def set_active_sequence(self, key: str, info: dict[str, Any]) -> None:
        """Mark a sequential irrigation program as in-flight and persist it
        immediately (small dict, written rarely: start/end of a program)."""
        self.active_sequences[key] = info
        await self._save_sequences()

    async def clear_active_sequence(self, key: str) -> None:
        if key in self.active_sequences:
            del self.active_sequences[key]
            await self._save_sequences()

    async def clear_all_sequences(self) -> None:
        if self.active_sequences:
            self.active_sequences = {}
            await self._save_sequences()

    async def async_remove_entity_from_sequences(self, entity_id: str) -> None:
        """Remove an entity from every in-flight entry; emptied entries
        are dropped. Used when an off-recall succeeds: that device no
        longer has a pending switch-off, the startup recovery must not
        care about it anymore."""
        dirty = False
        for key in list(self.active_sequences.keys()):
            info = self.active_sequences[key]
            ents = [e for e in (info.get("entity_ids") or []) if e != entity_id]
            if len(ents) != len(info.get("entity_ids") or []):
                dirty = True
                if ents:
                    self.active_sequences[key] = {**info, "entity_ids": ents}
                else:
                    self.active_sequences.pop(key, None)
        if dirty:
            await self._save_sequences()

    async def _save_history(self) -> None:
        await self._store_history.async_save(self.history)

    # --- History (append-only ring buffer for the History screen) ---

    def append_history(self, entry: dict[str, Any]) -> None:
        """Add an entry to the in-memory history list, trim to cap, mark
        dirty. Persisted to disk via flush_history (called periodically by
        the scheduler so we don't write on every block dispatch)."""
        self.history.append(entry)
        if len(self.history) > HISTORY_MAX_ENTRIES:
            # Drop oldest entries to stay within cap.
            self.history = self.history[-HISTORY_MAX_ENTRIES:]
        self._history_dirty = True

    async def flush_history(self) -> None:
        """Persist the in-memory history buffer to disk if dirty."""
        if self._history_dirty:
            await self._save_history()
            self._history_dirty = False

    async def clear_history(self) -> None:
        self.history = []
        self._history_dirty = False
        await self._save_history()

    # --- Devices ---

    def get_device(self, device_id: str) -> dict[str, Any] | None:
        return next((d for d in self.devices if d["id"] == device_id), None)

    async def async_add_device(
        self, entity_id: str, alias: str | None = None, area: str | None = None
    ) -> dict[str, Any]:
        domain = entity_id.split(".")[0]
        device_type = DOMAIN_TO_TYPE.get(domain)
        if device_type is None:
            raise ValueError(f"Unsupported domain: {domain}")

        if any(d["entity_id"] == entity_id for d in self.devices):
            raise ValueError(f"Entity already added: {entity_id}")

        state = self._hass.states.get(entity_id)
        friendly_name = ""
        if state and state.attributes.get("friendly_name"):
            friendly_name = state.attributes["friendly_name"]

        device = {
            "id": uuid.uuid4().hex[:8],
            "entity_id": entity_id,
            "alias": alias or friendly_name or entity_id,
            "area": area or "",
            "type": device_type,
        }
        self.devices.append(device)
        await self._save_devices()
        return device

    async def async_update_device(self, device_id: str, patch: dict[str, Any]) -> dict[str, Any]:
        device = self.get_device(device_id)
        if device is None:
            raise ValueError(f"Device not found: {device_id}")
        allowed = {"alias", "area"}
        for key in allowed & patch.keys():
            device[key] = patch[key]
        await self._save_devices()
        return device

    async def async_remove_device(self, device_id: str) -> None:
        self.devices = [d for d in self.devices if d["id"] != device_id]
        for sched in self.schedules:
            sched["device_ids"] = [did for did in sched["device_ids"] if did != device_id]
            # Issue #4: auto-disable a device-based schedule whose target
            # list just emptied out, so the user gets clear visual feedback
            # (toggle off) instead of a schedule that says "active" but
            # silently dispatches nothing. Deviceless schedule types
            # (scene/automation/service) reference entities per-block via
            # the action value, so device removal doesn't affect them.
            if (
                sched.get("device_type") not in DEVICELESS_SCHEDULE_TYPES
                and not sched["device_ids"]
                and sched.get("enabled")
            ):
                sched["enabled"] = False
        await self._save_devices()
        await self._save_schedules()

    # --- Schedules ---

    def get_schedule(self, schedule_id: str) -> dict[str, Any] | None:
        return next((s for s in self.schedules if s["id"] == schedule_id), None)

    async def async_save_schedule(self, schedule: dict[str, Any]) -> dict[str, Any]:
        # v1.17+: rules live in the global store. A stale (cached) frontend
        # may still send the legacy embedded list; drop it so it can't
        # resurrect pre-migration data inside the schedule document.
        schedule.pop("weather_rules", None)
        if not schedule.get("id"):
            schedule["id"] = uuid.uuid4().hex[:8]

        existing = self.get_schedule(schedule["id"])
        if existing:
            idx = self.schedules.index(existing)
            self.schedules[idx] = schedule
        else:
            self.schedules.append(schedule)

        await self._save_schedules()
        return schedule

    async def async_remove_schedule(self, schedule_id: str) -> None:
        self.schedules = [s for s in self.schedules if s["id"] != schedule_id]
        await self._save_schedules()
        # Unlink the deleted schedule from every rule. Rules left with no
        # targets are kept (visible in the UI as unassigned) so a schedule
        # delete never silently destroys a rule shared with others.
        dirty = False
        for rule in self.rules:
            targets = rule.get("targets") or []
            kept = [tg for tg in targets if str(tg.get("schedule_id")) != str(schedule_id)]
            if len(kept) != len(targets):
                rule["targets"] = kept
                dirty = True
        if dirty:
            await self._save_rules()

    async def async_toggle_schedule(self, schedule_id: str, enabled: bool) -> None:
        sched = self.get_schedule(schedule_id)
        if sched is None:
            raise ValueError(f"Schedule not found: {schedule_id}")
        sched["enabled"] = enabled
        await self._save_schedules()

    # --- Weather rules (v2, global store) ---

    def get_rule(self, rule_id: str) -> dict[str, Any] | None:
        return next((r for r in self.rules if r.get("id") == rule_id), None)

    async def async_save_rule(self, rule: dict[str, Any]) -> dict[str, Any]:
        if not rule.get("id"):
            rule["id"] = uuid.uuid4().hex[:8]
        # Normalise targets: schedule_id as str, block_index int or None.
        targets = []
        for tgt in rule.get("targets") or []:
            if not isinstance(tgt, dict):
                continue
            sid = tgt.get("schedule_id")
            if not sid:
                continue
            bi = tgt.get("block_index")
            targets.append({
                "schedule_id": str(sid),
                "block_index": bi if isinstance(bi, int) else None,
            })
        rule["targets"] = targets
        existing = self.get_rule(rule["id"])
        if existing:
            self.rules[self.rules.index(existing)] = rule
        else:
            self.rules.append(rule)
        await self._save_rules()
        return rule

    async def async_remove_rule(self, rule_id: str) -> None:
        self.rules = [r for r in self.rules if r.get("id") != rule_id]
        await self._save_rules()

    async def async_reorder_rules(self, order: list[str]) -> None:
        """Reorder the global rules list to match `order` (a list of rule
        ids). Rules whose id isn't in `order` (shouldn't happen, but be
        defensive) keep their relative position at the end. The stored
        array order is what the UI and the scheduler iterate, so persisting
        it is all that's needed to make a manual order stick."""
        pos = {rid: i for i, rid in enumerate(order)}
        tail = len(pos)
        # Stable sort: rules sharing the fallback key keep prior order.
        self.rules.sort(key=lambda r: pos.get(r.get("id"), tail))
        await self._save_rules()

    # --- Settings ---

    async def async_update_settings(self, patch: dict[str, Any]) -> dict[str, Any]:
        self.settings.update(patch)
        await self._save_settings()
        return self.settings
