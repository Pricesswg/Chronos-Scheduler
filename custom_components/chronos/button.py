"""Button platform: one "skip today" button per schedule. Pressing it pauses
the schedule until midnight, the same thing the card's Skip today does, so a
dashboard or an automation can do it without knowing schedule ids."""
from __future__ import annotations

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from . import notify_entities
from .entity import ChronosScheduleEntity, async_setup_schedule_platform
from .gate import skip_today_deadline


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    await async_setup_schedule_platform(
        hass, entry, async_add_entities, ChronosSkipTodayButton
    )


class ChronosSkipTodayButton(ChronosScheduleEntity, ButtonEntity):
    _facet = "skip_today"
    _label = "skip today"
    _attr_icon = "mdi:calendar-remove"

    async def async_press(self) -> None:
        await self._scheduler.pause_schedule(
            self._schedule_id, skip_today_deadline(dt_util.now())
        )
        notify_entities(self.hass, structural=False)
