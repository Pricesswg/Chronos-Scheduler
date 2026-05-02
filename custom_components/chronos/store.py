from __future__ import annotations

import uuid
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    DOMAIN,
    DOMAIN_TO_TYPE,
    STORAGE_KEY_DEVICES,
    STORAGE_KEY_SCHEDULES,
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
        self.devices: list[dict[str, Any]] = []
        self.schedules: list[dict[str, Any]] = []
        self.settings: dict[str, Any] = {}

    async def async_load(self) -> None:
        self.devices = (await self._store_devices.async_load()) or []
        self.schedules = (await self._store_schedules.async_load()) or []
        stored_settings = (await self._store_settings.async_load()) or {}
        self.settings = {**DEFAULT_SETTINGS, **stored_settings}

        # Normalizza gli id a stringa: in passato alcuni potrebbero essere stati
        # salvati come int (171, 42, …), oggi le WS richiedono str.
        dirty_devices = False
        for d in self.devices:
            if not isinstance(d.get("id"), str):
                d["id"] = str(d.get("id", ""))
                dirty_devices = True
        dirty_schedules = False
        for s in self.schedules:
            if not isinstance(s.get("id"), str):
                s["id"] = str(s.get("id", ""))
                dirty_schedules = True
            ids = s.get("device_ids") or []
            if any(not isinstance(x, str) for x in ids):
                s["device_ids"] = [str(x) for x in ids]
                dirty_schedules = True
            # Migra le weather_rules al nuovo schema (v1.7+)
            for rule in s.get("weather_rules") or []:
                if _migrate_rule(rule):
                    dirty_schedules = True
        if dirty_devices:
            await self._save_devices()
        if dirty_schedules:
            await self._save_schedules()

    async def _save_devices(self) -> None:
        await self._store_devices.async_save(self.devices)

    async def _save_schedules(self) -> None:
        await self._store_schedules.async_save(self.schedules)

    async def _save_settings(self) -> None:
        await self._store_settings.async_save(self.settings)

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
        await self._save_devices()
        await self._save_schedules()

    # --- Schedules ---

    def get_schedule(self, schedule_id: str) -> dict[str, Any] | None:
        return next((s for s in self.schedules if s["id"] == schedule_id), None)

    async def async_save_schedule(self, schedule: dict[str, Any]) -> dict[str, Any]:
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

    async def async_toggle_schedule(self, schedule_id: str, enabled: bool) -> None:
        sched = self.get_schedule(schedule_id)
        if sched is None:
            raise ValueError(f"Schedule not found: {schedule_id}")
        sched["enabled"] = enabled
        await self._save_schedules()

    # --- Settings ---

    async def async_update_settings(self, patch: dict[str, Any]) -> dict[str, Any]:
        self.settings.update(patch)
        await self._save_settings()
        return self.settings
