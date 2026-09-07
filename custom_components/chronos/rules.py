"""Rule evaluation and effects: continuous effects on the effective blocks,
edge-triggered actions, hold-on-threshold rules."""
from __future__ import annotations

import logging

from .events import get_action_def, make_history_entry
from .expressions import OPS, hold_candidate, parse_expression, split_and

_LOGGER = logging.getLogger(__name__)



class RulesMixin:
    """Methods of ChronosScheduler that live here for readability. They run
    on the scheduler instance and use its attributes (_hass, _store, the
    per-feature state dicts set up in ChronosScheduler.__init__)."""

    def _rules_for(self, schedule_id: str) -> list[dict]:
        """Per-schedule view of the global rules store (v1.17+).

        One legacy-shaped dict per (rule, target) pair, with the target's
        block_index inlined, so the effect/trigger machinery below keeps
        consuming the same shape it did when rules lived inside schedules.
        """
        sid = str(schedule_id)
        out: list[dict] = []
        for rule in self._store.rules:
            for tgt in rule.get("targets") or []:
                if str(tgt.get("schedule_id")) == sid:
                    out.append({**rule, "block_index": tgt.get("block_index")})
        return out


    def _evaluate_if(self, expr: str) -> bool:
        """Sync wrapper for rule IF parsing+eval (read attribute via store).

        Supports a flat AND-conjunction of single comparisons, separated by
        ' AND ' (case-insensitive). Every clause must be true for the rule
        to fire. forecast.* clauses read from the in-memory forecast cache
        (refreshed by the polling timer); with an empty cache they evaluate
        to False.
        """
        clauses = split_and(expr)
        if not clauses:
            return False
        for clause in clauses:
            if not self._evaluate_single_clause(clause):
                return False
        return True


    def _evaluate_single_clause(self, expr: str) -> bool:
        parsed = parse_expression(expr)
        if parsed is None:
            return False
        key, op_str, threshold_str = parsed
        op_fn = OPS.get(op_str)
        if op_fn is None:
            return False
        if key.startswith("forecast."):
            actual = self._forecast_value_from_cache(key)
        else:
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
            self._write_block_value(block, rule.get("action_value"))

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
            self._write_block_value(block, round(new_value, 2))


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


    async def _evaluate_triggers(self, sched: dict, local_now, effective_blocks: list, current_idx: int) -> None:
        """Evaluate all active force_action rules on this schedule. Fire on
        edge transitions, gated by fire_mode and (when set) by block_index
        matching the currently active block.
        """
        sched_id = str(sched.get("id", ""))
        sched_name = sched.get("name", "")
        rules = self._rules_for(sched_id)
        for idx, rule in enumerate(rules):
            if not rule.get("active"):
                continue
            if rule.get("effect") != "force_action":
                continue
            # If rule targets a specific block, only fire when that block is active
            target_idx = rule.get("block_index")
            if isinstance(target_idx, int) and target_idx != current_idx:
                continue
            # Keyed by rule id (stable across reorders/deletions), per
            # schedule: a rule shared by two schedules keeps independent
            # edge state on each.
            key = f"{sched_id}:{rule.get('id', idx)}"
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
            self._store.append_history(make_history_entry(
                sched, kind="rule", action_id=rule.get("action_id", ""),
                entity_id=None, value=rule.get("action_value"),
                rule_id=rule.get("id"),
            ))


    async def _evaluate_holds(
        self, sched: dict, local_now, effective_blocks: list, current_idx: int,
    ) -> None:
        """Evaluate "hold on threshold" rules: keep a device in one state
        while a measured value stays past a threshold, and apply the release
        action once it comes back. The twilight-switch case: lights on while
        outdoor lux is below 20, off once it climbs over 40.

        Unlike force_action (a one-shot on the condition's rising edge) this
        drives BOTH transitions, so the device also comes back on its own.

        Two guards against flapping around the threshold:
          * a deadband, from the two thresholds (`hold_on` / `hold_off`);
          * a dwell time (`hold_dwell_min`): the new state must persist that
            long before it is committed.

        The trigger direction is implied by the thresholds: hold_on below
        hold_off means "engage under hold_on" (lux), hold_on above hold_off
        means "engage over hold_on" (a fan on heat). Only acts inside an
        active block, so the block window still says WHEN the rule may act.
        Nothing is re-asserted on every tick: a device switched by hand is
        left alone until the value crosses a threshold again.
        """
        sched_id = str(sched.get("id", ""))
        sched_name = sched.get("name", "")
        for idx, rule in enumerate(self._rules_for(sched_id)):
            if not rule.get("active") or rule.get("effect") != "hold":
                continue
            key = f"{sched_id}:{rule.get('id', idx)}"
            target_idx = rule.get("block_index")
            block_ok = current_idx >= 0 and (
                not isinstance(target_idx, int) or target_idx == current_idx
            )
            if not block_ok:
                # Outside the window the rule owns: forget the state so
                # re-entering the block re-applies from scratch. No command
                # is sent — closing the window is the block's own job.
                self._hold_state.pop(key, None)
                continue

            var = str(rule.get("hold_var") or "")
            raw = self._read_attribute(var) if var else None
            try:
                value = float(raw)
                on_th = float(rule.get("hold_on"))
                off_th = float(rule.get("hold_off"))
            except (TypeError, ValueError):
                _LOGGER.debug(
                    "Chronos: HOLD skipped schedule=%s var=%s unreadable (raw=%r)",
                    sched_name, var, raw,
                )
                continue

            candidate = hold_candidate(value, on_th, off_th)

            state = self._hold_state.setdefault(
                key, {"engaged": None, "pending": None, "pending_since": None}
            )
            if candidate is None or candidate == state["engaged"]:
                # Inside the deadband, or already where we want to be.
                state["pending"] = None
                state["pending_since"] = None
                continue

            try:
                dwell = max(0.0, float(rule.get("hold_dwell_min") or 0))
            except (TypeError, ValueError):
                dwell = 0.0
            # The first evaluation of a block commits at once, so entering a
            # block after dark switches on immediately instead of waiting.
            if dwell > 0 and state["engaged"] is not None:
                if state["pending"] != candidate:
                    state["pending"] = candidate
                    state["pending_since"] = local_now
                    continue
                since = state["pending_since"]
                if since is not None and (local_now - since).total_seconds() < dwell * 60:
                    continue

            action_id = rule.get("hold_action_id") if candidate else rule.get("hold_release_action_id")
            action_value = rule.get("hold_action_value") if candidate else rule.get("hold_release_action_value")
            if not action_id:
                _LOGGER.debug(
                    "Chronos: HOLD schedule=%s has no %s action configured",
                    sched_name, "engage" if candidate else "release",
                )
                state["engaged"] = candidate
                continue

            state["engaged"] = candidate
            state["pending"] = None
            state["pending_since"] = None
            _LOGGER.info(
                "Chronos: HOLD schedule=%s %s (%s=%s vs on=%s off=%s) → action=%s val=%s",
                sched_name, "ENGAGE" if candidate else "RELEASE",
                var, value, on_th, off_th, action_id, action_value,
            )
            await self._execute_trigger(sched, {"action_id": action_id, "value": action_value})
            self._store.append_history(make_history_entry(
                sched, kind="rule", action_id=action_id,
                entity_id=None, value=action_value,
                rule_id=rule.get("id"),
            ))


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


    async def _execute_trigger(self, sched: dict, trigger: dict) -> None:
        """Execute a structured trigger action on all devices of the schedule.

        trigger schema: { "action_id": str, "value"?: number|str }
        """
        device_type = sched.get("device_type", "")
        action_id = trigger.get("action_id", "")
        value = trigger.get("value")
        action_def = get_action_def(device_type, action_id)
        if not action_def:
            _LOGGER.warning(
                "Chronos: TRIGGER skipped — no action def for %s.%s",
                device_type, action_id,
            )
            return
        # Reuse the dispatcher by synthesising a fake block. Going straight
        # to _dispatch_action (instead of _apply_block) intentionally skips
        # the skip-rule re-evaluation: the trigger's own IF already gated it.
        synthetic_block = {"start": 0, "end": 0, "action": {"id": action_id, "value": value}}
        await self._dispatch_action(sched, synthetic_block)


    async def _evaluate_rule(self, rule: dict) -> bool:
        """Async rule eval: handles forecast.* clauses (which need a service
        call) plus the same flat AND-conjunction supported by _evaluate_if."""
        expr = rule.get("if", "")
        clauses = split_and(expr)
        if not clauses:
            _LOGGER.warning("Cannot parse rule expression: %s", expr)
            return False
        for clause in clauses:
            if not await self._evaluate_single_clause_async(clause):
                return False
        return True


    async def _evaluate_single_clause_async(self, expr: str) -> bool:
        parsed = parse_expression(expr)
        if parsed is None:
            _LOGGER.warning("Cannot parse rule clause: %s", expr)
            return False
        key, op_str, threshold_str = parsed
        op_fn = OPS.get(op_str)
        if op_fn is None:
            return False
        if key.startswith("forecast."):
            actual = await self._get_forecast_value(key)
        else:
            actual = self._read_attribute(key)
        if actual is None:
            return False
        try:
            return op_fn(float(actual), float(threshold_str))
        except (ValueError, TypeError):
            return op_fn(str(actual), threshold_str)
