"""The one place that decides whether a schedule may act right now.

Every path that turns a schedule into a service call (the tick, the offline
recall, on-demand scenes, the fire_now service) asks schedule_is_live first.
Issue #23 came from this check being copied into each path by hand and one
path forgetting it; nothing may bypass it again."""
from __future__ import annotations

from datetime import datetime, timedelta


def pause_deadline(sched: dict | None) -> datetime | None:
    """The instant a pause ends, or None when the schedule is not paused.
    Stored as ISO text on the schedule (`paused_until`); garbage reads as
    not paused rather than as paused forever."""
    raw = sched.get("paused_until") if sched else None
    if not raw:
        return None
    try:
        return datetime.fromisoformat(str(raw))
    except (TypeError, ValueError):
        return None


def is_paused(sched: dict | None, local_now) -> bool:
    until = pause_deadline(sched)
    if until is None:
        return False
    # Wall-clock comparison when only one side carries a time zone: the
    # tick passes aware local time, tests and status helpers may not.
    if (until.tzinfo is None) != (local_now.tzinfo is None):
        until = until.replace(tzinfo=None)
        local_now = local_now.replace(tzinfo=None)
    return local_now < until


def skip_today_deadline(local_now) -> datetime:
    """Midnight at the start of tomorrow, in local_now's own time zone: the
    deadline behind "skip today"."""
    return (local_now + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)


def is_in_date_range(sched: dict, today_local) -> bool:
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


def schedule_runs_in_mode(sched: dict | None, mode: str | None) -> bool:
    """A schedule with a non-empty `modes` list only runs in those modes;
    no list, or an empty one, means every mode. No mode given = no check."""
    if not mode or not sched:
        return True
    modes = sched.get("modes") or []
    return not modes or mode in modes


def schedule_is_live(sched: dict | None, local_now, mode: str | None = None) -> str | None:
    """Return None when the schedule may act at local_now (in `mode`, when
    given), else the reason it may not, worded for History entries and
    service errors."""
    if not sched or not sched.get("enabled"):
        return "schedule disabled"
    if is_paused(sched, local_now):
        until = pause_deadline(sched)
        return f"paused until {until:%Y-%m-%d %H:%M}"
    if not schedule_runs_in_mode(sched, mode):
        return f"not active in mode {mode}"
    days = sched.get("days", [0] * 7)
    weekday = local_now.weekday()
    if weekday < len(days) and not days[weekday]:
        return "not scheduled today"
    if not is_in_date_range(sched, local_now):
        return "outside the schedule's date range"
    return None
