"""Turning a block into service calls: skip rules, per-device-type
dispatch, end-of-block actions, auto-off, notifications."""
from __future__ import annotations

import asyncio
import json
import logging
from typing import Any

from homeassistant.core import Context
from homeassistant.exceptions import ServiceNotFound
from homeassistant.util import dt as dt_util

from .const import AUTO_OFF_SERVICE, EVENT_BLOCK_EXECUTED, EVENT_COMMAND_ERROR, EVENT_RULE_TRIGGERED
from .events import fire_with_context, get_action_def, log_to_logbook, make_history_entry

_LOGGER = logging.getLogger(__name__)



class DispatchMixin:
    """Methods of ChronosScheduler that live here for readability. They run
    on the scheduler instance and use its attributes (_hass, _store, the
    per-feature state dicts set up in ChronosScheduler.__init__)."""

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
                    f"Block skipped by weather rule: {rule.get('if', '')}",
                    title=f"Chronos · {sched_name}",
                )
            return

        await self._dispatch_action(sched, block)


    async def _apply_block_end(self, sched: dict, block: dict) -> None:
        """Send a block's end action, when the block asked to act on both of
        its edges and nothing took over.

        Until this existed a "turn on" block only ever sent the turn-on: the
        device stayed on until some other block touched it, which is what
        discussion #11 and issue #21 both ran into. The end action is NOT
        hardcoded to an off: the sensible end state depends on the device, so
        the block carries whichever action the user picked.

        Not fired when another block starts at the same moment — that block's
        own action defines the state, and an extra off in between would just
        make the device flicker. Also not fired right after a restart, since
        the previous block is unknown then: acting on a guess would be worse
        than waiting for the next real transition.
        """
        action = block.get("action") or {}
        if action.get("trigger") != "both":
            return
        end_action = action.get("end_action") or {}
        action_id = end_action.get("id")
        if not action_id:
            return
        device_type = sched.get("device_type", "")
        action_def = get_action_def(device_type, action_id)
        if not action_def:
            _LOGGER.warning(
                "Chronos: END-OF-BLOCK schedule=%s has no action def for %s.%s",
                sched.get("name", "?"), device_type, action_id,
            )
            return

        _LOGGER.info(
            "Chronos: END-OF-BLOCK schedule=%s → action=%s val=%s",
            sched.get("name", "?"), action_id, end_action.get("value"),
        )

        # An off-type end action goes through the same per-entity path as the
        # auto-off timer, so a device that is offline right now gets its
        # off-recall armed (and a truthful History entry) instead of a bare
        # failure. Everything else is a normal dispatch.
        if action_def.get("kind") == "off" and action_def.get("service"):
            sched_ids = sched.get("device_ids", []) or []
            subset = block.get("device_ids")
            if isinstance(subset, list) and subset:
                allowed = set(sched_ids)
                device_ids = [d for d in subset if d in allowed]
            else:
                device_ids = list(sched_ids)
            sent = False
            for device_id in device_ids:
                device = self._store.get_device(device_id)
                if not device:
                    continue
                if await self._off_or_arm(
                    sched, device["entity_id"], action_def["service"], action_id
                ):
                    sent = True
                    self._store.append_history(make_history_entry(
                        sched, kind="block", action_id=action_id,
                        entity_id=device["entity_id"], value=end_action.get("value"),
                    ))
            if not sent:
                _LOGGER.debug(
                    "Chronos: END-OF-BLOCK schedule=%s reached no device",
                    sched.get("name", "?"),
                )
            return

        # Reuse the dispatcher with a synthetic block, the same way triggers
        # do. The device subset is carried over so the end action lands on
        # exactly the devices the block itself acted on.
        synthetic = {
            "start": 0,
            "end": 0,
            "action": dict(end_action),
        }
        if isinstance(block.get("device_ids"), list) and block["device_ids"]:
            synthetic["device_ids"] = list(block["device_ids"])
        await self._dispatch_action(sched, synthetic)


    async def _dispatch_action(self, sched: dict, block: dict) -> None:
        """Internal: execute the block's action on all schedule devices.

        Refactored out of _apply_block so that triggers and fire_now can
        reuse it without re-running the block's own weather rules.
        """
        sched_name = sched.get("name", "")
        device_type = sched.get("device_type", "")
        action = block.get("action", {})
        action_id = action.get("id", "")
        action_def = get_action_def(device_type, action_id)
        if not action_def:
            _LOGGER.warning(
                "Chronos: NO action def for device_type=%s action_id=%s schedule=%s",
                device_type, action_id, sched_name,
            )
            return

        # Presence simulation owns its devices: the block must NOT fire its
        # action across every device when the window opens, or the whole
        # house would light up at 18:00 and the simulation would be pointless.
        # _evaluate_presence sends the same action per device at its own
        # times (and strips the mode, so those dispatches land here normally).
        if action.get("mode") == "presence":
            return

        # A new block dispatch supersedes any on-demand scene watcher this
        # schedule had armed for the previous block. Clear it before doing
        # anything else; the scene branch below re-arms if the new block is
        # itself an on-demand scene block.
        if str(sched.get("id")) in self._pending_scenes:
            self._pending_scenes.pop(str(sched.get("id")), None)
            self._refresh_scene_watch()

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
                self._store.append_history(make_history_entry(
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
                child_ctx = fire_with_context(self._hass, EVENT_BLOCK_EXECUTED, {
                    "device_id": None,
                    "entity_id": f"{svc_domain}.{svc_name}",
                    "action_id": action_id,
                    "value": raw_service,
                }, sched)
                await self._hass.services.async_call(
                    svc_domain, svc_name, service_data, blocking=False, context=child_ctx,
                )
                self._store.append_history(make_history_entry(
                    sched, kind="block", action_id=action_id,
                    entity_id=f"{svc_domain}.{svc_name}", value=raw_service,
                ))
                # Logbook entry tagged with the service path so HA's
                # entity-filter search shows the Chronos attribution.
                await log_to_logbook(
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
                self._store.append_history(make_history_entry(
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
            # On-demand scene: do NOT activate the scene now (that would turn
            # on the lights it controls). Instead arm a watcher so the scene
            # applies only when one of its member entities is switched on
            # during the block window, or immediately for members already on.
            # See _arm_scene_ondemand.
            if device_type == "scene" and action.get("mode") == "on_demand":
                await self._arm_scene_ondemand(sched, entity_ids)
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
                        child_ctx = fire_with_context(self._hass, EVENT_BLOCK_EXECUTED, {
                            "device_id": None,
                            "entity_id": ent,
                            "action_id": action_id,
                            "value": ent,
                        }, sched)
                        await self._hass.services.async_call(
                            domain, service, {"entity_id": ent}, blocking=False, context=child_ctx,
                        )
                        executed.append(ent)
                        self._store.append_history(make_history_entry(
                            sched, kind="block", action_id=action_id,
                            entity_id=ent,
                        ))
                        await log_to_logbook(
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
                    self._store.append_history(make_history_entry(
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

            # Device offline at dispatch: the service call would NOT fail
            # (HA accepts it and nothing happens), so before this check
            # History recorded a false "ok". Now the entry tells the truth
            # and, when the recall is enabled, the action is retried once
            # the entity comes back online (block window permitting).
            # Irrigation is excluded from the block recall: re-opening a
            # valve late outside its timed runner is a hazard, not a
            # courtesy.
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
                # With a recall armed this is a WARNING, not a failure: the
                # action is pending, not lost. It only turns red later, in
                # the final entry, if the recall expires or gives up.
                self._store.append_history(make_history_entry(
                    sched, kind="block", action_id=action_id,
                    entity_id=device["entity_id"], value=action.get("value"),
                    outcome="warning" if armed else "error",
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
                child_ctx = fire_with_context(self._hass, EVENT_BLOCK_EXECUTED, {
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
                self._store.append_history(make_history_entry(
                    sched, kind="block", action_id=action_id,
                    entity_id=device["entity_id"], value=value,
                ))
                value_str = ""
                if value not in (None, ""):
                    value_str = f"value={value}"
                await log_to_logbook(
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
                self._store.append_history(make_history_entry(
                    sched, kind="block", action_id=action_id,
                    entity_id=device["entity_id"], value=value,
                    outcome="error", error=f"{type(ex).__name__}: {str(ex)[:200]}",
                ))
                if self._store.settings.get("notify_command_error"):
                    await self._notify(
                        f"Command error: {domain}.{service} on {device['entity_id']}",
                        title="Chronos · Error",
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

        # Auto-off timer: when the turn_on block asks for automatic
        # switch-off after N minutes and at least one device was switched
        # on, spawn the timer. A re-dispatch of the same block (fire_now,
        # re-trigger) restarts from zero: the previous timer is cancelled
        # and replaced, consistent with "I just switched it back on".
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
                    # Replacement, not shutdown: the old task must NOT
                    # switch off the freshly re-lit devices nor clean up
                    # the new task's store entry. The marker lives on the
                    # Task.
                    setattr(existing, "_chronos_replaced", True)
                    existing.cancel()
                task = self._hass.async_create_task(
                    self._run_auto_off(
                        sched, seq_key, list(executed_entities),
                        auto_off_min, AUTO_OFF_SERVICE[device_type],
                    )
                )
                self._sequence_tasks[seq_key] = task


    def _build_service_data(
        self, device_type: str, action_id: str, action: dict, entity_id: str
    ) -> dict[str, Any]:
        """Map the block's value (and extras) to the HA service payload.
        Extracted from the dispatch loop because the offline recall must
        rebuild the exact same payload for a single entity."""
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


    async def _run_auto_off(
        self,
        sched: dict,
        seq_key: str,
        entity_ids: list[str],
        minutes: float,
        off_service: str,
    ) -> None:
        """Auto-off timer for turn_on blocks (lights, plugs, fans,
        climate): the turn-on was already sent by the normal dispatch
        (with brightness/extras/...); here we wait `minutes` and switch
        off. Same safety contract as timed irrigation: the in-flight set
        persists in the sequences store with its own off_service, so a
        restart mid-timer switches the devices off at the next startup,
        and cancellation (HA stopping) switches them off immediately."""
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
            # Returns only the entities the command actually reached:
            # offline ones are armed as off-recalls by _off_or_arm (which
            # also writes the error entry in History) and must NOT show
            # up as "executed".
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
                self._store.append_history(make_history_entry(
                    sched, kind="block", action_id="auto_off",
                    entity_id=ent, value=f"{minutes:g}min",
                ))
                await log_to_logbook(
                    self._hass, sched, action_id="auto_off",
                    entity_id=ent, extra=f"{minutes:g}min",
                )
            _LOGGER.info("Chronos: DONE auto-off schedule=%s", sched_name)
        except asyncio.CancelledError:
            # The marker travels on the Task itself (set by the dispatch
            # replacing us): no shared state to clean up, and if the
            # cancellation catches us before the try, the flag dies with us.
            replaced = bool(getattr(asyncio.current_task(), "_chronos_replaced", False))
            if not replaced:
                # HA stopping mid-timer: switch off now. The startup
                # recovery sweeps again via the store as a safety net.
                await _switch_off()
            # Replacement: the block was re-dispatched, the devices were
            # just switched back on and the new timer is already running.
            # Touch nothing.
            raise
        finally:
            if not replaced:
                await self._settle_sequence_entry(sched, seq_key, entity_ids, off_service)
                # The new task may already be registered under the same
                # key: only remove the entry if it is still ours.
                if self._sequence_tasks.get(seq_key) is asyncio.current_task():
                    self._sequence_tasks.pop(seq_key, None)
            try:
                await self._store.flush_history()
            except Exception:
                _LOGGER.exception("Chronos: history flush failed after auto-off")


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
