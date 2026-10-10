import type { Schedule } from "./types";

/** The three modes a schedule can run in. A schedule with no list runs in
 * all of them. Mirrors MODES in the backend's const.py. */
export const ALL_MODES = ["home", "away", "holiday"] as const;

export function effectiveModes(s: Pick<Schedule, "modes">): readonly string[] {
  const modes = (s.modes || []).filter(Boolean);
  return modes.length ? modes : ALL_MODES;
}

/** True when the two schedules can both be live in some mode. Two schedules
 * restricted to different modes never run together, so they cannot fight
 * over a device (issue #29). */
export function modesOverlap(a: Pick<Schedule, "modes">, b: Pick<Schedule, "modes">): boolean {
  const mine = effectiveModes(a);
  return effectiveModes(b).some((m) => mine.includes(m));
}
