"""Offline recall: an action lost because the device was unavailable is
retried when it comes back, as long as its schedule and block still want it."""
from __future__ import annotations

import logging

from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.util import dt as dt_util

from .const import ACTIONS_BY_TYPE, AUTO_OFF_SERVICE, EVENT_BLOCK_EXECUTED, OFF_RECALL_MAX_AGE_HOURS
from .events import fire_with_context, log_to_logbook, make_history_entry
from .gate import schedule_is_live

_LOGGER = logging.getLogger(__name__)



class RecallsMixin:
    """Methods of ChronosScheduler that live here for readability. They run
    on the scheduler instance and use its attributes (_hass, _store, the
    per-feature state dicts set up in ChronosScheduler.__init__)."""

    # --- Offline-device recall -------------------------------------------
    # Contract: arms ONLY for devices that were offline at dispatch time,
    # never for online devices whose state "doesn't match" (that would be
    # fighting a user who flipped the switch by hand). The retry fires when
    # the entity becomes available again (state listener) with the tick
    # sweep as a safety net, and it is only valid while the armed block is
    # still active: never an out-of-schedule action.

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
        """Arm the recovery of a LOST SWITCH-OFF (auto-off or valve close
        with the device offline). Unlike the block recall it is ALWAYS on,
        not gated by the offline_recall setting, and not bound to the block
        window: a device left on by Chronos must be switched off as soon as
        it is reachable again, even if the block has ended (switching off
        late is the safe direction). Only limit: the max age
        OFF_RECALL_MAX_AGE_HOURS, after which we give up with a History
        note."""
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
        """Switch the entity off, or — if it is offline — arm the
        off-recall and write the truth to History instead of a false
        'executed'. True when the command was actually sent."""
        state = self._hass.states.get(entity_id)
        if state is None or state.state in ("unavailable", "unknown"):
            self._arm_off_recall(sched, entity_id, off_service, action_id)
            # Warning, not failure: the off-recall owns the switch-off now.
            # The red entry only appears if it later expires or gives up.
            self._store.append_history(make_history_entry(
                sched, kind="block", action_id=action_id,
                entity_id=entity_id, outcome="warning",
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
            # Same chained context as every other action: without it the
            # logbook showed these switch-offs (end of block, auto-off,
            # presence, valve close) as changes with no cause.
            ctx = fire_with_context(self._hass, EVENT_BLOCK_EXECUTED, {
                "device_id": None,
                "entity_id": entity_id,
                "action_id": action_id,
                "value": None,
            }, sched)
            await self._hass.services.async_call(
                domain, service, {"entity_id": entity_id}, blocking=False, context=ctx,
            )
            return True
        except Exception:
            _LOGGER.exception("Chronos: %s failed for %s", off_service, entity_id)
            self._store.append_history(make_history_entry(
                sched, kind="block", action_id=action_id,
                entity_id=entity_id, outcome="error",
                error=f"{off_service} failed",
            ))
            return False


    def _refresh_recall_listener(self) -> None:
        """(Re)subscribe the state listener to the current set of armed
        entities. Zero entities = zero listeners: the cost only exists
        while at least one recall is pending."""
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
        """Evaluate pending recalls: expired ones (block ended, schedule
        disabled, wrong day) → closed with a History note; device back
        online with the block still active → re-dispatch to the single
        entity, up to the max number of attempts."""
        if not self._pending_recalls:
            return
        local_now = dt_util.now()
        current_hour = local_now.hour + local_now.minute / 60
        try:
            max_attempts = int(self._store.settings.get("offline_recall_max_attempts", 3) or 3)
        except (TypeError, ValueError):
            max_attempts = 3
        dirty = False
        for key, rec in list(self._pending_recalls.items()):
            ent = rec["entity_id"]
            if only_entity and ent != only_entity:
                continue

            # --- Off-recall: lost switch-off, no block-window bound ---
            if rec.get("mode") == "off":
                snap = {
                    "id": rec.get("schedule_id", ""),
                    "name": rec.get("schedule_name", "?"),
                    "device_type": rec.get("device_type", ""),
                }
                # Not schedule_is_live(): a lost switch-off must still go out
                # on a day the schedule does not run. Only existence and the
                # enabled flag matter here.
                # The recall belongs to its schedule. Once that is disabled
                # or deleted the lost switch-off must stay lost, or it comes
                # back to life with the device hours after the user turned
                # the schedule off: the one path that let a disabled
                # schedule act. The block-window branch below already had
                # this check; this branch never did.
                owner = self._store.get_schedule(rec.get("schedule_id"))
                if owner is None or not owner.get("enabled"):
                    self._pending_recalls.pop(key, None)
                    dirty = True
                    self._store.append_history(make_history_entry(
                        snap, kind="block", action_id=rec.get("action_id") or "?",
                        entity_id=ent, outcome="error",
                        error="Off-recall expired: schedule disabled or removed",
                    ))
                    continue
                armed = dt_util.parse_datetime(rec.get("armed_at") or "")
                age_h = (
                    (dt_util.utcnow() - armed).total_seconds() / 3600
                    if armed else 0.0
                )
                if age_h > OFF_RECALL_MAX_AGE_HOURS:
                    self._pending_recalls.pop(key, None)
                    dirty = True
                    self._store.append_history(make_history_entry(
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
                    # Chained context: the logbook attributes the switch-off
                    # to Chronos instead of showing an unexplained change,
                    # which is what every "it acted on its own" report
                    # needs to be settled either way.
                    ctx = fire_with_context(self._hass, EVENT_BLOCK_EXECUTED, {
                        "device_id": None,
                        "entity_id": ent,
                        "action_id": rec.get("action_id") or "?",
                        "value": "recall",
                    }, snap)
                    await self._hass.services.async_call(
                        off_domain, off_name, {"entity_id": ent}, blocking=False, context=ctx,
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
                    self._store.append_history(make_history_entry(
                        snap, kind="block", action_id=rec.get("action_id") or "?",
                        entity_id=ent, value="recall",
                    ))
                    # The switch-off went out: the startup recovery no
                    # longer needs to care about this entity.
                    await self._store.async_remove_entity_from_sequences(ent)
                    self._pending_recalls.pop(key, None)
                    dirty = True
                elif rec["attempts"] >= max_attempts:
                    self._pending_recalls.pop(key, None)
                    dirty = True
                    self._store.append_history(make_history_entry(
                        snap, kind="block", action_id=rec.get("action_id") or "?",
                        entity_id=ent, outcome="error",
                        error=f"Off-recall gave up after {rec['attempts']} attempts",
                    ))
                continue

            sched = self._store.get_schedule(rec["schedule_id"])
            active_block: dict | None = None
            expire_reason = "schedule removed" if sched is None else schedule_is_live(sched, local_now, mode=self._mode())
            if not expire_reason:
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
                self._store.append_history(make_history_entry(
                    sched or {"id": rec["schedule_id"], "name": "?", "device_type": ""},
                    kind="block", action_id=rec.get("action_id") or "?",
                    entity_id=ent, outcome="error",
                    error=f"Offline recall expired: {expire_reason}",
                ))
                continue
            # Still offline (flap, or tick sweep): stays armed without
            # consuming attempts.
            state = self._hass.states.get(ent)
            if state is None or state.state in ("unavailable", "unknown"):
                continue
            # The per-block device subset may have been narrowed meanwhile.
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
                self._store.append_history(make_history_entry(
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
        """Re-dispatch the CURRENT block's action (not the armed snapshot:
        if the user edited values meanwhile, the current version wins) to
        the single entity that came back online."""
        device_type = sched.get("device_type", "")
        action = block.get("action", {}) or {}
        action_id = action.get("id")
        action_def = next(
            (a for a in ACTIONS_BY_TYPE.get(device_type, []) if a["id"] == action_id),
            None,
        )
        if not action_def or not action_def.get("service"):
            return True  # not dispatchable: close the recall without errors
        domain, _, service = action_def["service"].partition(".")
        service_data = self._build_service_data(device_type, action_id, action, entity_id)
        try:
            child_ctx = fire_with_context(self._hass, EVENT_BLOCK_EXECUTED, {
                "device_id": None,
                "entity_id": entity_id,
                "action_id": action_id,
                "value": action.get("value"),
            }, sched)
            await self._hass.services.async_call(
                domain, service, service_data, blocking=False, context=child_ctx,
            )
            self._store.append_history(make_history_entry(
                sched, kind="block", action_id=action_id,
                entity_id=entity_id, value=action.get("value"),
            ))
            await log_to_logbook(
                self._hass, sched, action_id=action_id,
                entity_id=entity_id, extra="recall",
            )
            _LOGGER.info(
                "Chronos: RECALL dispatched %s.%s to %s (schedule=%s)",
                domain, service, entity_id, sched.get("name"),
            )
            # The block may declare auto-off: an entity recovered late
            # must still switch off after its minutes, with its own
            # individual timer (distinct key from the block-level one so
            # it can't cancel the other devices' timer).
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
