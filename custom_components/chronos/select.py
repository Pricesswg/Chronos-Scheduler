"""Select platform: one entity for the current mode (the user-defined modes).
Changing it here is the same as changing it in the card or through the
chronos.set_mode service: schedules restricted to other modes stop, what they
were running is closed, schedules of the new mode apply at once."""
from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import notify_entities
from .const import DOMAIN, SIGNAL_STATE
from .modes import mode_label, mode_list, resolve_mode
from .scheduler import ChronosScheduler
from .store import ChronosStore


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    async_add_entities([ChronosModeSelect(hass)])


class ChronosModeSelect(SelectEntity):
    _attr_should_poll = False
    _attr_has_entity_name = True
    _attr_name = "Mode"
    _attr_icon = "mdi:home-switch-outline"
    _attr_unique_id = f"{DOMAIN}_mode"

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, "scheduler")},
            name="Chronos Scheduler",
            manufacturer="Chronos",
            model="Scheduler",
        )

    @property
    def _store(self) -> ChronosStore:
        return self.hass.data[DOMAIN]["store"]

    @property
    def options(self) -> list[str]:
        # Labels, not ids: a renamed mode shows its new name. A built-in mode
        # with no custom name keeps its id as label, so automations written
        # against home / away / holiday keep working.
        return [mode_label(m) for m in mode_list(self._store.settings)]

    @property
    def current_option(self) -> str | None:
        current = str(self._store.settings.get("mode") or "home")
        for m in mode_list(self._store.settings):
            if m["id"] == current:
                return mode_label(m)
        return None

    async def async_select_option(self, option: str) -> None:
        scheduler: ChronosScheduler = self.hass.data[DOMAIN]["scheduler"]
        mode_id = resolve_mode(self._store.settings, option)
        if mode_id is None:
            return
        await scheduler.set_mode(mode_id)
        notify_entities(self.hass, structural=False)

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_STATE, self.async_write_ha_state)
        )
