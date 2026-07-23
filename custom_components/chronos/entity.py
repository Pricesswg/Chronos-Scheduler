"""Shared base for the Chronos schedule entities (switch / binary_sensor /
sensor). One entity per (schedule, facet); all grouped under a single HA
device so a schedule rename reflects immediately in the entity name without
touching the device registry.

The entity set is dynamic: schedules are created and deleted at runtime via
the WebSocket API, so each platform reconciles on the SIGNAL_SCHEDULES_CHANGED
dispatcher and individual entities refresh on SIGNAL_STATE.
"""
from __future__ import annotations

from collections.abc import Callable

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity import DeviceInfo, Entity
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, SIGNAL_SCHEDULES_CHANGED, SIGNAL_STATE
from .scheduler import ChronosScheduler
from .store import ChronosStore


class ChronosScheduleEntity(Entity):
    """Base for a single facet of one schedule.

    unique_id is keyed on the schedule id (stable across renames); the
    display name is derived live from the schedule so a rename shows up at
    once. Subclasses set `_facet` (unique_id suffix) and `_label` (name
    suffix)."""

    _attr_should_poll = False
    _facet = ""
    _label = ""

    def __init__(
        self,
        hass: HomeAssistant,
        store: ChronosStore,
        scheduler: ChronosScheduler,
        schedule_id: str,
    ) -> None:
        self.hass = hass
        self._store = store
        self._scheduler = scheduler
        self._schedule_id = schedule_id
        self._attr_unique_id = f"{DOMAIN}_{schedule_id}_{self._facet}"
        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, "scheduler")},
            name="Chronos Scheduler",
            manufacturer="Chronos",
            model="Scheduler",
        )

    @property
    def _schedule(self) -> dict | None:
        return self._store.get_schedule(self._schedule_id)

    @property
    def available(self) -> bool:
        return self._schedule is not None

    @property
    def name(self) -> str:
        sched = self._schedule
        base = (sched.get("name") if sched else None) or self._schedule_id
        return f"{base} {self._label}".strip()

    def _status(self) -> dict:
        sched = self._schedule
        if sched is None:
            return {}
        return self._scheduler.schedule_status(sched)

    async def async_added_to_hass(self) -> None:
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_STATE, self.async_write_ha_state)
        )


async def async_setup_schedule_platform(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
    factory: Callable[..., ChronosScheduleEntity],
) -> None:
    """Seed one entity per existing schedule and keep the set in sync with
    schedule create/remove. Shared by all three platforms."""
    store: ChronosStore = hass.data[DOMAIN]["store"]
    scheduler: ChronosScheduler = hass.data[DOMAIN]["scheduler"]
    entities: dict[str, ChronosScheduleEntity] = {}

    @callback
    def _reconcile() -> None:
        current = {s["id"] for s in store.schedules}
        added = [sid for sid in current if sid not in entities]
        removed = [sid for sid in entities if sid not in current]
        for sid in added:
            entities[sid] = factory(hass, store, scheduler, sid)
        if added:
            async_add_entities(entities[sid] for sid in added)
        for sid in removed:
            ent = entities.pop(sid)
            # Drop the entity and purge its registry entry so a deleted
            # schedule leaves no ghost behind.
            hass.async_create_task(ent.async_remove(force_remove=True))

    _reconcile()
    entry.async_on_unload(
        async_dispatcher_connect(hass, SIGNAL_SCHEDULES_CHANGED, _reconcile)
    )
