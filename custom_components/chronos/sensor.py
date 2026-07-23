"""Sensor platform: one status sensor per schedule. State is the next time
the schedule will change (a block starting or ending) as a timestamp;
attributes carry the current action, the running block window, the device
count and the enabled/running flags."""
from __future__ import annotations

from datetime import datetime

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
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
        hass, entry, async_add_entities, ChronosScheduleSensor
    )


class ChronosScheduleSensor(ChronosScheduleEntity, SensorEntity):
    _facet = "status"
    _label = "next change"
    _attr_device_class = SensorDeviceClass.TIMESTAMP
    _attr_icon = "mdi:clock-outline"

    @property
    def native_value(self) -> datetime | None:
        return self._status().get("next_change")

    @property
    def extra_state_attributes(self) -> dict:
        st = self._status()
        return {
            "enabled": st.get("enabled"),
            "running": st.get("running"),
            "current_action": st.get("current_action"),
            "block_start": st.get("block_start"),
            "block_end": st.get("block_end"),
            "device_count": st.get("device_count"),
        }
