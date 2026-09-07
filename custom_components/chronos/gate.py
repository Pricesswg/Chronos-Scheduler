"""The one place that decides whether a schedule may act right now.

Every path that turns a schedule into a service call (the tick, the offline
recall, on-demand scenes, the fire_now service) asks schedule_is_live first.
Issue #23 came from this check being copied into each path by hand and one
path forgetting it; nothing may bypass it again."""
from __future__ import annotations


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


def schedule_is_live(sched: dict | None, local_now) -> str | None:
    """Return None when the schedule may act at local_now, else the reason
    it may not, worded for History entries and service errors."""
    if not sched or not sched.get("enabled"):
        return "schedule disabled"
    days = sched.get("days", [0] * 7)
    weekday = local_now.weekday()
    if weekday < len(days) and not days[weekday]:
        return "not scheduled today"
    if not is_in_date_range(sched, local_now):
        return "outside the schedule's date range"
    return None
