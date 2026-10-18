import type { Schedule, Settings } from "./types";
import { t } from "./i18n";

/** A mode the user can switch to. Mirrors custom_components/chronos/modes.py:
 * the id is stable (schedules store it), the name is free. */
export interface ModeDef {
  id: string;
  name: string;
}

const BUILT_IN = ["home", "away", "holiday"];
export const MAX_MODES = 8;

/** The configured modes; the built-in three when nothing usable is stored. */
export function modeList(settings?: Partial<Settings> | null): ModeDef[] {
  const raw = settings?.modes;
  const out = Array.isArray(raw)
    ? raw
        .filter((m) => m && /^[a-z0-9_]{1,32}$/.test(String(m.id)))
        .map((m) => ({ id: String(m.id), name: String(m.name || "").trim() }))
    : [];
  return out.length ? out : BUILT_IN.map((id) => ({ id, name: "" }));
}

export function modeIds(settings?: Partial<Settings> | null): string[] {
  return modeList(settings).map((m) => m.id);
}

/** What the user reads: their name, else the translated built-in label. */
export function modeLabel(mode: ModeDef): string {
  if (mode.name) return mode.name;
  return BUILT_IN.includes(mode.id) ? t("mode." + mode.id) : mode.id;
}

/** The label the backend compares for uniqueness: name, else id. */
export function modeKey(mode: ModeDef): string {
  return (mode.name || mode.id).toLocaleLowerCase();
}

/** A new id from a name: lowercase ascii, underscores, unique. */
export function slugifyMode(name: string, taken: string[]): string {
  const base = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 24) || "mode";
  let id = base;
  for (let n = 2; taken.includes(id); n++) id = `${base}_${n}`;
  return id;
}

/** The modes a schedule runs in: its list, or every configured mode. */
export function effectiveModes(s: Pick<Schedule, "modes">, all: readonly string[]): readonly string[] {
  const modes = (s.modes || []).filter(Boolean);
  return modes.length ? modes : all;
}

/** True when the two schedules can both be live in some mode. Two schedules
 * restricted to different modes never run together, so they cannot fight
 * over a device (issue #29). */
export function modesOverlap(a: Pick<Schedule, "modes">, b: Pick<Schedule, "modes">, all: readonly string[]): boolean {
  const mine = effectiveModes(a, all);
  return effectiveModes(b, all).some((m) => mine.includes(m));
}
