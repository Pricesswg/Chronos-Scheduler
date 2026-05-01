from __future__ import annotations

import logging
import operator
import re
from datetime import timedelta
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.util import dt as dt_util

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
        # Per-rule edge-trigger state: key = f"{schedule_id}:{rule_idx}"
        # value = {"last_eval": bool, "last_fire": datetime|None}
        self._rule_state: dict[str, dict] = {}

    async def start(self) -> None:
        self._unsub_tick = async_track_time_interval(
            self._hass, self._tick, timedelta(minutes=1)
        )
        polling = self._store.settings.get("polling_minutes", 15)
        self._unsub_weather = async_track_time_interval(
            self._hass, self._weather_poll, timedelta(minutes=polling)
        )
        local_now = dt_util.now()
        _LOGGER.info(
            "Chronos scheduler started · tick=1min · weather_poll=%dmin · "
            "local_time=%s tz=%s · schedules=%d devices=%d",
            polling,
            local_now.isoformat(),
            str(local_now.tzinfo),
            len(self._store.schedules),
            len(self._store.devices),
        )
        # Esegui un primo tick subito così l'utente non aspetta fino al minuto dopo
        try:
            await self._tick(dt_util.utcnow())
        except Exception:
            _LOGGER.exception("Chronos: errore al primo tick")

    async def fire_now(self, schedule_id: str) -> dict:
        """Esegue immediatamente la fascia correntemente attiva di una schedule.

        Usato dal servizio chronos.fire_block per test manuali.
        """
        sched = self._store.get_schedule(schedule_id)
        if sched is None:
            return {"ok": False, "error": f"schedule {schedule_id} non trovata"}
        local_now = dt_util.now()
        current_hour = local_now.hour + local_now.minute / 60
        block = self._block_at(sched, current_hour)
        if block is None:
            return {"ok": False, "error": f"nessuna fascia attiva alle {current_hour:.2f}"}
        _LOGGER.info("Chronos: fire_now manuale schedule=%s block=%s", sched.get("name"), block)
        await self._apply_block(sched, block)
        return {"ok": True, "block": block}

    async def stop(self) -> None:
        if self._unsub_tick:
            self._unsub_tick()
            self._unsub_tick = None
        if self._unsub_weather:
            self._unsub_weather()
            self._unsub_weather = None
        _LOGGER.info("Chronos scheduler stopped")

    async def _tick(self, now) -> None:
        local_now = dt_util.as_local(now) if now.tzinfo else now
        current_hour = local_now.hour + local_now.minute / 60
        weekday = local_now.weekday()
        _LOGGER.debug(
            "Chronos: tick UTC=%s LOCAL=%s hour=%.2f weekday=%d schedules=%d",
            now.isoformat() if now else "?",
            local_now.isoformat() if local_now else "?",
            current_hour, weekday,
            len(self._store.schedules),
        )
        for sched in self._store.schedules:
            sched_id = sched.get("id", "?")
            sched_name = sched.get("name", "?")
            if not sched.get("enabled"):
                continue
            days = sched.get("days", [0] * 7)
            if weekday < len(days) and not days[weekday]:
                continue

            current_block = self._block_at(sched, current_hour)
            prev_key = sched_id
            previous_block = self._last_executed.get(prev_key)

            # Block transition handling
            if current_block != previous_block:
                self._last_executed[prev_key] = current_block
                if current_block is not None:
                    _LOGGER.info(
                        "Chronos: TRANSITION schedule=%s hour=%.2f → block resolved=%.2f-%.2f action=%s",
                        sched_name, current_hour,
                        self._resolve_block_time(current_block, "start"),
                        self._resolve_block_time(current_block, "end"),
                        current_block.get("action"),
                    )
                    await self._apply_block(sched, current_block)

            # Weather-trigger evaluation: every tick, every active rule that
            # has a trigger_action. Edge-triggered + rate-limited per fire_mode.
            await self._evaluate_triggers(sched, local_now)

    def _block_at(self, sched: dict, hour: float) -> dict | None:
        for block in sched.get("blocks", []):
            start = self._resolve_block_time(block, "start")
            end = self._resolve_block_time(block, "end")
            if start <= hour < end:
                return block
        return None

    def _resolve_block_time(self, block: dict, edge: str) -> float:
        """Resolve block start/end into an hour-of-day float.

        If the block has an anchor field (start_anchor / end_anchor) set to
        "sunrise" or "sunset", read sun.sun and apply the offset (minutes).
        Otherwise return the numeric start/end value as-is.
        """
        anchor = block.get(f"{edge}_anchor")
        offset_min = block.get(f"{edge}_offset", 0) or 0
        if anchor in ("sunrise", "sunset"):
            sun = self._hass.states.get("sun.sun")
            if sun is not None:
                attr = "next_rising" if anchor == "sunrise" else "next_setting"
                iso = sun.attributes.get(attr)
                if iso:
                    try:
                        t = dt_util.parse_datetime(str(iso))
                        if t is not None:
                            local = dt_util.as_local(t)
                            base = local.hour + local.minute / 60 + local.second / 3600
                            return max(0.0, min(24.0, base + offset_min / 60))
                    except Exception:
                        _LOGGER.debug("Cannot parse sun.%s = %r", attr, iso)
        # Fallback to numeric value
        v = block.get(edge, 0)
        try:
            return float(v)
        except (TypeError, ValueError):
            return 0.0

    async def _evaluate_triggers(self, sched: dict, local_now) -> None:
        """Evaluate all active weather rules on this schedule with a
        trigger_action attached. Fire on edge transitions if the fire_mode
        window allows.
        """
        sched_id = str(sched.get("id", ""))
        sched_name = sched.get("name", "")
        rules = sched.get("weather_rules", []) or []
        for idx, rule in enumerate(rules):
            if not rule.get("active"):
                continue
            trigger = rule.get("trigger_action")
            if not trigger:
                continue  # legacy: handled at block transition
            key = f"{sched_id}:{idx}"
            state = self._rule_state.setdefault(key, {"last_eval": False, "last_fire": None})
            try:
                current = await self._evaluate_rule(rule)
            except Exception:
                _LOGGER.exception("Chronos: trigger eval crashed schedule=%s rule=%s", sched_name, rule.get("if"))
                continue
            was = state["last_eval"]
            state["last_eval"] = current

            if not current:
                continue
            if was:
                continue  # already true on previous tick, edge already fired

            # Rule just transitioned from False to True. Check rate limit.
            fire_mode = rule.get("fire_mode", "every")
            if not self._is_armed(fire_mode, state.get("last_fire"), local_now):
                _LOGGER.debug(
                    "Chronos: trigger ARMED-OFF schedule=%s rule=%s mode=%s last_fire=%s",
                    sched_name, rule.get("if"), fire_mode, state.get("last_fire"),
                )
                continue

            _LOGGER.info(
                "Chronos: TRIGGER schedule=%s rule=%s → action=%s mode=%s",
                sched_name, rule.get("if"), trigger, fire_mode,
            )
            await self._execute_trigger(sched, trigger)
            state["last_fire"] = local_now

    def _is_armed(self, fire_mode: str, last_fire, local_now) -> bool:
        """Return True if the rule is allowed to fire now, given its mode and
        the timestamp of its previous firing."""
        if last_fire is None:
            # Has never fired. Daytime/nighttime modes still need to gate by
            # current sun state.
            if fire_mode == "once_per_daytime":
                return self._is_daytime()
            if fire_mode == "once_per_nighttime":
                return not self._is_daytime()
            return True

        if fire_mode == "every":
            return True
        if fire_mode == "once_per_day":
            return last_fire.date() != local_now.date()

        # daytime / nighttime: must be in correct window AND last fire was
        # before the start of the current window.
        if fire_mode == "once_per_daytime":
            if not self._is_daytime():
                return False
            window_start = self._current_daytime_start(local_now)
            return window_start is None or last_fire < window_start
        if fire_mode == "once_per_nighttime":
            if self._is_daytime():
                return False
            window_start = self._current_nighttime_start(local_now)
            return window_start is None or last_fire < window_start
        return True

    def _is_daytime(self) -> bool:
        sun = self._hass.states.get("sun.sun")
        return bool(sun and sun.state == "above_horizon")

    def _current_daytime_start(self, local_now):
        """Datetime of the most recent sunrise (or None if unknown)."""
        sun = self._hass.states.get("sun.sun")
        if sun is None or sun.state != "above_horizon":
            return None
        iso = sun.attributes.get("next_rising")
        if not iso:
            return None
        try:
            t = dt_util.parse_datetime(str(iso))
            if t is None:
                return None
            return dt_util.as_local(t - timedelta(days=1))
        except Exception:
            return None

    def _current_nighttime_start(self, local_now):
        """Datetime of the most recent sunset (or None if unknown)."""
        sun = self._hass.states.get("sun.sun")
        if sun is None or sun.state != "below_horizon":
            return None
        iso = sun.attributes.get("next_setting")
        if not iso:
            return None
        try:
            t = dt_util.parse_datetime(str(iso))
            if t is None:
                return None
            return dt_util.as_local(t - timedelta(days=1))
        except Exception:
            return None

    async def _execute_trigger(self, sched: dict, trigger: dict) -> None:
        """Execute a structured trigger action on all devices of the schedule.

        trigger schema: { "action_id": str, "value"?: number|str }
        """
        device_type = sched.get("device_type", "")
        action_id = trigger.get("action_id", "")
        value = trigger.get("value")
        action_def = _get_action_def(device_type, action_id)
        if not action_def:
            _LOGGER.warning(
                "Chronos: TRIGGER skipped — no action def for %s.%s",
                device_type, action_id,
            )
            return
        # Reuse _apply_block by synthesising a fake block. Simpler than
        # duplicating the service-call dispatcher.
        synthetic_block = {"start": 0, "end": 0, "action": {"id": action_id, "value": value}}
        # _apply_block re-evaluates weather rules including 'salta' override.
        # For trigger actions we want to skip that re-evaluation, so we go
        # straight to the device dispatch path:
        await self._dispatch_action(sched, synthetic_block, suppress_block_rules=True)

    async def _dispatch_action(self, sched: dict, block: dict, suppress_block_rules: bool = False) -> None:
        """Internal: execute the block's action on all schedule devices.

        Refactored out of _apply_block so that triggers can reuse it without
        re-running the block's own weather rules.
        """
        sched_name = sched.get("name", "")
        device_type = sched.get("device_type", "")
        action = block.get("action", {})
        action_id = action.get("id", "")
        action_def = _get_action_def(device_type, action_id)
        if not action_def:
            _LOGGER.warning(
                "Chronos: NO action def for device_type=%s action_id=%s schedule=%s",
                device_type, action_id, sched_name,
            )
            return

        service_str = action_def["service"]
        domain, service = service_str.split(".", 1)

        device_ids = sched.get("device_ids", []) or []
        if not device_ids:
            _LOGGER.warning(
                "Chronos: schedule=%s has NO device_ids — action skipped",
                sched_name,
            )
            return

        executed_count = 0
        executed_entities: list[str] = []

        for device_id in device_ids:
            device = self._store.get_device(device_id)
            if device is None:
                _LOGGER.warning(
                    "Chronos: device_id=%r not found in store (schedule=%s)",
                    device_id, sched_name,
                )
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

            _LOGGER.info(
                "Chronos: CALL service %s.%s data=%s schedule=%s",
                domain, service, service_data, sched_name,
            )
            try:
                await self._hass.services.async_call(
                    domain, service, service_data, blocking=False
                )
                executed_count += 1
                executed_entities.append(device["entity_id"])
                self._hass.bus.async_fire(EVENT_BLOCK_EXECUTED, {
                    "schedule_id": sched["id"],
                    "device_id": device_id,
                    "entity_id": device["entity_id"],
                    "action_id": action_id,
                    "value": value,
                })
            except Exception:
                _LOGGER.exception(
                    "Chronos: ERROR calling %s.%s for %s", domain, service, device["entity_id"]
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

        if executed_count and self._store.settings.get("notify_block_executed", True):
            value = action.get("value")
            value_str = ""
            if action_def.get("value") and value not in (None, ""):
                value_str = f" = {value}{action_def['value'].get('unit', '')}"
            await self._notify(
                f"{action_def['label']}{value_str} · {', '.join(executed_entities)}",
                title=f"Chronos · {sched_name}",
            )

    async def _apply_block(self, sched: dict, block: dict) -> None:
        """Apply a block transition. Evaluates legacy 'skip'-style weather rules
        before dispatching the action. Trigger-style rules (with trigger_action)
        are handled separately by _evaluate_triggers each tick."""
        sched_name = sched.get("name", "")
        weather_rules = sched.get("weather_rules", []) or []

        # Only legacy rules without trigger_action gate block execution.
        legacy_rules = [r for r in weather_rules if r.get("active") and not r.get("trigger_action")]

        for rule in legacy_rules:
            matched = await self._evaluate_rule(rule)
            if not matched:
                continue
            self._hass.bus.async_fire(EVENT_RULE_TRIGGERED, {
                "schedule_id": sched["id"],
                "schedule_name": sched_name,
                "rule_if": rule["if"],
                "rule_then": rule["then"],
            })
            if self._store.settings.get("notify_rule_triggered"):
                await self._notify(
                    f"Regola meteo attivata: {rule['if']} → {rule['then']}",
                    title=f"Chronos · {sched_name}",
                )
            then_lower = rule.get("then", "").lower()
            if "salta" in then_lower or "skip" in then_lower:
                _LOGGER.info(
                    "Chronos: SKIPPED schedule=%s by rule %s",
                    sched_name, rule["if"],
                )
                if self._store.settings.get("notify_sched_skipped"):
                    await self._notify(
                        f"Fascia saltata per regola meteo: {rule['if']}",
                        title=f"Chronos · {sched_name}",
                    )
                return

        await self._dispatch_action(sched, block)

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
        principale. Per le chiavi sun.* legge dall'entità sun.sun di HA."""
        overrides = self._store.settings.get("weather_sensor_map") or {}
        sensor_id = overrides.get(key)
        if sensor_id:
            state = self._hass.states.get(sensor_id)
            if state is None:
                return None
            if state.state in (None, "unknown", "unavailable"):
                return None
            return state.state

        # Sun attributes vengono dall'entità sun.sun (sempre presente in HA)
        if key.startswith("sun."):
            return self._read_sun_attribute(key.split(".", 1)[1])

        weather_entity = self._store.settings.get("weather_entity", "")
        if not weather_entity:
            return None
        weather_state = self._hass.states.get(weather_entity)
        if weather_state is None:
            return None
        if key == "condition":
            return weather_state.state
        return weather_state.attributes.get(key)

    def _read_sun_attribute(self, sub: str) -> Any:
        """Legge attributi dall'entità sun.sun.

        Espone elevation, azimuth, state direttamente, più due derivati
        comodi: minutes_until_sunrise e minutes_until_sunset.
        """
        sun = self._hass.states.get("sun.sun")
        if sun is None:
            return None
        attrs = sun.attributes

        if sub == "state":
            return sun.state  # "above_horizon" / "below_horizon"
        if sub == "elevation":
            return attrs.get("elevation")
        if sub == "azimuth":
            return attrs.get("azimuth")

        if sub in ("minutes_until_sunrise", "minutes_until_sunset"):
            from datetime import datetime, timezone
            field = "next_rising" if sub == "minutes_until_sunrise" else "next_setting"
            iso = attrs.get(field)
            if not iso:
                return None
            try:
                t = datetime.fromisoformat(str(iso).replace("Z", "+00:00"))
                now = datetime.now(timezone.utc)
                return max(0, int((t - now).total_seconds() / 60))
            except Exception:
                _LOGGER.debug("Cannot parse sun.%s timestamp: %s", field, iso)
                return None

        return None

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
