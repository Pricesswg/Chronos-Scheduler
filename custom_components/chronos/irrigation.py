"""Irrigation programs: timed valves, sequential zone programs, restart
recovery of valves left open, and value scaling of a program's legs."""
from __future__ import annotations

import asyncio
import logging

from homeassistant.util import dt as dt_util

from .events import log_to_logbook, make_history_entry

_LOGGER = logging.getLogger(__name__)



class IrrigationMixin:
    """Methods of ChronosScheduler that live here for readability. They run
    on the scheduler instance and use its attributes (_hass, _store, the
    per-feature state dicts set up in ChronosScheduler.__init__)."""

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
            # Legacy entries (pre-1.20 irrigation) have no off_service:
            # default to valve.close_valve. Newer ones (generic auto-off)
            # declare their domain's switch-off service.
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
                # Device still offline at startup: a blind switch-off
                # would be lost (HA accepts the call and nothing happens).
                # Arm the off-recall and keep the entity in the store, so
                # even ANOTHER restart still finds it.
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


    @staticmethod
    def _write_block_value(block: dict, new_value) -> None:
        """Write a rule-computed value onto a block's action.

        Normally that is just action.value. Sequential irrigation is the
        exception: its minutes live one per valve in action.sequence, and
        action.value is never read, so a scale/replace rule used to be
        silently ignored on those programs. There the value is taken as the
        TOTAL program length (the same total the editor shows) and the legs
        are scaled by a common factor, so the proportions the user set
        between zones are preserved. Every leg keeps at least one minute:
        scaling a program down must not silently drop a zone.
        """
        action = block.setdefault("action", {})
        sequence = action.get("sequence")
        is_sequential = (
            action.get("mode") == "sequential"
            and isinstance(sequence, list)
            and sequence
        )
        if not is_sequential:
            action["value"] = new_value
            return

        try:
            target_total = float(new_value)
        except (TypeError, ValueError):
            return
        if target_total <= 0:
            return

        legs = []
        for item in sequence:
            if not isinstance(item, dict):
                continue
            try:
                legs.append((item, max(0.0, float(item.get("minutes") or 0))))
            except (TypeError, ValueError):
                continue
        if not legs:
            return

        current_total = sum(m for _, m in legs)
        if current_total > 0:
            factor = target_total / current_total
            for item, mins in legs:
                item["minutes"] = max(1.0, round(mins * factor, 1))
        else:
            # No usable proportions to keep: split the total evenly.
            share = max(1.0, round(target_total / len(legs), 1))
            for item, _ in legs:
                item["minutes"] = share
        # Keep value in sync for anything that reads it (history, UI hints).
        action["value"] = new_value


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
                    self._store.append_history(make_history_entry(
                        sched, kind="block", action_id="open_valve",
                        entity_id=ent, value=f"{mins}min",
                    ))
                    await log_to_logbook(
                        self._hass, sched, action_id="open_valve",
                        entity_id=ent, extra=f"{mins}min",
                    )
                except Exception:
                    _LOGGER.exception("Chronos: open_valve failed for %s in sequence", ent)
                    self._store.append_history(make_history_entry(
                        sched, kind="block", action_id="open_valve",
                        entity_id=ent, outcome="error",
                        error="open_valve failed; skipping this station",
                    ))
                    current = None
                    continue
                # Wait the station's run time. Cancellation (HA stopping)
                # propagates out of the sleep into the finally below.
                await asyncio.sleep(mins * 60)
                # Valve offline at close time → off-recall (see
                # _off_or_arm): a lost close must be recovered as soon as
                # the valve is reachable again, that's running water.
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
                    self._store.append_history(make_history_entry(
                        sched, kind="block", action_id="open_valve",
                        entity_id=ent, value=f"{minutes:g}min",
                    ))
                    await log_to_logbook(
                        self._hass, sched, action_id="open_valve",
                        entity_id=ent, extra=f"{minutes:g}min",
                    )
                except Exception:
                    _LOGGER.exception("Chronos: open_valve failed for %s in timed run", ent)
                    self._store.append_history(make_history_entry(
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
            # A valve offline at close time arms the off-recall: a lost
            # close is running water, it must be recovered as soon as the
            # device is reachable again (see _off_or_arm).
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


    async def _settle_sequence_entry(
        self, sched: dict, seq_key: str, entity_ids: list[str], off_service: str
    ) -> None:
        """Settle the store entry at the end of a runner. If some entity
        has an armed off-recall (it was offline at switch-off time), the
        entry stays in the store reduced to the pending entities: an HA
        restart with the off-recall still pending doesn't lose the
        switch-off, the recovery in start() picks it up. With nothing
        pending, clean up as usual."""
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
