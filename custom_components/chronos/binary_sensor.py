"""Binary sensor platform: one per schedule, on while a block is running
right now (schedule enabled, runs today, and the current time falls inside a
block)."""
from __future__ import annotations

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .entity import ChronosScheduleEntity, async_setup_schedule_platform


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    await async_setup_schedule_platform(
        hass, entry, async_add_entities, ChronosScheduleActive
    )


class ChronosScheduleActive(ChronosScheduleEntity, BinarySensorEntity):
    _facet = "active"
    _label = "active"
    _attr_device_class = BinarySensorDeviceClass.RUNNING

    @property
    def is_on(self) -> bool:
        return bool(self._status().get("running"))
