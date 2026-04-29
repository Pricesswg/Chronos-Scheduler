from __future__ import annotations

import logging
import operator
import re
from datetime import timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_interval

from .const import (
    ACTIONS_BY_TYPE,
    EVENT_BLOCK_EXECUTED,
    EVENT_COMMAND_ERROR,
    EVENT_RULE_TRIGGERED,
)
from .store import ChronosStore

_LOGGER = logging.getLogger(__name__)

OPS = {
    ">": operator.gt,
    ">=": operator.ge,
    "<": operator.lt,
    "<=": operator.le,
    "==": operator.eq,
    "!=": operator.ne,
}

_RULE_RE = re.compile(
    r"^([\w.]+)\s*(>=|<=|!=|==|>|<)\s*(-?[\d.]+)\s*\S*$"
)
_RULE_ENUM_RE = re.compile(
    r"^([\w.]+)\s*(==|!=)\s*(\w+)$"
)


def _parse_expression(expr: str) -> tuple[str, str, str] | None:
    m = _RULE_RE.match(expr.strip())
    if m:
        return m.group(1), m.group(2), m.group(3)
    m = _RULE_ENUM_RE.match(expr.strip())
    if m:
        return m.group(1), m.group(2), m.group(3)
    return None


def _get_action_def(device_type: str, action_id: str) -> dict[str, Any] | None:
    actions = ACTIONS_BY_TYPE.get(device_type, [])
    return next((a for a in actions if a["id"] == action_id), None)


class ChronosScheduler:
    def __init__(self, hass: HomeAssistant, store: ChronosStore) -> None:
        self._hass = hass
        self._store = store
        self._unsub_tick = None
        self._unsub_weather = None
        self._last_executed: dict[str, Any] = {}

    async def start(self) -> None:
        self._unsub_tick = async_track_time_interval(
            self._hass, self._tick, timedelta(minutes=1)
        )
        polling = self._store.settings.get("polling_minutes", 15)
        self._unsub_weather = async_track_time_interval(
            self._hass, self._weather_poll, timedelta(minutes=polling)
        )
        _LOGGER.info("Chronos scheduler started")

    async def stop(self) -> None:
        if self._unsub_tick:
            self._unsub_tick()
            self._unsub_tick = None
        if self._unsub_weather:
            self._unsub_weather()
            self._unsub_weather = None
        _LOGGER.info("Chronos scheduler stopped")

    async def _tick(self, now) -> None:
        current_hour = now.hour + now.minute / 60
        for sched in self._store.schedules:
            if not sched.get("enabled"):
                continue
            weekday = now.weekday()
            days = sched.get("days", [0] * 7)
            if weekday < len(days) and not days[weekday]:
                continue

            current_block = self._block_at(sched, current_hour)
            prev_key = sched["id"]
            previous_block = self._last_executed.get(prev_key)

            if current_block != previous_block:
                self._last_executed[prev_key] = current_block
                if current_block is not None:
                    await self._apply_block(sched, current_block)

    def _block_at(self, sched: dict, hour: float) -> dict | None:
        for block in sched.get("blocks", []):
            if block["start"] <= hour < block["end"]:
                return block
        return None

    async def _apply_block(self, sched: dict, block: dict) -> None:
        weather_rules = sched.get("weather_rules", [])
        active_rules = [r for r in weather_rules if r.get("active")]

        for rule in active_rules:
            matched = await self._evaluate_rule(rule)
            if matched:
                self._hass.bus.async_fire(EVENT_RULE_TRIGGERED, {
                    "schedule_id": sched["id"],
                    "schedule_name": sched.get("name", ""),
                    "rule_if": rule["if"],
                    "rule_then": rule["then"],
                })
                if self._store.settings.get("notify_rule_triggered"):
                    await self._notify(
                        f"Regola meteo attivata: {rule['if']} → {rule['then']}",
                        title=f"Chronos · {sched.get('name', '')}",
                    )
                then_lower = rule.get("then", "").lower()
                if "salta" in then_lower or "skip" in then_lower:
                    if self._store.settings.get("notify_sched_skipped"):
                        await self._notify(
                            f"Fascia saltata per regola meteo: {rule['if']}",
                            title=f"Chronos · {sched.get('name', '')}",
                        )
                    return

        device_type = sched.get("device_type", "")
        action = block.get("action", {})
        action_id = action.get("id", "")
        action_def = _get_action_def(device_type, action_id)

        if not action_def:
            _LOGGER.warning("No action def for %s.%s", device_type, action_id)
            return

        service_str = action_def["service"]
        domain, service = service_str.split(".", 1)

        for device_id in sched.get("device_ids", []):
            device = self._store.get_device(device_id)
            if device is None:
                continue

            service_data: dict[str, Any] = {"entity_id": device["entity_id"]}
            value = action.get("value")

            if action_id == "set_temperature" and value is not None:
                service_data["temperature"] = float(value)
            elif action_id == "set_preset" and value is not None:
                service_data["preset_mode"] = str(value)
            elif action_id == "set_operation" and value is not None:
                service_data["operation_mode"] = str(value)
            elif action_id == "turn_on" and device_type == "light" and value is not None:
                service_data["brightness_pct"] = int(value)
            elif action_id == "turn_on" and device_type == "fan" and value is not None:
                service_data["percentage"] = int(value)
            elif action_id == "set_position" and value is not None:
                service_data["position"] = int(value)
            elif action_id == "turn_on" and device_type == "irrigation" and value is not None:
                pass  # duration handled by the valve entity itself

            try:
                await self._hass.services.async_call(
                    domain, service, service_data, blocking=False
                )
                self._hass.bus.async_fire(EVENT_BLOCK_EXECUTED, {
                    "schedule_id": sched["id"],
                    "device_id": device_id,
                    "entity_id": device["entity_id"],
                    "action_id": action_id,
                    "value": value,
                })
            except Exception:
                _LOGGER.exception(
                    "Error calling %s.%s for %s", domain, service, device["entity_id"]
                )
                self._hass.bus.async_fire(EVENT_COMMAND_ERROR, {
                    "schedule_id": sched["id"],
                    "device_id": device_id,
                    "entity_id": device["entity_id"],
                    "error": f"Failed to call {domain}.{service}",
                })
                if self._store.settings.get("notify_command_error"):
                    await self._notify(
                        f"Errore comando: {domain}.{service} su {device['entity_id']}",
                        title="Chronos · Errore",
                    )

    async def _evaluate_rule(self, rule: dict) -> bool:
        parsed = _parse_expression(rule.get("if", ""))
        if parsed is None:
            _LOGGER.warning("Cannot parse rule expression: %s", rule.get("if"))
            return False

        key, op_str, threshold_str = parsed
        op_fn = OPS.get(op_str)
        if op_fn is None:
            return False

        if key.startswith("forecast."):
            weather_entity = self._store.settings.get("weather_entity", "")
            if not weather_entity:
                return False
            actual = await self._get_forecast_value(weather_entity, key)
        else:
            actual = self._read_attribute(key)

        if actual is None:
            return False

        try:
            return op_fn(float(actual), float(threshold_str))
        except (ValueError, TypeError):
            return op_fn(str(actual), threshold_str)

    def _read_attribute(self, key: str) -> Any:
        """Legge un attributo meteo. Se l'utente ha mappato il key a un'entità
        sensor specifica (override), legge da quella; altrimenti dal weather.*
        principale."""
        overrides = self._store.settings.get("weather_sensor_map") or {}
        sensor_id = overrides.get(key)
        if sensor_id:
            state = self._hass.states.get(sensor_id)
            if state is None:
                return None
            if state.state in (None, "unknown", "unavailable"):
                return None
            return state.state

        weather_entity = self._store.settings.get("weather_entity", "")
        if not weather_entity:
            return None
        weather_state = self._hass.states.get(weather_entity)
        if weather_state is None:
            return None
        if key == "condition":
            return weather_state.state
        return weather_state.attributes.get(key)

    async def _get_forecast_value(self, weather_entity: str, key: str) -> float | str | None:
        try:
            result = await self._hass.services.async_call(
                "weather",
                "get_forecasts",
                {"entity_id": weather_entity, "type": "hourly"},
                blocking=True,
                return_response=True,
            )
        except Exception:
            _LOGGER.debug("Failed to get forecast for %s", weather_entity)
            return None

        forecasts = []
        if isinstance(result, dict):
            for entity_data in result.values():
                if isinstance(entity_data, dict):
                    forecasts = entity_data.get("forecast", [])
                    break

        if not forecasts:
            return None

        sub_key = key.split(".", 1)[1]

        if sub_key == "temp_max_today":
            return max((f.get("temperature", 0) for f in forecasts[:24]), default=None)
        if sub_key == "temp_min_today":
            return min((f.get("temperature", 0) for f in forecasts[:24]), default=None)
        if sub_key == "rain_6h":
            return sum(f.get("precipitation", 0) or 0 for f in forecasts[:6])
        if sub_key == "condition_6h":
            cond = forecasts[5].get("condition") if len(forecasts) > 5 else None
            return cond

        return None

    async def _weather_poll(self, _now) -> None:
        pass

    async def _notify(self, message: str, title: str = "Chronos") -> None:
        try:
            await self._hass.services.async_call(
                "persistent_notification",
                "create",
                {"message": message, "title": title},
                blocking=False,
            )
        except Exception:
            _LOGGER.debug("Failed to send notification")
