"""Per-day deterministic randomness: the random shift of a block and the
presence-simulation plan. Both derive from a hash of (schedule, block,
date) so they are stable all day, need no storage and survive a restart."""
from __future__ import annotations

import hashlib


def jitter_minutes(sched_id: str, block_idx: int, day_iso: str, jitter_min: float) -> float:
    """Random-looking but STABLE offset for a block, in minutes.

    Derived from a hash of (schedule, block, day), never from a random
    generator: the offset must be identical for every tick of the same day,
    otherwise the block would jump around and re-fire continuously. It
    changes on its own at midnight, and needs nothing stored anywhere.

    Result is in [-jitter_min, +jitter_min]; both edges get the same shift,
    so the block moves without changing length.
    """
    if jitter_min <= 0:
        return 0.0
    digest = hashlib.sha256(f"{sched_id}:{block_idx}:{day_iso}".encode()).digest()
    frac = int.from_bytes(digest[:4], "big") / 2 ** 32
    return round((frac * 2 - 1) * jitter_min, 1)




def presence_plan(
    seed: str,
    start_h: float,
    end_h: float,
    cycles: int,
    min_min: float,
    max_min: float,
    device_count: int,
) -> list[dict]:
    """Today's presence-simulation plan for one block: when to switch on,
    for how long, and on which of the block's devices.

    Built from a hash of the seed (schedule, block, date), never from a
    random generator, for the same reason as the jitter: every tick of the
    day must rebuild the identical plan, and a restart at 19:00 must resume
    the evening exactly where it was. Nothing is stored anywhere.

    The window is cut into as many equal slots as there are cycles and one
    activation is placed inside each slot, so activations can never overlap
    and are spread over the whole window instead of clumping. The user owns
    the ceiling (how many, how long); the spread is ours.
    """
    window_min = (end_h - start_h) * 60
    if window_min <= 0 or cycles <= 0:
        return []
    lo = max(1.0, min(min_min, max_min))
    hi = max(lo, max(min_min, max_min))
    # Never promise more activations than the window can hold.
    cycles = max(1, min(int(cycles), 12, int(window_min // lo) or 1))
    slot = window_min / cycles

    plan: list[dict] = []
    for i in range(cycles):
        digest = hashlib.sha256(f"{seed}:{i}".encode()).digest()
        r_dur = int.from_bytes(digest[0:4], "big") / 2 ** 32
        r_pos = int.from_bytes(digest[4:8], "big") / 2 ** 32
        r_dev = int.from_bytes(digest[8:12], "big") / 2 ** 32

        duration = min(lo + r_dur * (hi - lo), slot)
        offset = r_pos * max(0.0, slot - duration)
        begin = start_h + (i * slot + offset) / 60
        plan.append({
            "start": round(begin, 4),
            "end": round(min(end_h, begin + duration / 60), 4),
            "device": int(r_dev * device_count) if device_count > 0 else 0,
        })
    return plan
