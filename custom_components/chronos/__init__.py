from __future__ import annotations

import logging
import shutil
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
    _register_services(hass)
    await _register_frontend_card(hass)

    entry.async_on_unload(scheduler.stop)

    return True


async def _register_frontend_card(hass: HomeAssistant) -> None:
    """Sincronizza il bundle in /config/www/ e registra il custom card.

    Tre layer di affidabilità:
      1. Copia il bundle in /config/www/chronos-card.js (servito da HA come /local/...)
         Se HACS aggiorna il bundle in custom_components/, viene riallineato
         automaticamente al prossimo restart.
      2. Auto-registra la Lovelace resource su /local/chronos-card.js?v=VERSION.
         Funziona in storage mode (UI dashboard); in YAML mode richiede
         resource manuale (vedi README).
      3. Fallback add_extra_js_url + static path su /chronos_static/...
         Se il path /local/ ha problemi (raro), questo fallback rende ancora
         disponibile la card.
    """
    src = Path(__file__).parent / "www" / "chronos-card.js"
    if not src.exists():
        _LOGGER.error(
            "Chronos card bundle NOT FOUND at %s. "
            "Probabile sync HACS incompleta. "
            "Scarica manualmente: https://raw.githubusercontent.com/Pricesswg/Chronos-Scheduler/v%s/custom_components/chronos/www/chronos-card.js",
            src, VERSION,
        )
        return

    # --- 1. Copia in /config/www/ ---
    local_url = f"/local/chronos-card.js?v={VERSION}"
    dst_dir = Path(hass.config.path("www"))
    dst = dst_dir / "chronos-card.js"
    # Icon: anche lei la mettiamo in /config/www/ così la card può puntarci
    icon_src = Path(__file__).parent / "brand" / "icon.png"
    if not icon_src.exists():
        icon_src = Path(__file__).parent / "icon.png"  # fallback legacy
    icon_dst = dst_dir / "chronos-icon.png"

    def _sync_files() -> dict:
        dst_dir.mkdir(parents=True, exist_ok=True)
        out = {"bundle": False, "icon": False}
        # Bundle JS
        if not (dst.exists() and dst.stat().st_size == src.stat().st_size and dst.read_bytes() == src.read_bytes()):
            shutil.copy2(src, dst)
            out["bundle"] = True
        # Icon
        if icon_src.exists():
            if not (icon_dst.exists() and icon_dst.stat().st_size == icon_src.stat().st_size and icon_dst.read_bytes() == icon_src.read_bytes()):
                shutil.copy2(icon_src, icon_dst)
                out["icon"] = True
        return out

    try:
        result = await hass.async_add_executor_job(_sync_files)
        if result.get("bundle"):
            _LOGGER.info("Chronos: bundle sincronizzato in %s", dst)
        if result.get("icon"):
            _LOGGER.info("Chronos: icona sincronizzata in %s", icon_dst)
    except Exception:
        _LOGGER.exception("Chronos: errore copiando file in /config/www/")
        # Continuiamo comunque, il fallback static path potrebbe funzionare

    # --- 2. Lovelace resource auto-register (storage mode) ---
    try:
        await _upsert_lovelace_resource(hass, local_url)
    except Exception:
        _LOGGER.warning(
            "Chronos: impossibile auto-registrare la Lovelace resource "
            "(probabilmente sei in YAML mode). Aggiungi a mano: %s",
            local_url,
            exc_info=True,
        )

    # --- 3. Fallback: static path /chronos_static/ + add_extra_js_url ---
    if not hass.data.get(_CARD_REGISTERED_FLAG):
        try:
            await hass.http.async_register_static_paths([
                StaticPathConfig(CARD_URL, str(src), False)
            ])
            add_extra_js_url(hass, f"{CARD_URL}?v={VERSION}")
            _LOGGER.info("Chronos: fallback static path attivo su %s?v=%s", CARD_URL, VERSION)
        except Exception:
            _LOGGER.warning("Chronos: fallback static path non disponibile", exc_info=True)
        hass.data[_CARD_REGISTERED_FLAG] = True


async def _upsert_lovelace_resource(hass: HomeAssistant, url: str) -> None:
    """Crea o aggiorna la Lovelace resource per chronos-card.js.

    Cerca qualsiasi resource esistente che punti a chronos-card.js (anche da
    setup precedenti, manuali o automatici) e ne aggiorna l'URL. Se non
    esiste la crea. Rimuove eventuali duplicati."""
    lovelace = hass.data.get("lovelace")
    if lovelace is None:
        _LOGGER.debug("Chronos: lovelace data non disponibile")
        return

    # Compatibilità: in HA recenti hass.data["lovelace"] è un oggetto con
    # attributo .resources; in versioni precedenti è un dict.
    resources = getattr(lovelace, "resources", None)
    if resources is None and isinstance(lovelace, dict):
        resources = lovelace.get("resources")

    if resources is None:
        _LOGGER.debug("Chronos: Lovelace resources collection non trovata")
        return

    # Carica se non già caricato
    loaded = getattr(resources, "loaded", None)
    if loaded is False:
        await resources.async_load()
        try:
            resources.loaded = True
        except Exception:
            pass

    items = list(resources.async_items())
    matching = [
        r for r in items
        if "chronos-card.js" in str(r.get("url") or "")
    ]

    if matching:
        first = matching[0]
        if str(first.get("url")) != url:
            await resources.async_update_item(
                first["id"], {"res_type": "module", "url": url}
            )
            _LOGGER.info("Chronos: aggiornata Lovelace resource → %s", url)
        for dup in matching[1:]:
            await resources.async_delete_item(dup["id"])
            _LOGGER.info("Chronos: rimossa Lovelace resource duplicata id=%s", dup.get("id"))
    else:
        await resources.async_create_item({"res_type": "module", "url": url})
        _LOGGER.info("Chronos: creata Lovelace resource → %s", url)


def _register_services(hass: HomeAssistant) -> None:
    """Registra i servizi HA esposti dall'integration."""
    if hass.services.has_service(DOMAIN, "fire_block"):
        return  # già registrato (reload del config entry)

    async def _svc_fire_block(call) -> None:
        scheduler: ChronosScheduler = hass.data[DOMAIN]["scheduler"]
        result = await scheduler.fire_now(str(call.data["schedule_id"]))
        if not result.get("ok"):
            _LOGGER.warning("Chronos fire_block: %s", result.get("error"))

    hass.services.async_register(
        DOMAIN,
        "fire_block",
        _svc_fire_block,
        schema=vol.Schema({vol.Required("schedule_id"): str}),
    )
    _LOGGER.debug("Chronos: service %s.fire_block registered", DOMAIN)


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
        vol.Required("device_id"): vol.Coerce(str),
        vol.Required("patch"): dict,
    })
    @websocket_api.async_response
    async def ws_devices_update(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        try:
            device = await store.async_update_device(msg["device_id"], msg["patch"])
            connection.send_result(msg["id"], device)
        except ValueError as err:
            connection.send_error(msg["id"], "not_found", str(err))

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/devices/remove",
        vol.Required("device_id"): vol.Coerce(str),
    })
    @websocket_api.async_response
    async def ws_devices_remove(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        _LOGGER.info("Chronos: removing device device_id=%r", msg.get("device_id"))
        await store.async_remove_device(msg["device_id"])
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
        vol.Required("schedule_id"): vol.Coerce(str),
    })
    @websocket_api.async_response
    async def ws_schedules_remove(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        await store.async_remove_schedule(msg["schedule_id"])
        connection.send_result(msg["id"], {"success": True})

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/schedules/toggle",
        vol.Required("schedule_id"): vol.Coerce(str),
        vol.Required("enabled"): bool,
    })
    @websocket_api.async_response
    async def ws_schedules_toggle(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        try:
            await store.async_toggle_schedule(msg["schedule_id"], msg["enabled"])
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

    @websocket_api.websocket_command({vol.Required("type"): "chronos/scene/entities"})
    @websocket_api.async_response
    async def ws_scene_entities(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        entities = []
        for state in hass.states.async_all("scene"):
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
    websocket_api.async_register_command(hass, ws_scene_entities)
    websocket_api.async_register_command(hass, ws_sensor_entities)
    websocket_api.async_register_command(hass, ws_actions)
    websocket_api.async_register_command(hass, ws_weather_attributes)
