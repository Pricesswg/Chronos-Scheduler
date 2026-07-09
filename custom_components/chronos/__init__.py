from __future__ import annotations

import logging
import shutil
from pathlib import Path

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import (
    area_registry as ar,
    config_validation as cv,
    device_registry as dr,
    entity_registry as er,
)

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
    """Sync the bundle to /config/www/ and register the custom card.

    Two reliability layers:
      1. Copy the bundle to /config/www/chronos-card.js (served by HA as
         /local/...). When HACS updates the bundle in custom_components/,
         it is realigned automatically at the next restart.
      2. add_extra_js_url + static path at /chronos_static/chronos-card.js.
         Loads the card at the frontend level, enough to register the
         <chronos-card> custom element and make it usable in storage or
         YAML dashboards.

    The Lovelace resource auto-registration (present until v1.10.3) was
    removed in v1.10.4: HACS already registers the resource for HACS
    installs, and Chronos's auto-register sometimes conflicted with it,
    leaving the lovelace_resources collection inconsistent after a reboot
    (issue #2). Manual installs still get the card via mechanism 2; anyone
    who also wants a visible Lovelace resource can add it by hand (see
    README).
    """
    src = Path(__file__).parent / "www" / "chronos-card.js"
    if not src.exists():
        _LOGGER.error(
            "Chronos card bundle NOT FOUND at %s. "
            "Likely an incomplete HACS sync. "
            "Download it manually: https://raw.githubusercontent.com/Pricesswg/Chronos-Scheduler/v%s/custom_components/chronos/www/chronos-card.js",
            src, VERSION,
        )
        return

    # --- 1. Copy to /config/www/ ---
    local_url = f"/local/chronos-card.js?v={VERSION}"
    dst_dir = Path(hass.config.path("www"))
    dst = dst_dir / "chronos-card.js"
    # Icon: copied to /config/www/ too, so the card can point at it
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
            _LOGGER.info("Chronos: bundle synced to %s", dst)
        if result.get("icon"):
            _LOGGER.info("Chronos: icon synced to %s", icon_dst)
    except Exception:
        _LOGGER.exception("Chronos: failed to copy files to /config/www/")
        # Keep going anyway, the static-path fallback may still work

    # NOTE: the Lovelace resource auto-registration was removed in v1.10.4
    # to avoid conflicts with HACS (see docstring above and issue #2).
    # `local_url` is still computed because some logs and the README point
    # at it, but it is no longer written to the lovelace_resources
    # collection.
    _ = local_url  # noqa: F841

    # --- 2. Fallback: static path /chronos_static/ + add_extra_js_url ---
    if not hass.data.get(_CARD_REGISTERED_FLAG):
        try:
            await hass.http.async_register_static_paths([
                StaticPathConfig(CARD_URL, str(src), False)
            ])
            add_extra_js_url(hass, f"{CARD_URL}?v={VERSION}")
            _LOGGER.info("Chronos: fallback static path active at %s?v=%s", CARD_URL, VERSION)
        except Exception:
            _LOGGER.warning("Chronos: fallback static path not available", exc_info=True)
        hass.data[_CARD_REGISTERED_FLAG] = True


async def _upsert_lovelace_resource(hass: HomeAssistant, url: str) -> None:
    """DEPRECATED, no longer called by the setup as of v1.10.4.

    It conflicted with the registration performed by HACS when the bundle
    was installed via HACS: two back-to-back writes on the same
    `lovelace_resources` collection left HA's in-memory state inconsistent,
    with resources disappearing from the UI after a reboot while staying
    intact on disk (issue #2).

    Kept in the module as a reference and for potential manual use; the
    setup today relies only on (1) copying the bundle to /config/www and
    (2) add_extra_js_url on /chronos_static/, which are enough to load the
    card without touching lovelace_resources. For manual installs outside
    HACS, the procedure to add the resource by hand is described in the
    README."""
    lovelace = hass.data.get("lovelace")
    if lovelace is None:
        _LOGGER.debug("Chronos: lovelace data not available")
        return

    # Compatibility: recent HA versions expose hass.data["lovelace"] as an
    # object with a .resources attribute; older ones as a dict.
    resources = getattr(lovelace, "resources", None)
    if resources is None and isinstance(lovelace, dict):
        resources = lovelace.get("resources")

    if resources is None:
        _LOGGER.debug("Chronos: Lovelace resources collection not found")
        return

    # Load if not loaded yet
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
            _LOGGER.info("Chronos: updated Lovelace resource → %s", url)
        for dup in matching[1:]:
            await resources.async_delete_item(dup["id"])
            _LOGGER.info("Chronos: removed duplicate Lovelace resource id=%s", dup.get("id"))
    else:
        await resources.async_create_item({"res_type": "module", "url": url})
        _LOGGER.info("Chronos: created Lovelace resource → %s", url)


def _resolve_area_name(hass: HomeAssistant, entity_id: str) -> str:
    """Room name from the HA registries: the area assigned directly to
    the entity wins, otherwise it inherits the physical device's one.
    Empty string when the entity is not in the registries (e.g. template
    entities). Resolved on every read instead of stored: when the user
    moves the device to another room in HA, Chronos follows on its own."""
    entry = er.async_get(hass).async_get(entity_id)
    if entry is None:
        return ""
    area_id = entry.area_id
    if not area_id and entry.device_id:
        device = dr.async_get(hass).async_get(entry.device_id)
        area_id = device.area_id if device else None
    if not area_id:
        return ""
    area = ar.async_get(hass).async_get_area(area_id)
    return area.name if area else ""


def _register_services(hass: HomeAssistant) -> None:
    """Register the HA services exposed by the integration."""
    if hass.services.has_service(DOMAIN, "fire_block"):
        return  # already registered (config entry reload)

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

    async def _svc_schedule_toggle(call) -> None:
        # Enable/disable a schedule from HA automations without exposing
        # entities (deliberate choice: no switches, keep HA lean). Target
        # by id or by name; the name is friendlier in automations but must
        # be unique, on a tie the service refuses instead of toggling the
        # wrong schedule.
        store: ChronosStore = hass.data[DOMAIN]["store"]
        enabled = bool(call.data["enabled"])
        sched_id = str(call.data.get("schedule_id") or "").strip()
        name = str(call.data.get("name") or "").strip()
        if sched_id:
            sched = store.get_schedule(sched_id)
            if sched is None:
                _LOGGER.warning(
                    "Chronos schedule_toggle: no schedule with id %r", sched_id
                )
                return
        else:
            matches = [
                s for s in store.schedules
                if s.get("name", "").strip().casefold() == name.casefold()
            ]
            if not matches:
                _LOGGER.warning(
                    "Chronos schedule_toggle: no schedule named %r", name
                )
                return
            if len(matches) > 1:
                _LOGGER.warning(
                    "Chronos schedule_toggle: name %r matches %d schedules, "
                    "use schedule_id instead (%s)",
                    name, len(matches), ", ".join(s["id"] for s in matches),
                )
                return
            sched = matches[0]
        await store.async_toggle_schedule(sched["id"], enabled)
        _LOGGER.info(
            "Chronos schedule_toggle: %s (%s) -> enabled=%s",
            sched.get("name"), sched["id"], enabled,
        )

    hass.services.async_register(
        DOMAIN,
        "schedule_toggle",
        _svc_schedule_toggle,
        schema=vol.All(
            vol.Schema({
                vol.Optional("schedule_id"): str,
                vol.Optional("name"): str,
                vol.Required("enabled"): bool,
            }),
            cv.has_at_least_one_key("schedule_id", "name"),
        ),
    )
    _LOGGER.debug("Chronos: services %s.fire_block, %s.schedule_toggle registered", DOMAIN, DOMAIN)


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
        # Area resolved live from the registries when the device has no
        # stored one. Response-only, never persisted: an area set manually
        # by the user wins, and for the other devices a room change in HA
        # is reflected here without migrations.
        out = [
            d if d.get("area")
            else {**d, "area": _resolve_area_name(hass, d["entity_id"])}
            for d in store.devices
        ]
        connection.send_result(msg["id"], out)

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

    # --- Weather rules (v2, global store) ---

    @websocket_api.websocket_command({vol.Required("type"): "chronos/rules/list"})
    @websocket_api.async_response
    async def ws_rules_list(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        connection.send_result(msg["id"], store.rules)

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/rules/save",
        vol.Required("rule"): dict,
    })
    @websocket_api.async_response
    async def ws_rules_save(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        rule = await store.async_save_rule(msg["rule"])
        connection.send_result(msg["id"], rule)

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/rules/remove",
        vol.Required("rule_id"): vol.Coerce(str),
    })
    @websocket_api.async_response
    async def ws_rules_remove(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        await store.async_remove_rule(msg["rule_id"])
        connection.send_result(msg["id"], {"success": True})

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/rules/reorder",
        vol.Required("order"): [vol.Coerce(str)],
    })
    @websocket_api.async_response
    async def ws_rules_reorder(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        await store.async_reorder_rules(msg["order"])
        connection.send_result(msg["id"], store.rules)

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
                "area": _resolve_area_name(hass, state.entity_id),
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

    @websocket_api.websocket_command({vol.Required("type"): "chronos/automation/entities"})
    @websocket_api.async_response
    async def ws_automation_entities(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        entities = []
        for state in hass.states.async_all("automation"):
            entities.append({
                "entity_id": state.entity_id,
                "friendly_name": state.attributes.get("friendly_name", state.entity_id),
                "state": state.state,
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

    @websocket_api.websocket_command({
        vol.Required("type"): "chronos/history/list",
        vol.Optional("from_ts"): str,
        vol.Optional("to_ts"): str,
        vol.Optional("schedule_id"): str,
        vol.Optional("outcome"): vol.In(["ok", "error"]),
        vol.Optional("kind"): vol.In(["block", "rule"]),
        vol.Optional("limit"): vol.All(int, vol.Range(min=1, max=5000)),
    })
    @websocket_api.async_response
    async def ws_history_list(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        items = list(store.history)
        # Filter chain. Each filter is independent and skipped when its
        # parameter is absent in the message.
        from_ts = msg.get("from_ts")
        to_ts = msg.get("to_ts")
        schedule_id = msg.get("schedule_id")
        outcome = msg.get("outcome")
        kind = msg.get("kind")
        if from_ts:
            items = [it for it in items if it.get("ts", "") >= from_ts]
        if to_ts:
            items = [it for it in items if it.get("ts", "") <= to_ts]
        if schedule_id:
            items = [it for it in items if it.get("schedule_id") == schedule_id]
        if outcome:
            items = [it for it in items if it.get("outcome") == outcome]
        if kind:
            items = [it for it in items if it.get("kind") == kind]
        # Most recent first.
        items.sort(key=lambda x: x.get("ts", ""), reverse=True)
        limit = msg.get("limit") or 1000
        connection.send_result(msg["id"], items[:limit])

    @websocket_api.websocket_command({vol.Required("type"): "chronos/history/clear"})
    @websocket_api.async_response
    async def ws_history_clear(
        hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict
    ) -> None:
        store: ChronosStore = hass.data[DOMAIN]["store"]
        await store.clear_history()
        connection.send_result(msg["id"], {"cleared": True})

    # Register all
    websocket_api.async_register_command(hass, ws_devices_list)
    websocket_api.async_register_command(hass, ws_devices_add)
    websocket_api.async_register_command(hass, ws_devices_update)
    websocket_api.async_register_command(hass, ws_devices_remove)
    websocket_api.async_register_command(hass, ws_schedules_list)
    websocket_api.async_register_command(hass, ws_schedules_save)
    websocket_api.async_register_command(hass, ws_schedules_remove)
    websocket_api.async_register_command(hass, ws_schedules_toggle)
    websocket_api.async_register_command(hass, ws_rules_list)
    websocket_api.async_register_command(hass, ws_rules_save)
    websocket_api.async_register_command(hass, ws_rules_remove)
    websocket_api.async_register_command(hass, ws_rules_reorder)
    websocket_api.async_register_command(hass, ws_settings_get)
    websocket_api.async_register_command(hass, ws_settings_update)
    websocket_api.async_register_command(hass, ws_preview_forecast)
    websocket_api.async_register_command(hass, ws_entities_available)
    websocket_api.async_register_command(hass, ws_weather_entities)
    websocket_api.async_register_command(hass, ws_scene_entities)
    websocket_api.async_register_command(hass, ws_automation_entities)
    websocket_api.async_register_command(hass, ws_sensor_entities)
    websocket_api.async_register_command(hass, ws_actions)
    websocket_api.async_register_command(hass, ws_weather_attributes)
    websocket_api.async_register_command(hass, ws_history_list)
    websocket_api.async_register_command(hass, ws_history_clear)
