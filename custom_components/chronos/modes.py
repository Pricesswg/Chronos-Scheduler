"""User-defined modes (discussion #28). Pure functions, no Home Assistant.

A mode is {"id", "name"}. The id is what schedules store in their `modes`
list and what `settings.mode` holds, so it never changes once created. The
name is the label; an empty name on a built-in id means the card shows its
translated default, and the select entity shows the id itself, exactly as
before modes became editable, so existing automations keep working.
"""
from __future__ import annotations

import re
from typing import Any

from .const import MAX_MODES, MODES

_ID_RE = re.compile(r"^[a-z0-9_]{1,32}$")


def default_modes() -> list[dict[str, str]]:
    return [{"id": m, "name": ""} for m in MODES]


def mode_list(settings: dict[str, Any] | None) -> list[dict[str, str]]:
    """The configured modes, normalised; the built-in three when the stored
    value is missing or unusable, so a broken setting never leaves the
    user without modes."""
    raw = (settings or {}).get("modes")
    if not isinstance(raw, list):
        return default_modes()
    out: list[dict[str, str]] = []
    for item in raw:
        if isinstance(item, dict) and _ID_RE.match(str(item.get("id", ""))):
            out.append({"id": str(item["id"]), "name": str(item.get("name") or "").strip()})
    return out or default_modes()


def mode_ids(settings: dict[str, Any] | None) -> list[str]:
    return [m["id"] for m in mode_list(settings)]


def mode_label(mode: dict[str, str]) -> str:
    return mode.get("name") or mode["id"]


def resolve_mode(settings: dict[str, Any] | None, value: Any) -> str | None:
    """Mode id for `value`, given as an id or as a label (case-insensitive),
    or None. Labels are what the select entity shows; ids are what older
    automations and the card send."""
    text = str(value or "").strip()
    if not text:
        return None
    modes = mode_list(settings)
    for m in modes:
        if m["id"] == text:
            return m["id"]
    folded = text.casefold()
    for m in modes:
        if mode_label(m).casefold() == folded:
            return m["id"]
    return None


def validate_modes(new_modes: Any, schedules: list[dict], current: str) -> str | None:
    """None when `new_modes` can replace the configured list, else the reason
    in English. A mode in use cannot disappear: a schedule restricted to it
    alone would silently become a schedule that runs in every mode."""
    if not isinstance(new_modes, list) or not new_modes:
        return "at least one mode is required"
    if len(new_modes) > MAX_MODES:
        return f"at most {MAX_MODES} modes"
    ids: list[str] = []
    labels: set[str] = set()
    for item in new_modes:
        if not isinstance(item, dict):
            return "each mode must be an object with id and name"
        mode_id = str(item.get("id", ""))
        if not _ID_RE.match(mode_id):
            return f"invalid mode id {mode_id!r}"
        if mode_id in ids:
            return f"duplicate mode id {mode_id!r}"
        label = (str(item.get("name") or "").strip() or mode_id).casefold()
        if label in labels:
            return f"two modes are both named {label!r}"
        ids.append(mode_id)
        labels.add(label)
    if current and current not in ids:
        return f"mode {current!r} is the current mode: switch to another one first"
    for mode_id in {m for s in schedules for m in (s.get("modes") or [])} - set(ids):
        users = [s.get("name", s.get("id", "?")) for s in schedules if mode_id in (s.get("modes") or [])]
        return f"mode {mode_id!r} is used by {', '.join(users)}: remove it from those schedules first"
    return None
