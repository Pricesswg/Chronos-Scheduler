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


_AND_SPLIT = re.compile(r"\s+AND\s+", re.IGNORECASE)


def _split_and(expr: str) -> list[str]:
    """Split a compound IF expression on ' AND ' (case-insensitive). The
    delimiter requires whitespace on both sides so it cannot accidentally
    chop substrings inside entity_ids or attribute names."""
    if not expr:
        return []
    return [p.strip() for p in _AND_SPLIT.split(expr) if p.strip()]


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
            # Optional recurring date range (year-agnostic).
            if not self._is_in_date_range(sched, local_now):
                continue

            # Compute effective blocks: original blocks with continuous rule
            # effects applied (extend/shrink/shift/replace_value/scale_*).
            effective_blocks = self._effective_blocks(sched)
            current_block, current_idx = self._block_at(effective_blocks, current_hour)
            prev_key = sched_id
            previous_block = self._last_executed.get(prev_key)

            if current_block != previous_block:
                self._last_executed[prev_key] = current_block
                if current_block is not None:
                    _LOGGER.info(
                        "Chronos: TRANSITION schedule=%s hour=%.2f → block #%d resolved=%.2f-%.2f action=%s",
                        sched_name, current_hour, current_idx,
                        self._resolve_block_time(current_block, "start"),
                        self._resolve_block_time(current_block, "end"),
                        current_block.get("action"),
                    )
                    await self._apply_block(sched, current_block, current_idx)

            await self._evaluate_triggers(sched, local_now, effective_blocks, current_idx)

    def _is_in_date_range(self, sched: dict, today_local) -> bool:
        """Return True if today (month/day) is inside the schedule's recurring
        date range (year-agnostic). When no range is set, always True.

        Range can wrap across year-end (e.g. Dec 1 → Feb 28).
        """
        dr = sched.get("date_range")
        if not dr:
            return True
        try:
            sm = int(dr.get("start_month", 0))
            sd = int(dr.get("start_day", 0))
            em = int(dr.get("end_month", 0))
            ed = int(dr.get("end_day", 0))
        except (TypeError, ValueError):
            return True
        if not (sm and sd and em and ed):
            return True
        cur = today_local.month * 100 + today_local.day
        start = sm * 100 + sd
        end = em * 100 + ed
        if start <= end:
            return start <= cur <= end
        # wraps across year-end
        return cur >= start or cur <= end

    def _block_at(self, blocks: list, hour: float) -> tuple[dict | None, int]:
        for i, block in enumerate(blocks):
            start = self._resolve_block_time(block, "start")
            end = self._resolve_block_time(block, "end")
            if start <= hour < end:
                return block, i
        return None, -1

    def _effective_blocks(self, sched: dict) -> list[dict]:
        """Return blocks with continuous rule effects applied.

        Continuous effects: shift, extend, shrink, replace_value, scale_duration,
        scale_value. They are recomputed every tick so the schedule reacts to
        live weather without modifying stored data.

        Trigger effects (skip, force_action) are NOT applied here — they fire
        as side effects in _evaluate_triggers.
        """
        blocks = [dict(b) for b in sched.get("blocks", []) or []]
        rules = sched.get("weather_rules", []) or []
        for rule in rules:
            if not rule.get("active"):
                continue
            effect = rule.get("effect")
            if effect not in ("shift", "extend", "shrink", "replace_value", "scale_duration", "scale_value"):
                continue
            # For non-scale rules, gate by the IF condition
            if effect != "scale_duration" and effect != "scale_value":
                if rule.get("if"):
                    try:
                        if not self._evaluate_if(rule.get("if", "")):
                            continue
                    except Exception:
                        continue
            idx = rule.get("block_index")
            target_indices = [idx] if isinstance(idx, int) else list(range(len(blocks)))
            for ti in target_indices:
                if 0 <= ti < len(blocks):
                    self._apply_block_effect(blocks, ti, rule)
        return blocks

    def _evaluate_if(self, expr: str) -> bool:
        """Sync wrapper for rule IF parsing+eval (read attribute via store).

        Supports a flat AND-conjunction of single comparisons, separated by
        ' AND ' (case-insensitive). Every clause must be true for the rule
        to fire. forecast.* clauses are not evaluated synchronously — when
        present they make the whole expression false here; the async path
        in _evaluate_rule handles them properly.
        """
        clauses = _split_and(expr)
        if not clauses:
            return False
        for clause in clauses:
            if not self._evaluate_single_clause(clause):
                return False
        return True

    def _evaluate_single_clause(self, expr: str) -> bool:
        parsed = _parse_expression(expr)
        if parsed is None:
            return False
        key, op_str, threshold_str = parsed
        op_fn = OPS.get(op_str)
        if op_fn is None:
            return False
        if key.startswith("forecast."):
            return False  # forecast needs async
        actual = self._read_attribute(key)
        if actual is None:
            return False
        try:
            return op_fn(float(actual), float(threshold_str))
        except (ValueError, TypeError):
            return op_fn(str(actual), threshold_str)

    def _apply_block_effect(self, blocks: list, idx: int, rule: dict) -> None:
        """Apply one rule's continuous effect to blocks[idx], possibly adjusting
        an adjacent block to keep total time consistent."""
        block = blocks[idx]
        effect = rule["effect"]
        direction = rule.get("direction", "forward")
        delta_min = rule.get("delta_minutes", 0) or 0

        if effect == "shift":
            delta_h = delta_min / 60
            block["start"] = self._resolve_block_time(block, "start") + delta_h
            block["end"] = self._resolve_block_time(block, "end") + delta_h
            block["start"] = max(0.0, min(24.0, block["start"]))
            block["end"] = max(block["start"], min(24.0, block["end"]))
            for k in ("start_anchor", "start_offset", "end_anchor", "end_offset"):
                block.pop(k, None)

        elif effect in ("extend", "shrink"):
            delta_h = delta_min / 60
            if effect == "shrink":
                delta_h = -delta_h
            self._apply_duration_change(blocks, idx, delta_h, direction)

        elif effect == "replace_value":
            block.setdefault("action", {})["value"] = rule.get("action_value")

        elif effect == "scale_duration":
            new_minutes = self._compute_scale(rule)
            if new_minutes is None:
                return
            cur_start = self._resolve_block_time(block, "start")
            cur_end = self._resolve_block_time(block, "end")
            cur_duration_h = cur_end - cur_start
            new_duration_h = max(1/60, new_minutes / 60)
            delta_h = new_duration_h - cur_duration_h
            self._apply_duration_change(blocks, idx, delta_h, direction)

        elif effect == "scale_value":
            new_value = self._compute_scale(rule)
            if new_value is None:
                return
            block.setdefault("action", {})["value"] = round(new_value, 2)

    def _apply_duration_change(self, blocks: list, idx: int, delta_h: float, direction: str) -> None:
        """Add delta_h to block[idx] duration, adjusting the adjacent block.

        direction = "forward": end moves later, next block's start moves forward.
        direction = "backward": start moves earlier, previous block's end moves back.
        """
        block = blocks[idx]
        cur_start = self._resolve_block_time(block, "start")
        cur_end = self._resolve_block_time(block, "end")
        if direction == "backward":
            new_start = max(0.0, cur_start - delta_h)
            if idx > 0:
                prev = blocks[idx - 1]
                prev_start = self._resolve_block_time(prev, "start")
                new_start = max(prev_start + 1/60, new_start)
                prev["end"] = new_start
                for k in ("end_anchor", "end_offset"):
                    prev.pop(k, None)
            else:
                new_start = max(0.0, new_start)
            block["start"] = min(cur_end - 1/60, new_start)
            for k in ("start_anchor", "start_offset"):
                block.pop(k, None)
        else:
            # forward (default)
            new_end = min(24.0, cur_end + delta_h)
            if idx + 1 < len(blocks):
                nxt = blocks[idx + 1]
                nxt_end = self._resolve_block_time(nxt, "end")
                new_end = min(nxt_end - 1/60, new_end)
                nxt["start"] = new_end
                for k in ("start_anchor", "start_offset"):
                    nxt.pop(k, None)
            block["end"] = max(cur_start + 1/60, new_end)
            for k in ("end_anchor", "end_offset"):
                block.pop(k, None)

    def _compute_scale(self, rule: dict) -> float | None:
        """Linear scale of weather variable into output range."""
        var = rule.get("scale_var") or "temperature"
        var_min = float(rule.get("scale_var_min", 0))
        var_max = float(rule.get("scale_var_max", 1))
        out_min = float(rule.get("scale_out_min", 0))
        out_max = float(rule.get("scale_out_max", 1))
        cur = self._read_attribute(var)
        try:
            cur_f = float(cur) if cur is not None else var_min
        except (TypeError, ValueError):
            return None
        if var_max == var_min:
            return out_min
        ratio = (cur_f - var_min) / (var_max - var_min)
        ratio = max(0.0, min(1.0, ratio))
        return out_min + ratio * (out_max - out_min)

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

    async def _evaluate_triggers(self, sched: dict, local_now, effective_blocks: list, current_idx: int) -> None:
        """Evaluate all active force_action rules on this schedule. Fire on
        edge transitions, gated by fire_mode and (when set) by block_index
        matching the currently active block.
        """
        sched_id = str(sched.get("id", ""))
        sched_name = sched.get("name", "")
        rules = sched.get("weather_rules", []) or []
        for idx, rule in enumerate(rules):
            if not rule.get("active"):
                continue
            if rule.get("effect") != "force_action":
                continue
            # If rule targets a specific block, only fire when that block is active
            target_idx = rule.get("block_index")
            if isinstance(target_idx, int) and target_idx != current_idx:
                continue
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
                continue

            fire_mode = rule.get("fire_mode", "every")
            if not self._is_armed(fire_mode, state.get("last_fire"), local_now):
                _LOGGER.debug(
                    "Chronos: trigger ARMED-OFF schedule=%s rule=%s mode=%s last_fire=%s",
                    sched_name, rule.get("if"), fire_mode, state.get("last_fire"),
                )
                continue

            _LOGGER.info(
                "Chronos: TRIGGER schedule=%s rule=%s → force action=%s val=%s mode=%s block_idx=%s",
                sched_name, rule.get("if"), rule.get("action_id"), rule.get("action_value"),
                fire_mode, target_idx,
            )
            trigger_action = {"action_id": rule.get("action_id"), "value": rule.get("action_value")}
            await self._execute_trigger(sched, trigger_action)
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

        # Scene- and automation-type schedules don't iterate the schedule's
        # device list: the action's `value` is the entity_id (or list of
        # entity_ids) on which to invoke the service. One service call per
        # entity. Backward-compatible with v1.8 single-string scene values.
        if device_type in ("scene", "automation"):
            raw = action.get("value")
            entity_ids: list[str] = []
            if isinstance(raw, list):
                entity_ids = [str(x) for x in raw if x]
            elif isinstance(raw, str) and raw:
                entity_ids = [raw]
            if not entity_ids:
                _LOGGER.warning(
                    "Chronos: schedule=%s %s block has no target entity selected",
                    sched_name, device_type,
                )
                return
            executed: list[str] = []
            for ent in entity_ids:
                try:
                    _LOGGER.info(
                        "Chronos: CALL service %s.%s data={entity_id: %s} schedule=%s",
                        domain, service, ent, sched_name,
                    )
                    await self._hass.services.async_call(
                        domain, service, {"entity_id": ent}, blocking=False
                    )
                    executed.append(ent)
                    self._hass.bus.async_fire(EVENT_BLOCK_EXECUTED, {
                        "schedule_id": sched["id"],
                        "device_id": None,
                        "entity_id": ent,
                        "action_id": action_id,
                        "value": ent,
                    })
                except Exception:
                    _LOGGER.exception(
                        "Chronos: %s.%s failed for %s", domain, service, ent
                    )
            if executed and self._store.settings.get("notify_block_executed", True):
                await self._notify(
                    f"{action_def['label']} · {', '.join(executed)}",
                    title=f"Chronos · {sched_name}",
                )
            return

        # Per-block device subset: when the block sets `device_ids`, restrict
        # the dispatch to that subset (intersected with the schedule's device
        # list, defending against stale references). When unset/empty, fall
        # back to the schedule's full device list.
        sched_ids = sched.get("device_ids", []) or []
        block_subset = block.get("device_ids")
        if isinstance(block_subset, list) and block_subset:
            allowed = set(sched_ids)
            device_ids = [d for d in block_subset if d in allowed]
        else:
            device_ids = list(sched_ids)
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

            # Optional extras: arbitrary service params the user attached to the
            # block action (e.g. light rgb_color, color_temp_kelvin, transition).
            extras = action.get("extras") or {}
            if isinstance(extras, dict):
                for k, v in extras.items():
                    if v is None or v == "":
                        continue
                    service_data[k] = v

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

    async def _apply_block(self, sched: dict, block: dict, block_idx: int = -1) -> None:
        """Apply a block transition. Evaluates 'skip' rules targeting this
        block before dispatching the action."""
        sched_name = sched.get("name", "")
        weather_rules = sched.get("weather_rules", []) or []

        for rule in weather_rules:
            if not rule.get("active"):
                continue
            if rule.get("effect") != "skip":
                continue
            target_idx = rule.get("block_index")
            if isinstance(target_idx, int) and target_idx != block_idx:
                continue
            matched = await self._evaluate_rule(rule)
            if not matched:
                continue
            self._hass.bus.async_fire(EVENT_RULE_TRIGGERED, {
                "schedule_id": sched["id"],
                "schedule_name": sched_name,
                "rule_if": rule.get("if", ""),
                "rule_then": rule.get("then", ""),
            })
            if self._store.settings.get("notify_rule_triggered"):
                await self._notify(
                    f"Regola meteo attivata: {rule.get('if', '')} → {rule.get('then', '')}",
                    title=f"Chronos · {sched_name}",
                )
            _LOGGER.info(
                "Chronos: SKIPPED schedule=%s block=#%d by rule %s",
                sched_name, block_idx, rule.get("if"),
            )
            if self._store.settings.get("notify_sched_skipped"):
                await self._notify(
                    f"Fascia saltata per regola meteo: {rule.get('if', '')}",
                    title=f"Chronos · {sched_name}",
                )
            return

        await self._dispatch_action(sched, block)

    async def _evaluate_rule(self, rule: dict) -> bool:
        """Async rule eval: handles forecast.* clauses (which need a service
        call) plus the same flat AND-conjunction supported by _evaluate_if."""
        expr = rule.get("if", "")
        clauses = _split_and(expr)
        if not clauses:
            _LOGGER.warning("Cannot parse rule expression: %s", expr)
            return False
        for clause in clauses:
            if not await self._evaluate_single_clause_async(clause):
                return False
        return True

    async def _evaluate_single_clause_async(self, expr: str) -> bool:
        parsed = _parse_expression(expr)
        if parsed is None:
            _LOGGER.warning("Cannot parse rule clause: %s", expr)
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

    # Domains accepted as direct entity references in IF expressions.
    # Anything starting with "sensor.<X>", "binary_sensor.<X>", … is read
    # directly from hass.states bypassing the weather/sun resolver. This
    # lets users build rules on arbitrary HA sensors (e.g. battery SOC,
    # PV forecast aggregators), introduced in v1.10.
    _DIRECT_DOMAINS = {"sensor", "binary_sensor", "number", "input_number"}

    def _read_attribute(self, key: str) -> Any:
        """Legge un attributo meteo. Se l'utente ha mappato il key a un'entità
        sensor specifica (override), legge da quella; altrimenti dal weather.*
        principale. Per le chiavi sun.* legge dall'entità sun.sun di HA.
        Per chiavi che assomigliano a entity_ids (sensor.X, binary_sensor.X,
        number.X, input_number.X) legge direttamente da hass.states."""
        overrides = self._store.settings.get("weather_sensor_map") or {}
        sensor_id = overrides.get(key)
        if sensor_id:
            state = self._hass.states.get(sensor_id)
            if state is None:
                return None
            if state.state in (None, "unknown", "unavailable"):
                return None
            return state.state

        # Direct entity reference: keys like "sensor.battery_soc" go straight
        # to hass.states. Keep this BEFORE the sun.* check so future "sensor.*"
        # weather attributes (none today) couldn't accidentally shadow sensors.
        if "." in key:
            domain, _ = key.split(".", 1)
            if domain in self._DIRECT_DOMAINS:
                state = self._hass.states.get(key)
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
