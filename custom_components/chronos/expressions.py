"""Rule grammar: parse `variable OP value` clauses, split AND chains, and the
threshold logic of hold rules. No Home Assistant here."""
from __future__ import annotations

import operator
import re


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




def parse_expression(expr: str) -> tuple[str, str, str] | None:
    m = _RULE_RE.match(expr.strip())
    if m:
        return m.group(1), m.group(2), m.group(3)
    m = _RULE_ENUM_RE.match(expr.strip())
    if m:
        return m.group(1), m.group(2), m.group(3)
    return None




_AND_SPLIT = re.compile(r"\s+AND\s+", re.IGNORECASE)




def hold_candidate(value: float, on_th: float, off_th: float) -> bool | None:
    """Decide what a "hold on threshold" rule wants, given the measurement.

    True = engage, False = release, None = inside the deadband, so whatever
    the rule is doing now must be left alone (this is what stops a value
    hovering on the threshold from switching a light on and off endlessly).

    The direction is implied by the two thresholds instead of a separate
    field: on_th below off_th reads as "engage under on_th, release over
    off_th" (lights while it is dark), on_th above off_th as "engage over
    on_th, release under off_th" (a fan while it is hot). Both thresholds
    are inclusive so a value sitting exactly on one still acts.
    """
    if on_th < off_th:
        if value <= on_th:
            return True
        return False if value >= off_th else None
    if value >= on_th:
        return True
    return False if value <= off_th else None




def split_and(expr: str) -> list[str]:
    """Split a compound IF expression on ' AND ' (case-insensitive). The
    delimiter requires whitespace on both sides so it cannot accidentally
    chop substrings inside entity_ids or attribute names."""
    if not expr:
        return []
    return [p.strip() for p in _AND_SPLIT.split(expr) if p.strip()]
