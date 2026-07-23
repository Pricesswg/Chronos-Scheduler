"""Switch platform: one switch per schedule to enable/disable it. Mirrors
the `schedule_toggle` service and the card's toggle, so it stays in sync
whichever way the schedule is flipped."""
from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import notify_entities
from .entity import ChronosScheduleEntity, async_setup_schedule_platform


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    await async_setup_schedule_platform(
        hass, entry, async_add_entities, ChronosScheduleSwitch
    )


class ChronosScheduleSwitch(ChronosScheduleEntity, SwitchEntity):
    _facet = "enabled"
    _label = ""  # the switch is the schedule itself; no suffix
    _attr_icon = "mdi:calendar-clock"

    @property
    def name(self) -> str:
        sched = self._schedule
        return (sched.get("name") if sched else None) or self._schedule_id

    @property
    def is_on(self) -> bool:
        sched = self._schedule
        return bool(sched and sched.get("enabled"))

    async def async_turn_on(self, **kwargs: Any) -> None:
        await self._set(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        await self._set(False)

    async def _set(self, enabled: bool) -> None:
        await self._store.async_toggle_schedule(self._schedule_id, enabled)
        # Refresh the binary_sensor / sensor too, not just this switch.
        notify_entities(self.hass, structural=False)
