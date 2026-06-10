import type { ChronosDevice, Schedule, WeatherRule } from "./types";
import { DEVICE_TYPES } from "./utils";

/** Serialization helpers for moving schedules across Chronos instances
 * (export/import) and for in-place duplication.
 *
 * Chronos device ids are local to an instance, so exports replace them
 * with entity_id references; the importer re-links by entity_id against
 * the local device registry and reports what it could not match. */

export const EXPORT_FORMAT = 1;

export interface ImportResult {
  schedule: Schedule;
  /** Rules to recreate for the imported schedule, in legacy shape (with
   * block_index inline). The caller attaches them via the rules store
   * after the schedule save returns its new id. */
  rules: WeatherRule[];
  /** entity_ids referenced by the export but not imported on this instance. */
  missing: string[];
}

export function exportSchedule(
  s: Schedule,
  devices: ChronosDevice[],
  cardVersion: string,
  rules: WeatherRule[] = [],
): string {
  const byId = new Map(devices.map((d) => [d.id, d]));
  const refs = (s.device_ids || [])
    .map((id) => byId.get(id))
    .filter((d): d is ChronosDevice => !!d)
    .map((d) => ({ entity_id: d.entity_id, alias: d.alias, type: d.type }));
  const schedule = JSON.parse(JSON.stringify(s)) as any;
  delete schedule.id;
  schedule.device_ids = [];
  // Rules travel in the legacy embedded shape (block_index inline, no ids
  // or targets): it is instance-independent and keeps 1.15/1.16 exports
  // and 1.17+ exports mutually importable.
  schedule.weather_rules = rules.map((r) => {
    const copy: any = JSON.parse(JSON.stringify(r));
    delete copy.id;
    delete copy.targets;
    return copy;
  });
  // Block-level device subsets travel as entity_ids too.
  for (const b of schedule.blocks || []) {
    if (Array.isArray(b.device_ids) && b.device_ids.length) {
      const ents = b.device_ids
        .map((id: string) => byId.get(id)?.entity_id)
        .filter(Boolean);
      if (ents.length) b.device_entity_ids = ents;
    }
    delete b.device_ids;
  }
  const payload = {
    chronos_export: EXPORT_FORMAT,
    card_version: cardVersion,
    schedule,
    devices: refs,
  };
  return JSON.stringify(payload, null, 2);
}

/** Parse an export payload (or a bare schedule object) and re-link device
 * references against the local registry. Throws Error with a message key
 * (invalid_json / invalid_schedule / invalid_device_type) that the UI maps
 * to a translated string. */
export function importSchedule(json: string, devices: ChronosDevice[]): ImportResult {
  let payload: any;
  try {
    payload = JSON.parse(json);
  } catch {
    throw new Error("invalid_json");
  }
  const raw = payload && typeof payload === "object" && payload.chronos_export
    ? payload.schedule
    : payload;
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.blocks)) {
    throw new Error("invalid_schedule");
  }
  if (!DEVICE_TYPES[raw.device_type]) {
    throw new Error("invalid_device_type");
  }
  const blocks = raw.blocks.filter(
    (b: any) => b && typeof b === "object" && b.action && typeof b.action.id === "string",
  );
  if (!blocks.length) {
    throw new Error("invalid_schedule");
  }

  const byEntity = new Map(devices.map((d) => [d.entity_id, d]));
  const missing: string[] = [];
  const deviceIds: string[] = [];
  const refs: any[] = Array.isArray(payload?.devices) ? payload.devices : [];
  for (const ref of refs) {
    const ent = ref?.entity_id;
    if (!ent) continue;
    const local = byEntity.get(ent);
    if (local) deviceIds.push(local.id);
    else missing.push(ent);
  }

  const schedule: Schedule = {
    id: "",
    name: String(raw.name || "Imported schedule"),
    device_type: raw.device_type,
    device_ids: deviceIds,
    days: Array.isArray(raw.days) && raw.days.length === 7
      ? raw.days.map((x: any) => (x ? 1 : 0))
      : [1, 1, 1, 1, 1, 1, 1],
    // Imported disabled by design: the user reviews devices/rules first.
    enabled: false,
    blocks: blocks.map((b: any) => {
      const blk = JSON.parse(JSON.stringify(b));
      if (Array.isArray(blk.device_entity_ids)) {
        const ids = blk.device_entity_ids
          .map((e: string) => byEntity.get(e)?.id)
          .filter(Boolean);
        if (ids.length) blk.device_ids = ids;
        delete blk.device_entity_ids;
      }
      return blk;
    }),
    date_range: raw.date_range ?? null,
  };
  const rules: WeatherRule[] = Array.isArray(raw.weather_rules)
    ? raw.weather_rules.filter((r: any) => r && typeof r === "object" && r.effect)
    : [];
  return { schedule, rules, missing };
}

/** Legacy-shaped rule (block_index inline) → fresh v2 rule targeting one
 * schedule. Used after import/duplicate once the new schedule id exists. */
export function ruleForSchedule(rule: WeatherRule, scheduleId: string): WeatherRule {
  const copy: any = JSON.parse(JSON.stringify(rule));
  const blockIndex = typeof copy.block_index === "number" ? copy.block_index : null;
  delete copy.id;
  delete copy.block_index;
  copy.targets = [{ schedule_id: scheduleId, block_index: blockIndex }];
  return copy;
}

export function duplicateSchedule(
  src: Schedule,
  overrides: { name: string; device_ids: string[]; days: number[] },
): Schedule {
  const copy = JSON.parse(JSON.stringify(src)) as Schedule;
  copy.id = "";
  copy.name = overrides.name;
  copy.device_ids = [...overrides.device_ids];
  copy.days = [...overrides.days];
  // Created disabled so a half-configured copy can't fire mid-edit.
  copy.enabled = false;
  delete (copy as any).weather_rules;
  // Block-level subsets referencing devices dropped by the override would
  // dispatch to nothing; intersect and fall back to "all" when emptied.
  const allowed = new Set(copy.device_ids);
  for (const b of copy.blocks || []) {
    if (Array.isArray((b as any).device_ids)) {
      const kept = (b as any).device_ids.filter((id: string) => allowed.has(id));
      if (kept.length) (b as any).device_ids = kept;
      else delete (b as any).device_ids;
    }
  }
  return copy;
}
