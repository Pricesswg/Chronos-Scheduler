from __future__ import annotations

import asyncio
import json
import logging
import operator
import re
from datetime import timedelta
from typing import Any

from homeassistant.core import Context, CoreState, HomeAssistant
from homeassistant.exceptions import ServiceNotFound
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_interval,
)
from homeassistant.helpers.start import async_at_started
from homeassistant.util import dt as dt_util

from .const import (
    ACTIONS_BY_TYPE,
    AUTO_OFF_SERVICE,
    EVENT_BLOCK_EXECUTED,
    EVENT_COMMAND_ERROR,
    EVENT_RULE_TRIGGERED,
    OFF_RECALL_MAX_AGE_HOURS,
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


def _make_history_entry(
    sched: dict,
    *,
    kind: str,
    action_id: str,
    entity_id: str | None,
    value: Any = None,
    outcome: str = "ok",
    error: str | None = None,
    rule_idx: int | None = None,
    rule_id: str | None = None,
) -> dict[str, Any]:
    """Build a history entry. Schedule name is snapshotted so deletions
    don't lose context for past entries. rule_idx is the legacy positional
    reference (pre-1.17 entries); new rule firings carry rule_id."""
    return {
        "ts": dt_util.utcnow().isoformat(),
        "schedule_id": str(sched.get("id", "")),
        "schedule_name": sched.get("name", ""),
        "device_type": sched.get("device_type", ""),
        "kind": kind,
        "action_id": action_id,
        "entity_id": entity_id,
        "value": value,
        "outcome": outcome,
        "error": error,
        "rule_idx": rule_idx,
        "rule_id": rule_id,
    }


def _fire_with_context(
    hass: HomeAssistant,
    event_type: str,
    data: dict[str, Any],
    sched: dict,
) -> Context:
    """Fire a Chronos event with its own Context, augment the data with
    schedule name (snapshotted for the logbook describer), and return a
    child Context whose parent_id points at the just-fired event. The
    caller passes that child Context to async_call so HA chains the
    resulting state_changed back to our event in the logbook timeline."""
    parent_ctx = Context()
    enriched = {
        "schedule_id": str(sched.get("id", "")),
        "schedule_name": sched.get("name", ""),
        **data,
    }
    hass.bus.async_fire(event_type, enriched, context=parent_ctx)
    return Context(parent_id=parent_ctx.id)


async def _log_to_logbook(
    hass: HomeAssistant,
    sched: dict,
    *,
    action_id: str,
    entity_id: str | None,
    extra: str = "",
) -> None:
    """Write a logbook entry via HA's `logbook.log` service. Issue #5:
    the chronos custom event was visible in the global Activity timeline
    via async_describe_event, but not when the user filtered the timeline
    by a specific entity. logbook.log writes a LOGBOOK_ENTRY which HA
    indexes by entity_id, so the resulting line appears in both the
    unfiltered view and in entity-scoped searches. We keep firing the
    chronos_block_executed event for our own History screen consumers
    (the WS endpoint reads the in-store ring buffer, not the logbook).
    """
    if not entity_id:
        return
    try:
        msg = f"executed action {action_id}"
        if extra:
            msg = f"{msg} ({extra})"
        await hass.services.async_call(
            "logbook",
            "log",
            {
                "name": f"Chronos · {sched.get('name', '?')}",
                "message": msg,
                "domain": "chronos",
                "entity_id": entity_id,
            },
            blocking=False,
        )
    except Exception:
        # Logbook is non-critical: don't let a logbook.log hiccup break
        # the actual dispatch. Errors are logged at debug level only.
        _LOGGER.debug("Chronos: logbook.log failed for %s", entity_id, exc_info=True)


class ChronosScheduler:
    def __init__(self, hass: HomeAssistant, store: ChronosStore) -> None:
        self._hass = hass
        self._store = store
        self._unsub_tick = None
        self._unsub_weather = None
        self._unsub_started = None
        self._last_executed: dict[str, Any] = {}
        # Per-rule edge-trigger state: key = f"{schedule_id}:{rule_idx}"
        # value = {"last_eval": bool, "last_fire": datetime|None}
        self._rule_state: dict[str, dict] = {}
        # Running sequential-irrigation programs: key = f"{sched_id}:{blk}".
        # Tracked so stop() can cancel them and a re-trigger doesn't start
        # a second concurrent run of the same block.
        self._sequence_tasks: dict[str, "asyncio.Task"] = {}
        # Recall per dispositivi offline al dispatch: key f"{sched_id}:{ent}".
        # Una sola entry per coppia (schedule, entità): un nuovo blocco che
        # scatta col dispositivo ancora offline sovrascrive il recall vecchio
        # (vince l'ultimo stato desiderato). Registro in memoria: al riavvio
        # il catch-up tick riapplica comunque il blocco attivo, quindi se il
        # dispositivo è ancora offline il recall si riarma da solo.
        self._pending_recalls: dict[str, dict[str, Any]] = {}
        self._unsub_recall = None
        # Hourly forecast cache, refreshed by _weather_poll every
        # polling_minutes. Lets forecast.* clauses be evaluated synchronously
        # (continuous effects) and avoids a blocking weather.get_forecasts
        # service call per rule per tick.
        self._forecast_cache: list[dict] = []
        self._forecast_cache_at = None

    async def start(self) -> None:
        # Restart safety: if a sequential irrigation program was running when
        # HA / the integration was restarted, the valves it had opened are
        # very likely still open (Chronos owns the timer, not the valve
        # hardware). Defensively close every valve of every interrupted
        # program before doing anything else, and record a restart event in
        # History so the user can see the integration restarted and whether
        # it aborted watering. This is unconditional by design (point 1).
        await self._recover_interrupted_sequences()

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
        # Il primo tick fa "catch-up": applica subito la fascia attiva senza
        # far aspettare l'utente fino al minuto dopo. Ma all'avvio di HA
        # Chronos può essere caricato PRIMA dell'integrazione `automation` /
        # `scene`: un catch-up immediato chiamerebbe automation.turn_on prima
        # che il servizio sia registrato e otterrebbe un ServiceNotFound
        # fasullo (la fascia poi parte regolarmente al tick successivo, ma
        # l'utente vede un errore in History). async_at_started esegue il
        # callback subito se HA è gia' running (reload / install a caldo),
        # altrimenti lo rinvia all'evento homeassistant_started (boot a
        # freddo), quando i servizi core sono registrati.
        self._unsub_started = async_at_started(self._hass, self._async_first_tick)

    async def _async_first_tick(self, _hass: HomeAssistant) -> None:
        # Invocato da async_at_started: a questo punto HA è in stato running.
        self._unsub_started = None
        # Prima il forecast, così il catch-up valuta le regole forecast.*
        # con dati reali invece che a cache vuota.
        await self._refresh_forecast_cache()
        try:
            await self._tick(dt_util.utcnow())
        except Exception:
            _LOGGER.exception("Chronos: errore al primo tick")

    async def fire_now(self, schedule_id: str) -> dict:
        """Esegue immediatamente la fascia correntemente attiva di una schedule.

        Usato dal servizio chronos.fire_block per test manuali. Risolve la
        fascia sui blocchi EFFETTIVI (con gli effetti continui delle regole
        applicati, come fa il tick) ma poi dispatcha direttamente, saltando
        le regole skip: il servizio è documentato come bypass del meteo.
        """
        sched = self._store.get_schedule(schedule_id)
        if sched is None:
            return {"ok": False, "error": f"schedule {schedule_id} non trovata"}
        local_now = dt_util.now()
        current_hour = local_now.hour + local_now.minute / 60
        block, _idx = self._block_at(self._effective_blocks(sched), current_hour)
        if block is None:
            return {"ok": False, "error": f"nessuna fascia attiva alle {current_hour:.2f}"}
        _LOGGER.info("Chronos: fire_now manuale schedule=%s block=%s", sched.get("name"), block)
        await self._dispatch_action(sched, block)
        return {"ok": True, "block": block}

    async def stop(self) -> None:
        if self._unsub_tick:
            self._unsub_tick()
            self._unsub_tick = None
        if self._unsub_weather:
            self._unsub_weather()
            self._unsub_weather = None
        # Se ci scolleghiamo prima che HA finisca l'avvio (unload durante il
        # boot), annulla il callback differito così non scatta su un
        # scheduler già fermo.
        if self._unsub_started:
            self._unsub_started()
            self._unsub_started = None
        if self._unsub_recall:
            self._unsub_recall()
            self._unsub_recall = None
        self._pending_recalls.clear()
        # Cancel running irrigation sequences. We DON'T close the valves
        # here: a clean stop is usually part of a restart, and the next
        # start() will run _recover_interrupted_sequences() which closes
        # them defensively and logs the restart. Closing here too would
        # risk a double close / racing service calls during teardown.
        for key, task in list(self._sequence_tasks.items()):
            if not task.done():
                task.cancel()
        self._sequence_tasks.clear()
        _LOGGER.info("Chronos scheduler stopped")

    async def _recover_interrupted_sequences(self) -> None:
        """Close valves left open by sequential irrigation programs that
        were interrupted by a restart, and log a restart event."""
        active = dict(self._store.active_sequences or {})
        if not active:
            # Still record the restart itself so the History screen has a
            # clear "integration restarted at T, no watering interrupted"
            # marker the user can rely on.
            self._store.append_history({
                "ts": dt_util.utcnow().isoformat(),
                "schedule_id": "",
                "schedule_name": "Chronos",
                "device_type": "system",
                "kind": "system",
                "action_id": "restart",
                "entity_id": None,
                "value": None,
                "outcome": "ok",
                "error": None,
                "rule_idx": None,
            })
            try:
                await self._store.flush_history()
            except Exception:
                _LOGGER.exception("Chronos: history flush failed on restart marker")
            return

        closed: list[str] = []
        deferred: dict[str, dict] = {}
        for key, info in active.items():
            # Le entry storiche (irrigazione pre-1.20) non hanno off_service:
            # default valve.close_valve. Quelle nuove (auto-off generico)
            # dichiarano il servizio di spegnimento del loro dominio.
            off_service = str(info.get("off_service") or "valve.close_valve")
            off_domain, _, off_name = off_service.partition(".")
            is_irrigation = off_service == "valve.close_valve"
            snap = {
                "id": info.get("schedule_id", ""),
                "name": info.get("schedule_name", "?"),
                "device_type": info.get("device_type", "irrigation"),
            }
            still_offline: list[str] = []
            for ent in info.get("entity_ids", []) or []:
                # Dispositivo ancora offline al riavvio: lo spegnimento
                # alla cieca andrebbe perso (HA accetta la chiamata e non
                # succede niente). Si arma l'off-recall e l'entità resta
                # nello store, così anche un ULTERIORE riavvio la ritrova.
                state = self._hass.states.get(ent)
                if state is None or state.state in ("unavailable", "unknown"):
                    self._arm_off_recall(
                        snap, ent, off_service,
                        "close_valve" if is_irrigation else "auto_off",
                    )
                    still_offline.append(ent)
                    continue
                try:
                    await self._hass.services.async_call(
                        off_domain, off_name, {"entity_id": ent}, blocking=False
                    )
                    closed.append(ent)
                except Exception:
                    _LOGGER.exception(
                        "Chronos: defensive %s failed for %s after restart",
                        off_service, ent,
                    )
            if still_offline:
                deferred[key] = {**info, "entity_ids": still_offline}
            offline_note = (
                f" ({len(still_offline)} device(s) still offline, will be "
                "switched off when back online)" if still_offline else ""
            )
            self._store.append_history({
                "ts": dt_util.utcnow().isoformat(),
                "schedule_id": info.get("schedule_id", ""),
                "schedule_name": info.get("schedule_name", "?"),
                "device_type": info.get("device_type", "irrigation"),
                "kind": "system",
                "action_id": "restart_abort" if is_irrigation else "restart_off",
                "entity_id": ", ".join(info.get("entity_ids", []) or []) or None,
                "value": None,
                "outcome": "error",
                "error": (
                    "Irrigation program interrupted by restart; valves closed defensively"
                    if is_irrigation
                    else "Auto-off timer interrupted by restart; devices switched off defensively"
                ) + offline_note,
                "rule_idx": None,
            })
        _LOGGER.warning(
            "Chronos: restart interrupted %d timed program(s); "
            "defensively switched off: %s; deferred (offline): %s",
            len(active), closed,
            [e for d in deferred.values() for e in d["entity_ids"]],
        )
        await self._store.clear_all_sequences()
        for key, info in deferred.items():
            await self._store.set_active_sequence(key, info)
        try:
            await self._store.flush_history()
        except Exception:
            _LOGGER.exception("Chronos: history flush failed on restart recovery")

    async def _tick(self, now) -> None:
        # Difesa: async_track_time_interval scatta sull'orologio a
        # prescindere dallo stato di HA. Se un tick cade mentre HA non è
        # ancora `running` (boot oltre il minuto), saltalo: servizi core
        # come automation.turn_on potrebbero non essere ancora registrati
        # e produrremmo un ServiceNotFound fasullo. Al primo tick utile, a
        # HA avviato, la fascia attiva viene comunque applicata (catch-up).
        if self._hass.state is not CoreState.running:
            _LOGGER.debug(
                "Chronos: tick saltato, HA non ancora running (state=%s)",
                self._hass.state,
            )
            return
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

        # Rete di sicurezza del recall offline: il listener di stato è il
        # trigger primario, ma un evento perso (race di sottoscrizione) non
        # deve lasciare recall orfani. Qui si chiudono anche quelli scaduti
        # a fascia finita.
        await self._sweep_recalls()

        # Persist any new history entries accumulated during this tick. The
        # store keeps them in memory and only writes to disk on flush, so a
        # busy tick with multiple dispatches still results in a single I/O.
        try:
            await self._store.flush_history()
        except Exception:
            _LOGGER.exception("Chronos: history flush failed")

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

    def _effective_blocks(self, sched: dict) -> list[dict]:
        """Return blocks with continuous rule effects applied.

        Continuous effects: shift, extend, shrink, replace_value, scale_duration,
        scale_value. They are recomputed every tick so the schedule reacts to
        live weather without modifying stored data.

        Trigger effects (skip, force_action) are NOT applied here — they fire
        as side effects in _evaluate_triggers.
        """
        blocks = [dict(b) for b in sched.get("blocks", []) or []]
        rules = self._rules_for(sched.get("id", ""))
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
        to fire. forecast.* clauses read from the in-memory forecast cache
        (refreshed by the polling timer); with an empty cache they evaluate
        to False.
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
            self._store.append_history(_make_history_entry(
                sched, kind="rule", action_id=rule.get("action_id", ""),
                entity_id=None, value=rule.get("action_value"),
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
        # Reuse the dispatcher by synthesising a fake block. Going straight
        # to _dispatch_action (instead of _apply_block) intentionally skips
        # the skip-rule re-evaluation: the trigger's own IF already gated it.
        synthetic_block = {"start": 0, "end": 0, "action": {"id": action_id, "value": value}}
        await self._dispatch_action(sched, synthetic_block)

    async def _run_irrigation_sequence(
        self, sched: dict, seq_key: str, sequence: list[dict],
    ) -> None:
        """Run a sequential irrigation program: open valve, wait its
        minutes, close it, move to the next. Persists the in-flight set of
        entity_ids so a restart can defensively close them. On cancellation
        (HA shutdown) the valve currently open is closed before exiting."""
        sched_name = sched.get("name", "?")
        sched_id = str(sched.get("id", ""))
        # Normalise + validate the program. Skip malformed rows rather than
        # abort the whole program over one bad entry.
        steps: list[tuple[str, float]] = []
        for item in sequence:
            if not isinstance(item, dict):
                continue
            ent = item.get("entity_id")
            mins = item.get("minutes")
            try:
                mins_f = float(mins)
            except (TypeError, ValueError):
                continue
            if ent and mins_f > 0:
                steps.append((str(ent), mins_f))
        if not steps:
            _LOGGER.warning(
                "Chronos: sequential irrigation %s has no valid steps; nothing to do", sched_name
            )
            return

        all_entities = [e for e, _ in steps]
        await self._store.set_active_sequence(seq_key, {
            "schedule_id": sched_id,
            "schedule_name": sched_name,
            "entity_ids": all_entities,
            "started_at": dt_util.utcnow().isoformat(),
        })
        _LOGGER.info(
            "Chronos: START sequential irrigation schedule=%s steps=%s",
            sched_name, [(e, m) for e, m in steps],
        )
        current: str | None = None
        try:
            for ent, mins in steps:
                current = ent
                try:
                    await self._hass.services.async_call(
                        "valve", "open_valve", {"entity_id": ent}, blocking=False
                    )
                    self._store.append_history(_make_history_entry(
                        sched, kind="block", action_id="open_valve",
                        entity_id=ent, value=f"{mins}min",
                    ))
                    await _log_to_logbook(
                        self._hass, sched, action_id="open_valve",
                        entity_id=ent, extra=f"{mins}min",
                    )
                except Exception:
                    _LOGGER.exception("Chronos: open_valve failed for %s in sequence", ent)
                    self._store.append_history(_make_history_entry(
                        sched, kind="block", action_id="open_valve",
                        entity_id=ent, outcome="error",
                        error="open_valve failed; skipping this station",
                    ))
                    current = None
                    continue
                # Wait the station's run time. Cancellation (HA stopping)
                # propagates out of the sleep into the finally below.
                await asyncio.sleep(mins * 60)
                # Valvola offline alla chiusura → off-recall (vedi
                # _off_or_arm): la chiusura persa va recuperata appena
                # torna raggiungibile, è acqua che scorre.
                await self._off_or_arm(sched, ent, "valve.close_valve", "close_valve")
                current = None
            _LOGGER.info("Chronos: DONE sequential irrigation schedule=%s", sched_name)
        except asyncio.CancelledError:
            # HA is shutting down mid-program: close the valve that's open
            # right now so we don't leave water running. start() will also
            # sweep on the next boot, but closing here makes a clean stop
            # tidy too.
            if current:
                await self._off_or_arm(sched, current, "valve.close_valve", "close_valve")
            raise
        finally:
            await self._settle_sequence_entry(sched, seq_key, all_entities, "valve.close_valve")
            self._sequence_tasks.pop(seq_key, None)
            try:
                await self._store.flush_history()
            except Exception:
                _LOGGER.exception("Chronos: history flush failed after sequence")

    async def _run_irrigation_timed(
        self,
        sched: dict,
        seq_key: str,
        entity_ids: list[str],
        minutes: float,
        action_label: str,
    ) -> None:
        """Global irrigation with a duration: open every valve in parallel,
        wait `minutes`, close them all. The in-flight set persists to the
        sequences store so a restart mid-watering closes the valves
        defensively (same recovery path as sequential programs). On
        cancellation (HA shutdown) everything opened is closed before
        exiting."""
        sched_name = sched.get("name", "?")
        sched_id = str(sched.get("id", ""))
        await self._store.set_active_sequence(seq_key, {
            "schedule_id": sched_id,
            "schedule_name": sched_name,
            "entity_ids": list(entity_ids),
            "started_at": dt_util.utcnow().isoformat(),
        })
        _LOGGER.info(
            "Chronos: START timed irrigation schedule=%s valves=%s duration=%.0fmin",
            sched_name, entity_ids, minutes,
        )
        opened: list[str] = []
        try:
            for ent in entity_ids:
                try:
                    await self._hass.services.async_call(
                        "valve", "open_valve", {"entity_id": ent}, blocking=False
                    )
                    opened.append(ent)
                    self._store.append_history(_make_history_entry(
                        sched, kind="block", action_id="open_valve",
                        entity_id=ent, value=f"{minutes:g}min",
                    ))
                    await _log_to_logbook(
                        self._hass, sched, action_id="open_valve",
                        entity_id=ent, extra=f"{minutes:g}min",
                    )
                except Exception:
                    _LOGGER.exception("Chronos: open_valve failed for %s in timed run", ent)
                    self._store.append_history(_make_history_entry(
                        sched, kind="block", action_id="open_valve",
                        entity_id=ent, outcome="error",
                        error="open_valve failed",
                    ))
            if not opened:
                return
            if self._store.settings.get("notify_block_executed", True):
                await self._notify(
                    f"{action_label} = {minutes:g}min · {', '.join(opened)}",
                    title=f"Chronos · {sched_name}",
                )
            # Cancellation (HA stopping) propagates out of the sleep into
            # the except/finally below.
            await asyncio.sleep(minutes * 60)
            # Una valvola offline alla chiusura arma l'off-recall: la
            # chiusura persa è acqua che scorre, va recuperata appena il
            # dispositivo torna raggiungibile (vedi _off_or_arm).
            for ent in opened:
                await self._off_or_arm(sched, ent, "valve.close_valve", "close_valve")
            _LOGGER.info("Chronos: DONE timed irrigation schedule=%s", sched_name)
        except asyncio.CancelledError:
            # HA is stopping mid-watering: close whatever we opened. The
            # next start() sweeps again defensively via the sequences store.
            for ent in opened:
                await self._off_or_arm(sched, ent, "valve.close_valve", "close_valve")
            raise
        finally:
            await self._settle_sequence_entry(sched, seq_key, opened, "valve.close_valve")
            self._sequence_tasks.pop(seq_key, None)
            try:
                await self._store.flush_history()
            except Exception:
                _LOGGER.exception("Chronos: history flush failed after timed irrigation")

    async def _run_auto_off(
        self,
        sched: dict,
        seq_key: str,
        entity_ids: list[str],
        minutes: float,
        off_service: str,
    ) -> None:
        """Auto-off timer per i blocchi turn_on (luci, prese, ventole,
        climatizzatori): l'accensione è già stata inviata dal dispatch
        normale (con brightness/extras/...); qui si aspetta `minutes` e si
        spegne. Stesso contratto di sicurezza dell'irrigazione a tempo: il
        set in volo persiste nello store sequences con il proprio
        off_service, così un riavvio a metà timer spegne i dispositivi al
        prossimo avvio, e la cancellazione (HA in stop) spegne subito."""
        sched_name = sched.get("name", "?")
        sched_id = str(sched.get("id", ""))
        await self._store.set_active_sequence(seq_key, {
            "schedule_id": sched_id,
            "schedule_name": sched_name,
            "entity_ids": list(entity_ids),
            "started_at": dt_util.utcnow().isoformat(),
            "off_service": off_service,
            "device_type": sched.get("device_type", ""),
        })
        _LOGGER.info(
            "Chronos: START auto-off schedule=%s entities=%s in %.0fmin via %s",
            sched_name, entity_ids, minutes, off_service,
        )

        async def _switch_off() -> list[str]:
            # Ritorna le sole entità a cui il comando è davvero partito:
            # quelle offline vengono armate come off-recall da _off_or_arm
            # (che scrive anche l'entry di errore nello storico) e NON
            # devono comparire come "executed".
            done: list[str] = []
            for ent in entity_ids:
                if await self._off_or_arm(sched, ent, off_service, "auto_off"):
                    done.append(ent)
            return done

        replaced = False
        try:
            await asyncio.sleep(minutes * 60)
            switched = await _switch_off()
            for ent in switched:
                self._store.append_history(_make_history_entry(
                    sched, kind="block", action_id="auto_off",
                    entity_id=ent, value=f"{minutes:g}min",
                ))
                await _log_to_logbook(
                    self._hass, sched, action_id="auto_off",
                    entity_id=ent, extra=f"{minutes:g}min",
                )
            _LOGGER.info("Chronos: DONE auto-off schedule=%s", sched_name)
        except asyncio.CancelledError:
            # Il marker viaggia sul Task stesso (impostato dal dispatch che
            # ci sostituisce): niente stato condiviso da ripulire, e se la
            # cancellazione ci coglie prima del try il flag muore con noi.
            replaced = bool(getattr(asyncio.current_task(), "_chronos_replaced", False))
            if not replaced:
                # HA in stop a metà timer: spegni subito. La recovery al
                # prossimo avvio ripassa comunque via store per sicurezza.
                await _switch_off()
            # Sostituzione: il blocco è stato ri-dispatchato, i dispositivi
            # sono appena stati riaccesi e il timer nuovo è già partito.
            # Non toccare niente.
            raise
        finally:
            if not replaced:
                await self._settle_sequence_entry(sched, seq_key, entity_ids, off_service)
                # Il task nuovo potrebbe già essersi registrato sulla stessa
                # chiave: rimuovi solo se la entry è ancora nostra.
                if self._sequence_tasks.get(seq_key) is asyncio.current_task():
                    self._sequence_tasks.pop(seq_key, None)
            try:
                await self._store.flush_history()
            except Exception:
                _LOGGER.exception("Chronos: history flush failed after auto-off")

    # --- Offline-device recall -------------------------------------------
    # Contratto: si arma SOLO per dispositivi offline al momento del
    # dispatch, mai per dispositivi online il cui stato "non torna" (quello
    # sarebbe combattere l'utente che ha toccato l'interruttore a mano).
    # Il retry scatta quando l'entità torna disponibile (listener di stato)
    # con lo sweep del tick come rete di sicurezza, ed è valido solo finché
    # la fascia armata è ancora attiva: mai un'azione fuori orario.

    def _arm_recall(self, sched: dict, block: dict, device_id: str, entity_id: str) -> bool:
        if not self._store.settings.get("offline_recall", True):
            return False
        key = f"{sched.get('id')}:{entity_id}"
        self._pending_recalls[key] = {
            "schedule_id": str(sched.get("id", "")),
            "entity_id": entity_id,
            "device_id": device_id,
            "action_id": (block.get("action") or {}).get("id"),
            "attempts": 0,
            "armed_at": dt_util.utcnow().isoformat(),
        }
        self._refresh_recall_listener()
        return True

    def _arm_off_recall(
        self, sched: dict, entity_id: str, off_service: str, action_id: str
    ) -> None:
        """Arma il recupero di uno SPEGNIMENTO perso (auto-off o chiusura
        valvole con dispositivo offline). A differenza del recall dei
        blocchi è SEMPRE attivo, non gated dall'impostazione offline_recall,
        e non è vincolato alla fascia: un dispositivo lasciato acceso da
        Chronos va spento appena torna raggiungibile, anche se la fascia è
        finita (spegnere in ritardo è la direzione sicura). Unico limite:
        l'età massima OFF_RECALL_MAX_AGE_HOURS, oltre la quale si rinuncia
        con nota nello storico."""
        key = f"{sched.get('id')}:off:{entity_id}"
        self._pending_recalls[key] = {
            "mode": "off",
            "schedule_id": str(sched.get("id", "")),
            "schedule_name": sched.get("name", "?"),
            "device_type": sched.get("device_type", ""),
            "entity_id": entity_id,
            "off_service": off_service,
            "action_id": action_id,
            "attempts": 0,
            "armed_at": dt_util.utcnow().isoformat(),
        }
        self._refresh_recall_listener()

    async def _off_or_arm(
        self, sched: dict, entity_id: str, off_service: str, action_id: str
    ) -> bool:
        """Spegne l'entità, oppure — se è offline — arma l'off-recall e
        scrive la verità nello storico invece del falso 'executed'.
        True se il comando è partito davvero."""
        state = self._hass.states.get(entity_id)
        if state is None or state.state in ("unavailable", "unknown"):
            self._arm_off_recall(sched, entity_id, off_service, action_id)
            self._store.append_history(_make_history_entry(
                sched, kind="block", action_id=action_id,
                entity_id=entity_id, outcome="error",
                error="Device offline; off-recall armed, it will be "
                      "switched off as soon as it comes back online",
            ))
            _LOGGER.warning(
                "Chronos: %s offline at %s; off-recall armed (schedule=%s)",
                entity_id, action_id, sched.get("name"),
            )
            return False
        try:
            domain, _, service = off_service.partition(".")
            await self._hass.services.async_call(
                domain, service, {"entity_id": entity_id}, blocking=False
            )
            return True
        except Exception:
            _LOGGER.exception("Chronos: %s failed for %s", off_service, entity_id)
            self._store.append_history(_make_history_entry(
                sched, kind="block", action_id=action_id,
                entity_id=entity_id, outcome="error",
                error=f"{off_service} failed",
            ))
            return False

    async def _settle_sequence_entry(
        self, sched: dict, seq_key: str, entity_ids: list[str], off_service: str
    ) -> None:
        """Chiusura dell'entry dello store a fine runner. Se qualche entità
        ha un off-recall armato (era offline allo spegnimento), l'entry
        resta nello store ridotta alle sole entità in sospeso: così un
        riavvio di HA con l'off-recall ancora pendente non perde lo
        spegnimento, la recovery in start() se ne riprende carico. Se non
        c'è niente in sospeso, si pulisce come sempre."""
        sid = str(sched.get("id", ""))
        armed_left = [
            e for e in entity_ids if f"{sid}:off:{e}" in self._pending_recalls
        ]
        if armed_left:
            await self._store.set_active_sequence(seq_key, {
                "schedule_id": sid,
                "schedule_name": sched.get("name", "?"),
                "entity_ids": armed_left,
                "started_at": dt_util.utcnow().isoformat(),
                "off_service": off_service,
                "device_type": sched.get("device_type", ""),
            })
        else:
            await self._store.clear_active_sequence(seq_key)

    def _refresh_recall_listener(self) -> None:
        """(Ri)sottoscrive il listener di stato sull'insieme corrente delle
        entità armate. Zero entità = zero listener: il costo esiste solo
        quando c'è almeno un recall pendente."""
        if self._unsub_recall:
            self._unsub_recall()
            self._unsub_recall = None
        ents = sorted({r["entity_id"] for r in self._pending_recalls.values()})
        if not ents:
            return
        self._unsub_recall = async_track_state_change_event(
            self._hass, ents, self._on_recall_state_change
        )

    async def _on_recall_state_change(self, event) -> None:
        new_state = event.data.get("new_state")
        if new_state is None or new_state.state in ("unavailable", "unknown"):
            return
        await self._sweep_recalls(only_entity=event.data.get("entity_id"))

    async def _sweep_recalls(self, only_entity: str | None = None) -> None:
        """Valuta i recall pendenti: scaduti (fascia finita, schedule
        disabilitata, giorno sbagliato) → chiusi con nota nello storico;
        dispositivo tornato online con fascia ancora attiva → ri-dispatch
        alla singola entità, fino al numero massimo di tentativi."""
        if not self._pending_recalls:
            return
        local_now = dt_util.now()
        current_hour = local_now.hour + local_now.minute / 60
        weekday = local_now.weekday()
        try:
            max_attempts = int(self._store.settings.get("offline_recall_max_attempts", 3) or 3)
        except (TypeError, ValueError):
            max_attempts = 3
        dirty = False
        for key, rec in list(self._pending_recalls.items()):
            ent = rec["entity_id"]
            if only_entity and ent != only_entity:
                continue

            # --- Off-recall: spegnimento perso, nessun vincolo di fascia ---
            if rec.get("mode") == "off":
                snap = {
                    "id": rec.get("schedule_id", ""),
                    "name": rec.get("schedule_name", "?"),
                    "device_type": rec.get("device_type", ""),
                }
                armed = dt_util.parse_datetime(rec.get("armed_at") or "")
                age_h = (
                    (dt_util.utcnow() - armed).total_seconds() / 3600
                    if armed else 0.0
                )
                if age_h > OFF_RECALL_MAX_AGE_HOURS:
                    self._pending_recalls.pop(key, None)
                    dirty = True
                    self._store.append_history(_make_history_entry(
                        snap, kind="block", action_id=rec.get("action_id") or "?",
                        entity_id=ent, outcome="error",
                        error=(
                            f"Off-recall expired after {OFF_RECALL_MAX_AGE_HOURS}h "
                            "offline; check the device and switch it off manually"
                        ),
                    ))
                    continue
                state = self._hass.states.get(ent)
                if state is None or state.state in ("unavailable", "unknown"):
                    continue
                rec["attempts"] += 1
                ok = False
                try:
                    off_domain, _, off_name = str(rec.get("off_service") or "").partition(".")
                    await self._hass.services.async_call(
                        off_domain, off_name, {"entity_id": ent}, blocking=False
                    )
                    ok = True
                except Exception:
                    _LOGGER.exception(
                        "Chronos: off-recall %s failed for %s",
                        rec.get("off_service"), ent,
                    )
                if ok:
                    _LOGGER.info(
                        "Chronos: OFF-RECALL dispatched %s to %s (schedule=%s)",
                        rec.get("off_service"), ent, rec.get("schedule_name"),
                    )
                    self._store.append_history(_make_history_entry(
                        snap, kind="block", action_id=rec.get("action_id") or "?",
                        entity_id=ent, value="recall",
                    ))
                    # Lo spegnimento è partito: la recovery al riavvio non
                    # deve più occuparsi di questa entità.
                    await self._store.async_remove_entity_from_sequences(ent)
                    self._pending_recalls.pop(key, None)
                    dirty = True
                elif rec["attempts"] >= max_attempts:
                    self._pending_recalls.pop(key, None)
                    dirty = True
                    self._store.append_history(_make_history_entry(
                        snap, kind="block", action_id=rec.get("action_id") or "?",
                        entity_id=ent, outcome="error",
                        error=f"Off-recall gave up after {rec['attempts']} attempts",
                    ))
                continue

            sched = self._store.get_schedule(rec["schedule_id"])
            expire_reason: str | None = None
            active_block: dict | None = None
            if sched is None or not sched.get("enabled"):
                expire_reason = "schedule disabled or removed"
            else:
                days = sched.get("days", [0] * 7)
                if weekday < len(days) and not days[weekday]:
                    expire_reason = "day mask no longer matches"
                elif not self._is_in_date_range(sched, local_now):
                    expire_reason = "outside the schedule's date range"
                else:
                    blocks = self._effective_blocks(sched)
                    active_block, _idx = self._block_at(blocks, current_hour)
                    if (
                        active_block is None
                        or (active_block.get("action") or {}).get("id") != rec.get("action_id")
                    ):
                        expire_reason = "block ended before the device came back online"
            if expire_reason:
                self._pending_recalls.pop(key, None)
                dirty = True
                self._store.append_history(_make_history_entry(
                    sched or {"id": rec["schedule_id"], "name": "?", "device_type": ""},
                    kind="block", action_id=rec.get("action_id") or "?",
                    entity_id=ent, outcome="error",
                    error=f"Offline recall expired: {expire_reason}",
                ))
                continue
            # Ancora offline (flap o sweep del tick): resta armato senza
            # consumare tentativi.
            state = self._hass.states.get(ent)
            if state is None or state.state in ("unavailable", "unknown"):
                continue
            # Il subset per-blocco può essere stato ristretto nel frattempo.
            sched_ids = sched.get("device_ids", []) or []
            subset = active_block.get("device_ids")
            if isinstance(subset, list) and subset:
                allowed = [d for d in subset if d in set(sched_ids)]
            else:
                allowed = list(sched_ids)
            if rec.get("device_id") not in allowed:
                self._pending_recalls.pop(key, None)
                dirty = True
                continue
            rec["attempts"] += 1
            ok = await self._recall_dispatch(sched, active_block, ent)
            if ok:
                self._pending_recalls.pop(key, None)
                dirty = True
            elif rec["attempts"] >= max_attempts:
                self._pending_recalls.pop(key, None)
                dirty = True
                self._store.append_history(_make_history_entry(
                    sched, kind="block", action_id=rec.get("action_id") or "?",
                    entity_id=ent, outcome="error",
                    error=f"Offline recall gave up after {rec['attempts']} attempts",
                ))
        if dirty:
            self._refresh_recall_listener()
            try:
                await self._store.flush_history()
            except Exception:
                _LOGGER.exception("Chronos: history flush failed after recall sweep")

    async def _recall_dispatch(self, sched: dict, block: dict, entity_id: str) -> bool:
        """Ri-dispatch dell'azione del blocco ATTUALE (non dello snapshot
        armato: se l'utente ha modificato valori nel frattempo, vale la
        versione corrente) alla singola entità tornata online."""
        device_type = sched.get("device_type", "")
        action = block.get("action", {}) or {}
        action_id = action.get("id")
        action_def = next(
            (a for a in ACTIONS_BY_TYPE.get(device_type, []) if a["id"] == action_id),
            None,
        )
        if not action_def or not action_def.get("service"):
            return True  # azione non dispatchabile: chiudi il recall senza errori
        domain, _, service = action_def["service"].partition(".")
        service_data = self._build_service_data(device_type, action_id, action, entity_id)
        try:
            child_ctx = _fire_with_context(self._hass, EVENT_BLOCK_EXECUTED, {
                "device_id": None,
                "entity_id": entity_id,
                "action_id": action_id,
                "value": action.get("value"),
            }, sched)
            await self._hass.services.async_call(
                domain, service, service_data, blocking=False, context=child_ctx,
            )
            self._store.append_history(_make_history_entry(
                sched, kind="block", action_id=action_id,
                entity_id=entity_id, value=action.get("value"),
            ))
            await _log_to_logbook(
                self._hass, sched, action_id=action_id,
                entity_id=entity_id, extra="recall",
            )
            _LOGGER.info(
                "Chronos: RECALL dispatched %s.%s to %s (schedule=%s)",
                domain, service, entity_id, sched.get("name"),
            )
            # Il blocco può dichiarare l'auto-off: un'entità recuperata in
            # ritardo deve comunque spegnersi dopo i suoi minuti, col suo
            # timer individuale (chiave distinta da quella di blocco per
            # non cancellare il timer degli altri dispositivi).
            if action_id == "turn_on" and device_type in AUTO_OFF_SERVICE:
                try:
                    auto_off_min = float(action.get("auto_off_min") or 0)
                except (TypeError, ValueError):
                    auto_off_min = 0
                if auto_off_min > 0:
                    auto_off_min = min(auto_off_min, 24 * 60)
                    seq_key = (
                        f"{sched.get('id')}:auto_off:"
                        f"{block.get('start')}-{block.get('end')}:recall:{entity_id}"
                    )
                    existing = self._sequence_tasks.get(seq_key)
                    if existing and not existing.done():
                        setattr(existing, "_chronos_replaced", True)
                        existing.cancel()
                    task = self._hass.async_create_task(
                        self._run_auto_off(
                            sched, seq_key, [entity_id],
                            auto_off_min, AUTO_OFF_SERVICE[device_type],
                        )
                    )
                    self._sequence_tasks[seq_key] = task
            return True
        except Exception:
            _LOGGER.exception("Chronos: recall dispatch failed for %s", entity_id)
            return False

    def _build_service_data(
        self, device_type: str, action_id: str, action: dict, entity_id: str
    ) -> dict[str, Any]:
        """Mappa il value del blocco (e gli extras) nel payload del servizio
        HA. Estratta dal loop di dispatch perché il recall offline deve
        ricostruire lo stesso identico payload per una singola entità."""
        service_data: dict[str, Any] = {"entity_id": entity_id}
        value = action.get("value")
        if action_id == "set_temperature" and value is not None:
            service_data["temperature"] = float(value)
        elif action_id == "set_preset" and value is not None:
            service_data["preset_mode"] = str(value)
        elif action_id == "set_hvac_mode" and value not in (None, ""):
            service_data["hvac_mode"] = str(value)
        elif action_id == "set_operation" and value is not None:
            service_data["operation_mode"] = str(value)
        elif action_id == "turn_on" and device_type == "light" and value is not None:
            service_data["brightness_pct"] = int(value)
        elif action_id == "turn_on" and device_type == "fan" and value is not None:
            service_data["percentage"] = int(value)
        elif action_id == "set_position" and value is not None:
            service_data["position"] = int(value)
        elif action_id == "set_value" and device_type == "input_number" and value is not None:
            try:
                service_data["value"] = float(value)
            except (TypeError, ValueError):
                _LOGGER.warning("Chronos: invalid input_number value %r", value)
        elif action_id == "select_option" and device_type == "input_select" and value not in (None, ""):
            service_data["option"] = str(value)

        # Optional extras: arbitrary service params the user attached to the
        # block action (e.g. light rgb_color, color_temp_kelvin, transition).
        extras = action.get("extras") or {}
        if isinstance(extras, dict):
            for k, v in extras.items():
                if v is None or v == "":
                    continue
                service_data[k] = v
        return service_data

    async def _dispatch_action(self, sched: dict, block: dict) -> None:
        """Internal: execute the block's action on all schedule devices.

        Refactored out of _apply_block so that triggers and fire_now can
        reuse it without re-running the block's own weather rules.
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

        # Service-type schedules invoke an arbitrary HA service. The block's
        # value holds the "domain.service_name" string, and an optional
        # `service_data` extras carries the JSON params dict. No device
        # iteration. Useful for mqtt.publish, backup.create, script.run, etc.
        #
        # Issue #10: for device_type=="service" the action def's `service`
        # field is intentionally an empty string (the real service comes
        # from action.value, parsed inside the branch below). Splitting
        # that empty string with "".split(".", 1) returns [""], a single
        # element, so the unpacking into (domain, service) below would
        # raise ValueError before we even reach the service branch.
        # Branch on device_type FIRST and parse the appropriate source.
        if device_type == "service":
            raw_service = action.get("value")
            if not raw_service or "." not in str(raw_service):
                _LOGGER.warning(
                    "Chronos: schedule=%s service block has no valid 'domain.service' set (value=%r)",
                    sched_name, raw_service,
                )
                return
            svc_domain, svc_name = str(raw_service).split(".", 1)
            extras_dict = action.get("extras") or {}
            raw_data = extras_dict.get("service_data") if isinstance(extras_dict, dict) else None
            service_data: dict[str, Any] = {}
            if isinstance(raw_data, dict):
                service_data = raw_data
            elif isinstance(raw_data, str) and raw_data.strip():
                try:
                    parsed = json.loads(raw_data)
                    if isinstance(parsed, dict):
                        service_data = parsed
                except json.JSONDecodeError:
                    _LOGGER.warning(
                        "Chronos: schedule=%s service block has invalid JSON service_data; ignoring it",
                        sched_name,
                    )
            # Validate the service exists before calling. HA's
            # ServiceNotFound exception is helpful at the log level, but
            # the user-facing history shows a verbose Python message; a
            # clean upfront check produces a friendlier history entry
            # and a clearer log line. Common cause: the user typed the
            # service path with the wrong separators (e.g.
            # `automation_turn.on` instead of `automation.turn_on`).
            if not self._hass.services.has_service(svc_domain, svc_name):
                _LOGGER.warning(
                    "Chronos: schedule=%s service block targets a non-existent service '%s.%s' "
                    "(check the Servizio HA field, format is 'domain.service_name')",
                    sched_name, svc_domain, svc_name,
                )
                self._store.append_history(_make_history_entry(
                    sched, kind="block", action_id=action_id,
                    entity_id=f"{svc_domain}.{svc_name}", value=raw_service,
                    outcome="error",
                    error=f"Service {svc_domain}.{svc_name} not registered. Check the service path (format: domain.service_name).",
                ))
                return
            try:
                _LOGGER.info(
                    "Chronos: CALL service %s.%s data=%s schedule=%s",
                    svc_domain, svc_name, service_data, sched_name,
                )
                # Fire our event first so HA's logbook can attribute the
                # subsequent state_changed back to "Chronos · <sched>".
                child_ctx = _fire_with_context(self._hass, EVENT_BLOCK_EXECUTED, {
                    "device_id": None,
                    "entity_id": f"{svc_domain}.{svc_name}",
                    "action_id": action_id,
                    "value": raw_service,
                }, sched)
                await self._hass.services.async_call(
                    svc_domain, svc_name, service_data, blocking=False, context=child_ctx,
                )
                self._store.append_history(_make_history_entry(
                    sched, kind="block", action_id=action_id,
                    entity_id=f"{svc_domain}.{svc_name}", value=raw_service,
                ))
                # Logbook entry tagged with the service path so HA's
                # entity-filter search shows the Chronos attribution.
                await _log_to_logbook(
                    self._hass, sched,
                    action_id=action_id,
                    entity_id=f"{svc_domain}.{svc_name}",
                )
                if self._store.settings.get("notify_block_executed", True):
                    await self._notify(
                        f"{svc_domain}.{svc_name}",
                        title=f"Chronos · {sched_name}",
                    )
            except Exception as ex:
                _LOGGER.exception(
                    "Chronos: %s.%s failed (service block, exception_class=%s)",
                    svc_domain, svc_name, type(ex).__name__,
                )
                self._hass.bus.async_fire(EVENT_COMMAND_ERROR, {
                    "schedule_id": sched["id"],
                    "schedule_name": sched_name,
                    "device_id": None,
                    "entity_id": f"{svc_domain}.{svc_name}",
                    "error": f"{type(ex).__name__}: {str(ex)[:200]}",
                }, context=Context())
                self._store.append_history(_make_history_entry(
                    sched, kind="block", action_id=action_id,
                    entity_id=f"{svc_domain}.{svc_name}", value=raw_service,
                    outcome="error", error=f"{type(ex).__name__}: {str(ex)[:200]}",
                ))
            return

        # For every other device type the service is statically defined in
        # the action def (e.g. "automation.turn_on", "light.turn_off"); split
        # it once here and reuse domain/service below. The earlier service-
        # branch return already handled the dynamic-service case.
        service_str = action_def["service"]
        if "." not in service_str:
            _LOGGER.warning(
                "Chronos: action def for %s.%s has invalid service '%s' (expected 'domain.service'). schedule=%s",
                device_type, action_id, service_str, sched_name,
            )
            return
        domain, service = service_str.split(".", 1)

        # Sequential irrigation: when an irrigation block is in "sequential"
        # mode it carries an ordered list of {entity_id, minutes}. Chronos
        # runs them one at a time (open, wait, close, next) in a background
        # task instead of firing all valves in parallel for a single shared
        # duration. The block acts as a trigger point; the program can run
        # well past the block's time window. Weather rules are evaluated
        # once at start (by _apply_block before we get here).
        if (
            device_type == "irrigation"
            and action.get("mode") == "sequential"
            and isinstance(action.get("sequence"), list)
            and action["sequence"]
        ):
            # Stable-enough key: schedule id + the block's start/end. Blocks
            # have no persistent id, but (start,end) is unique within a
            # schedule and survives reloads, which is all we need to prevent
            # a double concurrent run of the same program.
            seq_key = f"{sched.get('id', '')}:{block.get('start')}-{block.get('end')}"
            existing = self._sequence_tasks.get(seq_key)
            if existing is not None and not existing.done():
                _LOGGER.info(
                    "Chronos: sequential irrigation already running for %s; ignoring re-trigger",
                    seq_key,
                )
                return
            task = self._hass.async_create_task(
                self._run_irrigation_sequence(sched, seq_key, list(action["sequence"]))
            )
            self._sequence_tasks[seq_key] = task
            return

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
                # ServiceNotFound on a core service like automation.turn_on
                # almost always means a transient state where HA's service
                # registry has the domain unregistered for a brief window
                # (component reload, restart, slow boot). Retry once after
                # a short backoff before giving up. See issue follow-up on
                # cat-presence light schedules where automation.turn_on
                # intermittently returned ServiceNotFound on HA 2026.4.4.
                # Three attempts with growing backoff so a wider race
                # window during HA reloads is covered (0.6s + 1.2s = up
                # to ~1.8s of total tolerance). The diagnostic dump of
                # currently-registered services is wrapped in its own
                # try because async_services_for_domain isn't stable
                # across HA versions; if it raises (AttributeError on
                # older / removed API), the dump is skipped without
                # aborting the retry path itself.
                MAX_ATTEMPTS = 3
                attempts = 0
                last_ex: Exception | None = None
                while attempts < MAX_ATTEMPTS:
                    attempts += 1
                    try:
                        _LOGGER.info(
                            "Chronos: CALL service %s.%s data={entity_id: %s} schedule=%s attempt=%d",
                            domain, service, ent, sched_name, attempts,
                        )
                        if not self._hass.services.has_service(domain, service):
                            registered: list[str] = []
                            try:
                                all_services = self._hass.services.async_services()
                                registered = sorted((all_services.get(domain) or {}).keys())
                            except Exception:
                                _LOGGER.debug("Chronos: async_services() not callable; skipping registry dump", exc_info=True)
                            _LOGGER.warning(
                                "Chronos: %s.%s NOT registered before call (attempt=%d). "
                                "Registered services for domain '%s': %s",
                                domain, service, attempts, domain, registered,
                            )
                            if attempts < MAX_ATTEMPTS:
                                await asyncio.sleep(0.6 * attempts)
                                continue
                            raise ServiceNotFound(domain, service)
                        child_ctx = _fire_with_context(self._hass, EVENT_BLOCK_EXECUTED, {
                            "device_id": None,
                            "entity_id": ent,
                            "action_id": action_id,
                            "value": ent,
                        }, sched)
                        await self._hass.services.async_call(
                            domain, service, {"entity_id": ent}, blocking=False, context=child_ctx,
                        )
                        executed.append(ent)
                        self._store.append_history(_make_history_entry(
                            sched, kind="block", action_id=action_id,
                            entity_id=ent,
                        ))
                        await _log_to_logbook(
                            self._hass, sched,
                            action_id=action_id, entity_id=ent,
                        )
                        last_ex = None
                        break
                    except ServiceNotFound as ex:
                        last_ex = ex
                        _LOGGER.warning(
                            "Chronos: ServiceNotFound %s.%s on attempt %d/%d for entity %s",
                            domain, service, attempts, MAX_ATTEMPTS, ent,
                        )
                        if attempts < MAX_ATTEMPTS:
                            await asyncio.sleep(0.6 * attempts)
                            continue
                    except Exception as ex:
                        last_ex = ex
                        _LOGGER.exception(
                            "Chronos: %s.%s failed for %s (exception_class=%s)",
                            domain, service, ent, type(ex).__name__,
                        )
                        break
                if last_ex is not None:
                    self._store.append_history(_make_history_entry(
                        sched, kind="block", action_id=action_id,
                        entity_id=ent, outcome="error",
                        error=f"{type(last_ex).__name__}: {str(last_ex)[:200]}",
                    ))
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

        # Irrigation global mode with a duration: open every valve in
        # parallel, then close them after `value` minutes. Before 1.17.1
        # the duration was decorative — valve.open_valve takes no duration
        # param and nothing ever closed the valves (only sequential mode
        # had a timer). Runs as a tracked background task persisted to the
        # sequences store, so an HA restart mid-watering closes leftover
        # valves via the same recovery path as sequential programs. With
        # no valid duration the legacy behaviour (open and leave open) is
        # kept as an explicit escape hatch.
        if device_type == "irrigation" and action_id == "turn_on":
            minutes: float | None = None
            try:
                v = float(action.get("value"))
                if v > 0:
                    # Defensive cap: a corrupt value must not hold a valve
                    # open for weeks.
                    minutes = min(v, 24 * 60)
            except (TypeError, ValueError):
                minutes = None
            if minutes:
                entity_ids = []
                for device_id in device_ids:
                    device = self._store.get_device(device_id)
                    if device is not None:
                        entity_ids.append(device["entity_id"])
                if not entity_ids:
                    _LOGGER.warning(
                        "Chronos: schedule=%s timed irrigation has no resolvable valves",
                        sched_name,
                    )
                    return
                # One timed program per schedule at a time: a re-trigger
                # while running (fire_now, effective-block recompute) must
                # not start a second timer racing open/close on the same
                # valves.
                seq_key = f"{sched.get('id', '')}:global"
                existing = self._sequence_tasks.get(seq_key)
                if existing is not None and not existing.done():
                    _LOGGER.info(
                        "Chronos: timed irrigation already running for %s; ignoring re-trigger",
                        seq_key,
                    )
                    return
                task = self._hass.async_create_task(
                    self._run_irrigation_timed(
                        sched, seq_key, entity_ids, minutes, action_def.get("label", "open_valve"),
                    )
                )
                self._sequence_tasks[seq_key] = task
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

            # Dispositivo offline al dispatch: la chiamata al servizio NON
            # fallirebbe (HA la accetta e non succede niente), quindi prima
            # di questa verifica lo storico registrava un falso "ok". Ora
            # l'entry dice la verità e, se il recall è attivo, l'azione
            # viene riprovata quando l'entità torna online (fascia
            # permettendo). L'irrigazione è esclusa dal recall: riaprire
            # una valvola in ritardo fuori dal runner a tempo è un rischio,
            # non una cortesia.
            ent_state = self._hass.states.get(device["entity_id"])
            if ent_state is None or ent_state.state in ("unavailable", "unknown"):
                armed = (
                    device_type != "irrigation"
                    and self._arm_recall(sched, block, device_id, device["entity_id"])
                )
                _LOGGER.warning(
                    "Chronos: %s offline at dispatch (schedule=%s, state=%s)%s",
                    device["entity_id"], sched_name,
                    ent_state.state if ent_state else "missing",
                    "; recall armed" if armed else "",
                )
                self._store.append_history(_make_history_entry(
                    sched, kind="block", action_id=action_id,
                    entity_id=device["entity_id"], value=action.get("value"),
                    outcome="error",
                    error="Device offline at dispatch"
                          + ("; recall armed, will retry when it comes back online" if armed else ""),
                ))
                continue

            service_data = self._build_service_data(
                device_type, action_id, action, device["entity_id"]
            )
            value = action.get("value")

            _LOGGER.info(
                "Chronos: CALL service %s.%s data=%s schedule=%s",
                domain, service, service_data, sched_name,
            )
            try:
                child_ctx = _fire_with_context(self._hass, EVENT_BLOCK_EXECUTED, {
                    "device_id": device_id,
                    "entity_id": device["entity_id"],
                    "action_id": action_id,
                    "value": value,
                }, sched)
                await self._hass.services.async_call(
                    domain, service, service_data, blocking=False, context=child_ctx,
                )
                executed_count += 1
                executed_entities.append(device["entity_id"])
                self._store.append_history(_make_history_entry(
                    sched, kind="block", action_id=action_id,
                    entity_id=device["entity_id"], value=value,
                ))
                value_str = ""
                if value not in (None, ""):
                    value_str = f"value={value}"
                await _log_to_logbook(
                    self._hass, sched,
                    action_id=action_id,
                    entity_id=device["entity_id"],
                    extra=value_str,
                )
            except Exception as ex:
                _LOGGER.exception(
                    "Chronos: ERROR calling %s.%s for %s (exception_class=%s)",
                    domain, service, device["entity_id"], type(ex).__name__,
                )
                self._hass.bus.async_fire(EVENT_COMMAND_ERROR, {
                    "schedule_id": sched["id"],
                    "schedule_name": sched_name,
                    "device_id": device_id,
                    "entity_id": device["entity_id"],
                    "error": f"{type(ex).__name__}: {str(ex)[:200]}",
                }, context=Context())
                self._store.append_history(_make_history_entry(
                    sched, kind="block", action_id=action_id,
                    entity_id=device["entity_id"], value=value,
                    outcome="error", error=f"{type(ex).__name__}: {str(ex)[:200]}",
                ))
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

        # Auto-off timer: se il blocco turn_on chiede lo spegnimento
        # automatico dopo N minuti e almeno un dispositivo è stato acceso,
        # spawn del timer. Un re-dispatch dello stesso blocco (fire_now,
        # ri-trigger) riparte da zero: il timer precedente viene cancellato
        # e sostituito, coerente con "l'ho appena riacceso".
        if (
            executed_entities
            and action_id == "turn_on"
            and device_type in AUTO_OFF_SERVICE
        ):
            try:
                auto_off_min = float(action.get("auto_off_min") or 0)
            except (TypeError, ValueError):
                auto_off_min = 0
            if auto_off_min > 0:
                auto_off_min = min(auto_off_min, 24 * 60)
                seq_key = f"{sched.get('id')}:auto_off:{block.get('start')}-{block.get('end')}"
                existing = self._sequence_tasks.get(seq_key)
                if existing and not existing.done():
                    # Sostituzione, non shutdown: il task vecchio NON deve
                    # spegnere i dispositivi appena riaccesi né pulire lo
                    # store del nuovo. Il marker sta sul Task.
                    setattr(existing, "_chronos_replaced", True)
                    existing.cancel()
                task = self._hass.async_create_task(
                    self._run_auto_off(
                        sched, seq_key, list(executed_entities),
                        auto_off_min, AUTO_OFF_SERVICE[device_type],
                    )
                )
                self._sequence_tasks[seq_key] = task

    async def _apply_block(self, sched: dict, block: dict, block_idx: int = -1) -> None:
        """Apply a block transition. Evaluates 'skip' rules targeting this
        block before dispatching the action."""
        sched_name = sched.get("name", "")
        weather_rules = self._rules_for(sched.get("id", ""))

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
            # Fire with its own Context so the logbook describer attributes
            # the skipped block to "Chronos · <sched>" rather than to the
            # opaque service that didn't fire.
            self._hass.bus.async_fire(EVENT_RULE_TRIGGERED, {
                "schedule_id": sched["id"],
                "schedule_name": sched_name,
                "rule_if": rule.get("if", ""),
                "rule_then": rule.get("then", ""),
                "action_id": "skip",
            }, context=Context())
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
            actual = await self._get_forecast_value(key)
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

    async def _refresh_forecast_cache(self) -> None:
        """Fetch the hourly forecast from the configured weather entity and
        store it in memory. Called by the polling timer and lazily when the
        cache is stale. A failed fetch keeps the previous cache: stale data
        beats no data for rule evaluation."""
        weather_entity = self._store.settings.get("weather_entity", "")
        if not weather_entity:
            self._forecast_cache = []
            self._forecast_cache_at = None
            return
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
            return

        forecasts = []
        if isinstance(result, dict):
            for entity_data in result.values():
                if isinstance(entity_data, dict):
                    forecasts = entity_data.get("forecast", [])
                    break
        if forecasts:
            self._forecast_cache = forecasts
            self._forecast_cache_at = dt_util.utcnow()

    def _forecast_stale(self) -> bool:
        if self._forecast_cache_at is None:
            return True
        polling = self._store.settings.get("polling_minutes", 15) or 15
        # Twice the polling interval: tolerates one missed/failed poll
        # before forcing an inline refresh on the async rule path.
        return dt_util.utcnow() - self._forecast_cache_at > timedelta(
            minutes=max(5, polling) * 2
        )

    def _forecast_value_from_cache(self, key: str) -> float | str | None:
        """Derive a forecast.* attribute from the cached hourly forecast.
        Synchronous, so continuous effects (shift/extend/scale_*) can use
        forecast clauses too."""
        forecasts = self._forecast_cache
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
            return forecasts[5].get("condition") if len(forecasts) > 5 else None
        return None

    async def _get_forecast_value(self, key: str) -> float | str | None:
        if self._forecast_stale():
            await self._refresh_forecast_cache()
        return self._forecast_value_from_cache(key)

    async def _weather_poll(self, _now) -> None:
        await self._refresh_forecast_cache()

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
