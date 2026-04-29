from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback

from .const import (
    ACTIONS_BY_TYPE,
    DOMAIN,
    DOMAIN_TO_TYPE,
    SUPPORTED_DOMAINS,
    VERSION,
    WEATHER_ATTRIBUTES,
)
from .scheduler import ChronosScheduler
from .store import ChronosStore

_LOGGER = logging.getLogger(__name__)

CARD_URL = f"/{DOMAIN}_static/chronos-card.js"
_CARD_REGISTERED_FLAG = f"{DOMAIN}_card_registered"


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    store = ChronosStore(hass)
    await store.async_load()

    if entry.data.get("weather_entity") and not store.settings.get("weather_entity"):
        store.settings["weather_entity"] = entry.data["weather_entity"]
        await store.async_update_settings(store.settings)

    scheduler = ChronosScheduler(hass, store)
    await scheduler.start()

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN] = {"store": store, "scheduler": scheduler}

    _register_websocket_commands(hass)
    await _register_frontend_card(hass)

    entry.async_on_unload(scheduler.stop)

    return True


async def _register_frontend_card(hass: HomeAssistant) -> None:
    if hass.data.get(_CARD_REGISTERED_FLAG):
        return

    js_path = Path(__file__).parent / "www" / "chronos-card.js"
    if not js_path.exists():
        _LOGGER.warning(
            "Chronos card bundle not found at %s — frontend card will not be loaded",
            js_path,
        )
        return

    await hass.http.async_register_static_paths([
        StaticPathConfig(CARD_URL, str(js_path), cache_headers=False)
    ])
    add_extra_js_url(hass, f"{CARD_URL}?v={VERSION}")

    hass.data[_CARD_REGISTERED_FLAG] = True
    _LOGGER.debug("Chronos card registered at %s", CARD_URL)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    data = hass.data.pop(DOMAIN, {})
    scheduler = data.get("scheduler")
    if scheduler:
        await scheduler.stop()
    return True


def _register_websocket_commands(hass: HomeAssistant) -> None:

    # --- Devices ---

    @websocket_api.websocket_command({vol.Required("type"): "chronos/devices/list"})
    @websocket_api.async_response
    async def ws_devices_list(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        connection.send_result(msg["id"], store.devices)

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/devices/add",
        vol.Required("entity_id"): str,
        vol.Optional("alias"): str,
        vol.Optional("area"): str,
    })
    @websocket_api.async_response
    async def ws_devices_add(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        try:
            device = await store.async_add_device(
                msg["entity_id"],
                alias=msg.get("alias"),
                area=msg.get("area"),
            )
            connection.send_result(msg["id"], device)
        except ValueError as err:
            connection.send_error(msg["id"], "invalid_entity", str(err))

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/devices/update",
        vol.Required("id"): vol.Coerce(str),
        vol.Required("patch"): dict,
    })
    @websocket_api.async_response
    async def ws_devices_update(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        try:
            device = await store.async_update_device(msg["id"], msg["patch"])
            connection.send_result(msg["id"], device)
        except ValueError as err:
            connection.send_error(msg["id"], "not_found", str(err))

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/devices/remove",
        vol.Required("id"): vol.Coerce(str),
    })
    @websocket_api.async_response
    async def ws_devices_remove(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        await store.async_remove_device(msg["id"])
        connection.send_result(msg["id"], {"success": True})

    # --- Schedules ---

    @websocket_api.websocket_command({vol.Required("type"): "chronos/schedules/list"})
    @websocket_api.async_response
    async def ws_schedules_list(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        connection.send_result(msg["id"], store.schedules)

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/schedules/save",
        vol.Required("schedule"): dict,
    })
    @websocket_api.async_response
    async def ws_schedules_save(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        sched = await store.async_save_schedule(msg["schedule"])
        connection.send_result(msg["id"], sched)

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/schedules/remove",
        vol.Required("id"): vol.Coerce(str),
    })
    @websocket_api.async_response
    async def ws_schedules_remove(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        await store.async_remove_schedule(msg["id"])
        connection.send_result(msg["id"], {"success": True})

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/schedules/toggle",
        vol.Required("id"): vol.Coerce(str),
        vol.Required("enabled"): bool,
    })
    @websocket_api.async_response
    async def ws_schedules_toggle(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        try:
            await store.async_toggle_schedule(msg["id"], msg["enabled"])
            connection.send_result(msg["id"], {"success": True})
        except ValueError as err:
            connection.send_error(msg["id"], "not_found", str(err))

    # --- Settings ---

    @websocket_api.websocket_command({vol.Required("type"): "chronos/settings/get"})
    @websocket_api.async_response
    async def ws_settings_get(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        connection.send_result(msg["id"], store.settings)

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/settings/update",
        vol.Required("patch"): dict,
    })
    @websocket_api.async_response
    async def ws_settings_update(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        settings = await store.async_update_settings(msg["patch"])
        connection.send_result(msg["id"], settings)

    # --- Preview / discovery ---

    @websocket_api.websocket_command({vol.Required("type"): "chronos/preview/forecast"})
    @websocket_api.async_response
    async def ws_preview_forecast(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        weather_entity = store.settings.get("weather_entity", "")
        if not weather_entity:
            connection.send_result(msg["id"], [])
            return

        try:
            result = await hass.services.async_call(
                "weather",
                "get_forecasts",
                {"entity_id": weather_entity, "type": "hourly"},
                blocking=True,
                return_response=True,
            )
            forecasts = []
            if isinstance(result, dict):
                for entity_data in result.values():
                    if isinstance(entity_data, dict):
                        forecasts = entity_data.get("forecast", [])
                        break
            connection.send_result(msg["id"], forecasts[:24])
        except Exception:
            connection.send_result(msg["id"], [])

    @websocket_api.websocket_command({vol.Required("type"): "chronos/entities/available"})
    @websocket_api.async_response
    async def ws_entities_available(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        imported_ids = {d["entity_id"] for d in store.devices}
        entities = []
        for state in hass.states.async_all():
            domain = state.domain
            if domain not in SUPPORTED_DOMAINS:
                continue
            if state.entity_id in imported_ids:
                continue
            entities.append({
                "entity_id": state.entity_id,
                "friendly_name": state.attributes.get("friendly_name", state.entity_id),
                "area": "",
                "type": DOMAIN_TO_TYPE[domain],
            })
        connection.send_result(msg["id"], entities)

    @websocket_api.websocket_command({vol.Required("type"): "chronos/weather/entities"})
    @websocket_api.async_response
    async def ws_weather_entities(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        entities = []
        for state in hass.states.async_all("weather"):
            entities.append({
                "entity_id": state.entity_id,
                "friendly_name": state.attributes.get("friendly_name", state.entity_id),
            })
        connection.send_result(msg["id"], entities)

    @websocket_api.websocket_command({vol.Required("type"): "chronos/sensor/entities"})
    @websocket_api.async_response
    async def ws_sensor_entities(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        entities = []
        for state in hass.states.async_all(["sensor", "binary_sensor"]):
            attrs = state.attributes
            entities.append({
                "entity_id": state.entity_id,
                "friendly_name": attrs.get("friendly_name", state.entity_id),
                "unit_of_measurement": attrs.get("unit_of_measurement", ""),
                "device_class": attrs.get("device_class", ""),
                "state": state.state,
            })
        connection.send_result(msg["id"], entities)

    @websocket_api.websocket_command({vol.Required("type"): "chronos/actions"})
    @websocket_api.async_response
    async def ws_actions(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        connection.send_result(msg["id"], ACTIONS_BY_TYPE)

    @websocket_api.websocket_command({vol.Required("type"): "chronos/weather/attributes"})
    @websocket_api.async_response
    async def ws_weather_attributes(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        connection.send_result(msg["id"], WEATHER_ATTRIBUTES)

    # Register all
    websocket_api.async_register_command(hass, ws_devices_list)
    websocket_api.async_register_command(hass, ws_devices_add)
    websocket_api.async_register_command(hass, ws_devices_update)
    websocket_api.async_register_command(hass, ws_devices_remove)
    websocket_api.async_register_command(hass, ws_schedules_list)
    websocket_api.async_register_command(hass, ws_schedules_save)
    websocket_api.async_register_command(hass, ws_schedules_remove)
    websocket_api.async_register_command(hass, ws_schedules_toggle)
    websocket_api.async_register_command(hass, ws_settings_get)
    websocket_api.async_register_command(hass, ws_settings_update)
    websocket_api.async_register_command(hass, ws_preview_forecast)
    websocket_api.async_register_command(hass, ws_entities_available)
    websocket_api.async_register_command(hass, ws_weather_entities)
    websocket_api.async_register_command(hass, ws_sensor_entities)
    websocket_api.async_register_command(hass, ws_actions)
    websocket_api.async_register_command(hass, ws_weather_attributes)
