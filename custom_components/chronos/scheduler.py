"""Chronos scheduler core. See the mixins in this package for the per-feature
behaviour and gate.schedule_is_live for the one check every path goes through."""
from __future__ import annotations

import asyncio
import logging
from datetime import timedelta
from typing import Any

from homeassistant.core import CoreState, HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import async_track_time_interval
from homeassistant.helpers.start import async_at_started
from homeassistant.util import dt as dt_util

from .const import SIGNAL_STATE
from .gate import is_in_date_range, is_paused, pause_deadline, schedule_is_live
from .store import ChronosStore
from .timing import jitter_minutes
from .rules import RulesMixin
from .weather import WeatherMixin
from .recalls import RecallsMixin
from .irrigation import IrrigationMixin
from .presence import PresenceMixin
from .ondemand import OnDemandMixin
from .dispatch import DispatchMixin

_LOGGER = logging.getLogger(__name__)


class ChronosScheduler(
    RulesMixin,
    WeatherMixin,
    RecallsMixin,
    IrrigationMixin,
    PresenceMixin,
    OnDemandMixin,
    DispatchMixin,
):
    """The scheduler core: lifecycle, the minute tick, effective blocks and
    schedule status. Everything a tick can do lives in the mixins, one file
    per feature; the pure pieces (rule grammar, prices, timing, gate) are
    plain modules with no Home Assistant in them."""

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
        # "Hold on threshold" rules: key = f"{schedule_id}:{rule_id}", value =
        # {"engaged": bool|None, "pending": bool|None, "pending_since": dt}.
        # engaged None = never evaluated in the current block, so the first
        # evaluation commits without waiting for the dwell time. Dropped when
        # the block window closes, so each entry re-applies from scratch.
        self._hold_state: dict[str, dict] = {}
        # Presence simulation: key = f"{schedule_id}:{block_idx}", value =
        # {"cycle": int|None, "entity": str|None} = which activation of
        # today's plan is running and on which entity. Rebuilt from the plan
        # on every tick, so a restart resumes the evening as if nothing
        # happened; nothing is persisted.
        self._presence_state: dict[str, dict] = {}
        # Running sequential-irrigation programs: key = f"{sched_id}:{blk}".
        # Tracked so stop() can cancel them and a re-trigger doesn't start
        # a second concurrent run of the same block.
        self._sequence_tasks: dict[str, "asyncio.Task"] = {}
        # Recall for devices offline at dispatch: key f"{sched_id}:{ent}".
        # One entry per (schedule, entity) pair: a new block firing while
        # the device is still offline overwrites the old recall (the latest
        # desired state wins). In-memory registry: after a restart the
        # catch-up tick re-applies the active block anyway, so a device
        # that is still offline re-arms its recall on its own.
        self._pending_recalls: dict[str, dict[str, Any]] = {}
        self._unsub_recall = None
        # On-demand scene blocks (action.mode == "on_demand"): the scene is
        # NOT fired at block start; it fires when one of its member
        # entities transitions off → on during the block window, so nothing
        # lights up on its own but a manual turn-on gets the block's scene.
        # Keyed by schedule id (the active block owns the schedule).
        # In-memory: the catch-up tick re-arms after a restart.
        self._pending_scenes: dict[str, dict[str, Any]] = {}
        self._unsub_scene_watch = None
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
        # The first tick is a catch-up: apply the currently active block
        # right away instead of making the user wait for the next minute.
        # But during HA boot Chronos can be loaded BEFORE the `automation` /
        # `scene` integrations: an immediate catch-up would call
        # automation.turn_on before the service is registered and get a
        # spurious ServiceNotFound (the block then fires normally on the
        # next tick, but the user sees an error in History).
        # async_at_started runs the callback immediately when HA is already
        # running (reload / hot install), otherwise it defers it to the
        # homeassistant_started event (cold boot), when core services are
        # registered.
        self._unsub_started = async_at_started(self._hass, self._async_first_tick)

    async def _async_first_tick(self, _hass: HomeAssistant) -> None:
        # Invoked by async_at_started: HA is in the running state here.
        self._unsub_started = None
        # Forecast first, so the catch-up evaluates forecast.* rules
        # against real data instead of an empty cache.
        await self._refresh_forecast_cache()
        try:
            await self._tick(dt_util.utcnow())
        except Exception:
            _LOGGER.exception("Chronos: first catch-up tick failed")

    async def fire_now(self, schedule_id: str) -> dict:
        """Immediately execute the schedule's currently active block.

        Used by the chronos.fire_block service for manual testing. Resolves
        the block against the EFFECTIVE blocks (with the rules' continuous
        effects applied, like the tick does) but then dispatches directly,
        skipping skip-rules: the service is documented as a weather bypass.
        It is not an enable bypass: a disabled schedule, or one not scheduled
        today, is refused with the reason.
        """
        sched = self._store.get_schedule(schedule_id)
        if sched is None:
            return {"ok": False, "error": f"schedule {schedule_id} not found"}
        local_now = dt_util.now()
        reason = schedule_is_live(sched, local_now)
        if reason:
            return {"ok": False, "error": reason}
        current_hour = local_now.hour + local_now.minute / 60
        block, _idx = self._block_at(self._effective_blocks(sched), current_hour)
        if block is None:
            return {"ok": False, "error": f"no active block at {current_hour:.2f}"}
        _LOGGER.info("Chronos: manual fire_now schedule=%s block=%s", sched.get("name"), block)
        await self._dispatch_action(sched, block)
        return {"ok": True, "block": block}

    async def pause_schedule(self, schedule_id: str, until) -> dict:
        """Pause a schedule until `until` (aware datetime), or resume it
        when `until` is None.

        Pausing means "leave my devices alone until then", with one safety
        exception: what Chronos itself switched on is switched off first. A
        running block with an end action gets it now instead of at its end
        (a valve on a plug must not stay open because its off was paused
        away), and presence lights go off. The block bookkeeping is reset so
        the resume re-applies the active block like a catch-up tick.
        """
        sched = self._store.get_schedule(schedule_id)
        if sched is None:
            return {"ok": False, "error": f"schedule {schedule_id} not found"}
        if until is not None:
            previous = self._last_executed.pop(schedule_id, None)
            if previous is not None:
                await self._apply_block_end(sched, previous)
            for key in [k for k in self._presence_state if k.startswith(f"{schedule_id}:")]:
                await self._presence_switch_off(sched, key)
            await self._store.async_set_pause(schedule_id, until.isoformat())
            _LOGGER.info("Chronos: schedule %s paused until %s", sched.get("name"), until.isoformat())
        else:
            await self._store.async_set_pause(schedule_id, None)
            self._last_executed.pop(schedule_id, None)
            _LOGGER.info("Chronos: schedule %s resumed", sched.get("name"))
            # Resume at once rather than at the next minute.
            await self._tick(dt_util.utcnow())
        async_dispatcher_send(self._hass, SIGNAL_STATE)
        return {"ok": True, "paused_until": sched.get("paused_until")}

    async def stop(self) -> None:
        if self._unsub_tick:
            self._unsub_tick()
            self._unsub_tick = None
        if self._unsub_weather:
            self._unsub_weather()
            self._unsub_weather = None
        # If we unload before HA finishes booting, cancel the deferred
        # callback so it can't fire on an already-stopped scheduler.
        if self._unsub_started:
            self._unsub_started()
            self._unsub_started = None
        if self._unsub_recall:
            self._unsub_recall()
            self._unsub_recall = None
        self._pending_recalls.clear()
        if self._unsub_scene_watch:
            self._unsub_scene_watch()
            self._unsub_scene_watch = None
        self._pending_scenes.clear()
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

    async def _tick(self, now) -> None:
        # Defense: async_track_time_interval fires on wall-clock time
        # regardless of HA's state. If a tick lands while HA is not yet
        # `running` (boot longer than a minute), skip it: core services
        # like automation.turn_on may not be registered yet and we would
        # produce a spurious ServiceNotFound. The first useful tick after
        # HA is up still applies the active block (catch-up).
        if self._hass.state is not CoreState.running:
            _LOGGER.debug(
                "Chronos: tick skipped, HA not running yet (state=%s)",
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
            if sched.get("paused_until") and not is_paused(sched, local_now):
                # The pause ran out: drop the stale deadline so the card and
                # the entities stop showing it. The block bookkeeping was
                # reset when the pause began, so the active block re-applies
                # below like a catch-up.
                await self._store.async_set_pause(sched_id, None)
                async_dispatcher_send(self._hass, SIGNAL_STATE)
            if schedule_is_live(sched, local_now):
                continue

            # Compute effective blocks: original blocks with continuous rule
            # effects applied (extend/shrink/shift/replace_value/scale_*).
            effective_blocks = self._effective_blocks(sched)
            current_block, current_idx = self._block_at(effective_blocks, current_hour)
            prev_key = sched_id
            previous_block = self._last_executed.get(prev_key)

            if current_block != previous_block:
                self._last_executed[prev_key] = current_block
                if current_block is None and previous_block is not None:
                    # The block just ended and nothing took over. Blocks that
                    # asked to act on both edges send their end action here;
                    # this is the case that used to do nothing at all, which
                    # is why a "turn on" block appeared to never switch off.
                    await self._apply_block_end(sched, previous_block)
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
            # After the triggers, so a hold rule has the last word on the
            # device state when both act on the same block.
            await self._evaluate_holds(sched, local_now, effective_blocks, current_idx)
            await self._evaluate_presence(sched, local_now, current_block, current_idx)

        # Offline-recall safety net: the state listener is the primary
        # trigger, but a missed event (subscription race) must not leave
        # orphaned recalls. This also expires the ones whose block ended.
        await self._sweep_recalls()

        # Disarm on-demand scene watchers whose block window has closed.
        self._sweep_pending_scenes()

        # Persist any new history entries accumulated during this tick. The
        # store keeps them in memory and only writes to disk on flush, so a
        # busy tick with multiple dispatches still results in a single I/O.
        try:
            await self._store.flush_history()
        except Exception:
            _LOGGER.exception("Chronos: history flush failed")

        # Refresh the entity platforms (switch / binary_sensor / sensor):
        # block transitions and the "next change" countdown move on every
        # tick even when no action fires.
        async_dispatcher_send(self._hass, SIGNAL_STATE)

    def schedule_status(self, sched: dict) -> dict[str, Any]:
        """Read-only runtime view of a schedule, for the entity platforms.

        Returns whether a block is running right now, the current action and
        block window, and the next change time (as a local, tz-aware
        datetime). Pure read: no side effects. Reuses the same block math as
        the tick (`_effective_blocks`, `_block_at`, `_resolve_block_time`) so
        the entities never diverge from what the scheduler actually does.

        `next_change` for a future day is approximate when the block is
        sun-anchored, since sun times are resolved against today.
        """
        local_now = dt_util.now()
        weekday = local_now.weekday()
        current_hour = local_now.hour + local_now.minute / 60
        enabled = bool(sched.get("enabled"))
        paused = is_paused(sched, local_now)
        days = sched.get("days", [1] * 7)
        runs_today = (
            enabled
            and not paused
            and (weekday >= len(days) or bool(days[weekday]))
            and is_in_date_range(sched, local_now)
        )

        blocks = self._effective_blocks(sched)
        block, idx = self._block_at(blocks, current_hour) if runs_today else (None, -1)
        running = block is not None

        action = None
        block_start = block_end = None
        if block is not None:
            block_start = self._hour_to_dt(local_now, self._resolve_block_time(block, "start"))
            block_end = self._hour_to_dt(local_now, self._resolve_block_time(block, "end"))
            act = block.get("action") or {}
            action = act.get("id") or act.get("service")

        next_change = self._next_change_dt(sched, local_now, current_hour, running, block)

        return {
            "enabled": enabled,
            "running": running,
            "current_action": action,
            "block_start": block_start,
            "block_end": block_end,
            "next_change": next_change,
            "device_count": len(sched.get("device_ids") or []),
            "paused_until": pause_deadline(sched) if paused else None,
        }

    @staticmethod
    def _hour_to_dt(local_now, hour: float):
        """Convert an hour-of-day float (0..24) to a tz-aware datetime on the
        same local day. 24.0 (a block ending at midnight) rolls to the next
        day's 00:00."""
        if hour >= 24:
            base = (local_now + timedelta(days=1)).replace(
                hour=0, minute=0, second=0, microsecond=0
            )
            return base
        h = int(hour)
        m = int(round((hour - h) * 60))
        if m >= 60:
            h, m = h + 1, 0
        return local_now.replace(hour=min(h, 23), minute=m, second=0, microsecond=0)

    def _next_change_dt(self, sched: dict, local_now, current_hour: float, running: bool, block):
        """Next boundary the schedule will cross: the running block's end, else
        the next block start today, else the earliest start on the next day the
        schedule runs (scanning up to 7 days ahead). None if never."""
        if running and block is not None:
            return self._hour_to_dt(local_now, self._resolve_block_time(block, "end"))
        blocks = self._effective_blocks(sched)
        days = sched.get("days", [1] * 7)
        # Remaining starts today (only if the schedule runs today at all).
        weekday = local_now.weekday()
        runs_today = (
            bool(sched.get("enabled"))
            and (weekday >= len(days) or bool(days[weekday]))
            and is_in_date_range(sched, local_now)
        )
        if runs_today:
            starts = sorted(
                self._resolve_block_time(b, "start") for b in blocks
            )
            nxt = next((s for s in starts if s > current_hour), None)
            if nxt is not None:
                return self._hour_to_dt(local_now, nxt)
        # Scan forward for the next day this schedule runs.
        if not sched.get("enabled") or not blocks:
            return None
        for ahead in range(1, 8):
            day = local_now + timedelta(days=ahead)
            wd = day.weekday()
            if wd < len(days) and not days[wd]:
                continue
            if not is_in_date_range(sched, day):
                continue
            earliest = min(self._resolve_block_time(b, "start") for b in blocks)
            return self._hour_to_dt(day, earliest)
        return None

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
        # Deep enough copy to be safe to mutate. A plain dict(b) shares the
        # SAME action dict (and its sequence rows) with the stored schedule,
        # so a value-writing effect would edit the user's own configuration
        # in place: the editor would show the scaled value as if the user
        # had typed it, and any later save would make it permanent. Copy the
        # action and its sequence rows too.
        blocks = []
        for b in sched.get("blocks", []) or []:
            nb = dict(b)
            action = b.get("action")
            if isinstance(action, dict):
                na = dict(action)
                seq = na.get("sequence")
                if isinstance(seq, list):
                    na["sequence"] = [dict(x) if isinstance(x, dict) else x for x in seq]
                nb["action"] = na
            blocks.append(nb)

        # Random shift: a block with jitter_min moves by a per-day amount, the
        # same for both edges so its length is untouched. Applied here, before
        # the rules, so everything downstream (which block is active, dispatch,
        # the timeline's run spans) already sees today's real times.
        sched_id_str = str(sched.get("id", ""))
        day_iso = dt_util.now().date().isoformat()
        for idx, nb in enumerate(blocks):
            try:
                jitter = float(nb.get("jitter_min") or 0)
            except (TypeError, ValueError):
                continue
            if jitter <= 0:
                continue
            offset = jitter_minutes(sched_id_str, idx, day_iso, jitter)
            if not offset:
                continue
            for edge in ("start", "end"):
                if nb.get(f"{edge}_anchor"):
                    # Anchored edge: shift the offset, the anchor still wins.
                    nb[f"{edge}_offset"] = (nb.get(f"{edge}_offset") or 0) + offset
                else:
                    try:
                        base = float(nb.get(edge, 0))
                    except (TypeError, ValueError):
                        continue
                    nb[edge] = max(0.0, min(24.0, base + offset / 60))

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
