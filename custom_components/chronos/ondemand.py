"""Scenes: direct activation and on-demand blocks, which arm a scene and
fire it when a member entity is switched on by hand during the block."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.helpers.event import async_track_state_change_event
from homeassistant.util import dt as dt_util

from .const import EVENT_BLOCK_EXECUTED
from .events import fire_with_context, log_to_logbook, make_history_entry
from .gate import schedule_is_live

_LOGGER = logging.getLogger(__name__)



class OnDemandMixin:
    """Methods of ChronosScheduler that live here for readability. They run
    on the scheduler instance and use its attributes (_hass, _store, the
    per-feature state dicts set up in ChronosScheduler.__init__)."""

    # --- On-demand scenes -------------------------------------------------
    # A scene block with action.mode == "on_demand" does NOT activate the
    # scene at block start (that would switch on every light the scene
    # controls). Instead the scene is applied only when one of its member
    # entities is turned on during the block window (manually, by another
    # automation, ...), or immediately for members that are already on. So
    # the ambience is applied to whatever is on, without turning anything
    # on by itself. In-memory registry keyed by schedule id; the catch-up
    # tick re-arms after a restart.

    def _scene_members(self, scene_entity: str) -> list[str]:
        """Entities controlled by a scene, from its `entity_id` attribute."""
        st = self._hass.states.get(scene_entity)
        if st is None:
            return []
        ents = st.attributes.get("entity_id") or []
        if isinstance(ents, str):
            ents = [ents]
        return [str(e) for e in ents]


    def _is_on(self, entity_id: str) -> bool:
        st = self._hass.states.get(entity_id)
        return st is not None and st.state == "on"


    async def _arm_scene_ondemand(self, sched: dict, scene_entity_ids: list[str]) -> None:
        scenes: list[dict[str, Any]] = []
        for sc in scene_entity_ids:
            scenes.append({"scene": sc, "members": self._scene_members(sc)})
        key = str(sched.get("id"))
        self._pending_scenes[key] = {
            "schedule_id": key,
            "schedule_name": sched.get("name", "?"),
            "scenes": scenes,
            # Monotonic ts of our last scene application, for echo
            # suppression (applying a scene can turn a member on, which
            # would re-trigger the watcher).
            "last_fire": 0.0,
        }
        self._refresh_scene_watch()
        _LOGGER.info(
            "Chronos: armed on-demand scene(s) %s for schedule=%s",
            [s["scene"] for s in scenes], sched.get("name"),
        )
        # Members already on at block start get the scene right away: the
        # user's intent is "apply the ambience to whatever is on", and this
        # never turns on anything that is off.
        to_fire = [e for e in scenes if any(self._is_on(m) for m in e["members"])]
        if to_fire:
            # Set the echo-suppression timestamp BEFORE applying: _apply_scene
            # awaits, and the member-on events the scene itself causes could
            # otherwise slip back into the watcher before we mark the window.
            self._pending_scenes[key]["last_fire"] = self._hass.loop.time()
            for entry in to_fire:
                await self._apply_scene(sched, entry["scene"])
            try:
                await self._store.flush_history()
            except Exception:
                _LOGGER.exception("Chronos: history flush failed after on-demand arm")


    def _refresh_scene_watch(self) -> None:
        """(Re)subscribe the state listener to the union of member entities
        of all armed on-demand scenes. Zero armed = zero listeners."""
        if self._unsub_scene_watch:
            self._unsub_scene_watch()
            self._unsub_scene_watch = None
        ents: set[str] = set()
        for p in self._pending_scenes.values():
            for entry in p["scenes"]:
                ents.update(entry["members"])
        if not ents:
            return
        self._unsub_scene_watch = async_track_state_change_event(
            self._hass, sorted(ents), self._on_scene_member_change
        )


    async def _on_scene_member_change(self, event) -> None:
        new_state = event.data.get("new_state")
        old_state = event.data.get("old_state")
        # Only an off/away → on transition applies the scene. An on → on
        # change (e.g. brightness) or a turn-off must not.
        if new_state is None or new_state.state != "on":
            return
        if old_state is not None and old_state.state == "on":
            return
        await self._fire_ondemand_for_member(event.data.get("entity_id"))


    async def _fire_ondemand_for_member(self, entity_id: str | None) -> None:
        if not entity_id or not self._pending_scenes:
            return
        dirty = False
        for key, pending in list(self._pending_scenes.items()):
            matched = [e for e in pending["scenes"] if entity_id in e["members"]]
            if not matched:
                continue
            sched = self._store.get_schedule(pending["schedule_id"])
            block = self._ondemand_active_block(sched) if sched else None
            if block is None:
                # Window ended, schedule disabled/removed, or the active
                # block is no longer an on-demand scene: disarm.
                self._pending_scenes.pop(key, None)
                self._refresh_scene_watch()
                continue
            # Echo suppression: skip transitions our own scene application
            # just caused (a scene that turns a member on re-enters here).
            if self._hass.loop.time() - pending.get("last_fire", 0.0) < 2.0:
                continue
            # Mark BEFORE applying: the scene's own member-on events must
            # find the suppression window already open (see _arm note).
            pending["last_fire"] = self._hass.loop.time()
            for entry in matched:
                await self._apply_scene(sched, entry["scene"])
            dirty = True
        if dirty:
            try:
                await self._store.flush_history()
            except Exception:
                _LOGGER.exception("Chronos: history flush failed after on-demand fire")


    def _ondemand_active_block(self, sched: dict) -> dict | None:
        """Return the currently active block IFF it is the schedule's
        on-demand scene block, else None. Same validity gates as the tick
        (enabled, day mask, date range, active window)."""
        local_now = dt_util.now()
        if schedule_is_live(sched, local_now):
            return None
        current_hour = local_now.hour + local_now.minute / 60
        block, _idx = self._block_at(self._effective_blocks(sched), current_hour)
        if block is None:
            return None
        action = block.get("action") or {}
        if action.get("id") != "activate" or action.get("mode") != "on_demand":
            return None
        return block


    def _sweep_pending_scenes(self) -> None:
        """Disarm on-demand scenes whose block is no longer active. Called
        each tick: a block that ends into an empty slot triggers no dispatch,
        so the tick is the only place that notices the window closed."""
        if not self._pending_scenes:
            return
        changed = False
        for key in list(self._pending_scenes.keys()):
            sched = self._store.get_schedule(key)
            if sched is None or self._ondemand_active_block(sched) is None:
                self._pending_scenes.pop(key, None)
                changed = True
        if changed:
            self._refresh_scene_watch()


    async def _apply_scene(self, sched: dict, scene_entity: str) -> None:
        try:
            child_ctx = fire_with_context(self._hass, EVENT_BLOCK_EXECUTED, {
                "device_id": None,
                "entity_id": scene_entity,
                "action_id": "activate",
                "value": scene_entity,
            }, sched)
            await self._hass.services.async_call(
                "scene", "turn_on", {"entity_id": scene_entity},
                blocking=False, context=child_ctx,
            )
            self._store.append_history(make_history_entry(
                sched, kind="block", action_id="activate", entity_id=scene_entity,
            ))
            await log_to_logbook(
                self._hass, sched, action_id="activate",
                entity_id=scene_entity, extra="on-demand",
            )
            _LOGGER.info(
                "Chronos: applied on-demand scene %s (schedule=%s)",
                scene_entity, sched.get("name"),
            )
        except Exception:
            _LOGGER.exception("Chronos: on-demand scene apply failed for %s", scene_entity)
            self._store.append_history(make_history_entry(
                sched, kind="block", action_id="activate",
                entity_id=scene_entity, outcome="error",
                error="on-demand scene apply failed",
            ))
