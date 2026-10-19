/** Canonical "end of day" value for time blocks, as a fractional hour.
 * 23 + 59/60 == 23:59. We never store 24:00 because <input type="time">
 * caps at 23:59 and a stored 24 would render inconsistently between the
 * native picker and our fmtHour-based labels (issue #7: the picker showed
 * 23:00 while the chip showed 24:00 for the same value). */
export const DAY_END_HOUR = 23 + 59 / 60;

export function fmtHour(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x));
}

let _snapMinutes = 15;
export function setSnapMinutes(m: number) {
  _snapMinutes = m && m > 0 ? m : 15;
}
export function snapToGrid(h: number, snapMinutes?: number): number {
  const m = snapMinutes ?? _snapMinutes;
  const factor = 60 / m;
  return Math.round(h * factor) / factor;
}

import { t } from "./i18n";
import type { Block, TimeAnchor } from "./types";

let _hassRef: any = null;
export function setHassRef(h: any) { _hassRef = h; }

/** Home Assistant's own time zone. Schedules run on the server's clock: a
 * block at 09:00 means 09:00 there, whatever the zone of the device showing
 * the card (issue #32). Undefined before hass is known. */
export function serverTimeZone(): string | undefined {
  const tz = _hassRef?.config?.time_zone;
  return typeof tz === "string" && tz ? tz : undefined;
}

export interface ClockParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** 0 = Monday, the backend's (Python's) convention. */
  weekday: number;
}

const _clockFormats = new Map<string, Intl.DateTimeFormat>();
const _weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Wall-clock parts of an instant on the server's clock. Falls back to the
 * device's clock when the zone is unknown or the browser cannot handle it. */
export function serverParts(d: Date = new Date()): ClockParts {
  const tz = serverTimeZone();
  if (tz) {
    try {
      let fmt = _clockFormats.get(tz);
      if (!fmt) {
        fmt = new Intl.DateTimeFormat("en-US", {
          timeZone: tz, hourCycle: "h23", weekday: "short",
          year: "numeric", month: "2-digit", day: "2-digit",
          hour: "2-digit", minute: "2-digit", second: "2-digit",
        });
        _clockFormats.set(tz, fmt);
      }
      const p: Record<string, string> = {};
      for (const part of fmt.formatToParts(d)) p[part.type] = part.value;
      return {
        year: +p.year, month: +p.month, day: +p.day,
        hour: +p.hour % 24, minute: +p.minute, second: +p.second,
        weekday: _weekdays.indexOf(p.weekday),
      };
    } catch {
      // Unknown zone name: fall through to the device's clock.
    }
  }
  return {
    year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate(),
    hour: d.getHours(), minute: d.getMinutes(), second: d.getSeconds(),
    weekday: (d.getDay() + 6) % 7,
  };
}

/** Hour of day as a float, on the server's clock. */
export function serverHour(d: Date = new Date()): number {
  const p = serverParts(d);
  return p.hour + p.minute / 60 + p.second / 3600;
}

/** True when the device's clock reads differently from the server's, which
 * is when the card says which clock it shows. */
export function zoneDiffers(now: Date = new Date()): boolean {
  const p = serverParts(now);
  return p.hour !== now.getHours() || p.minute !== now.getMinutes() || p.day !== now.getDate();
}

/** "New York" from "America/New_York", for the short clock label. */
export function zoneCity(): string {
  const tz = serverTimeZone() || "";
  return tz.split("/").pop()!.replace(/_/g, " ");
}

/** Resolve a block edge ("start" or "end") into an hour-of-day float, applying
 * sunrise/sunset anchor + offset if set. Falls back to the numeric value. */
export function resolveBlockTime(block: Block, edge: "start" | "end"): number {
  const anchor = (block as any)[`${edge}_anchor`] as TimeAnchor | undefined;
  const offset = ((block as any)[`${edge}_offset`] as number | undefined) ?? 0;
  if (anchor === "sunrise" || anchor === "sunset") {
    const sun = _hassRef?.states?.["sun.sun"];
    if (sun) {
      const attr = anchor === "sunrise" ? "next_rising" : "next_setting";
      const iso = sun.attributes?.[attr];
      if (iso) {
        const t = new Date(iso);
        if (!isNaN(t.getTime())) {
          // Sun times are instants: read them on the server's clock, as the
          // backend does, not on the device's.
          const base = serverHour(t);
          return clamp(base + offset / 60, 0, 24);
        }
      }
    }
  }
  const v = (block as any)[edge];
  return typeof v === "number" ? v : parseFloat(String(v ?? 0)) || 0;
}

export function getDays(): string[] {
  return [
    t("days.short.0"),
    t("days.short.1"),
    t("days.short.2"),
    t("days.short.3"),
    t("days.short.4"),
    t("days.short.5"),
    t("days.short.6"),
  ];
}

export const DEVICE_TYPES: Record<string, { label: string; domain: string; capabilities: string[] }> = {
  thermostat: { label: "Thermostat", domain: "climate", capabilities: ["set_temperature", "hvac_mode", "preset_mode"] },
  light: { label: "Light", domain: "light", capabilities: ["turn_on", "turn_off", "brightness", "color_temp"] },
  blind: { label: "Blind", domain: "cover", capabilities: ["open", "close", "set_position", "stop"] },
  irrigation: { label: "Irrigation", domain: "valve", capabilities: ["turn_on", "turn_off", "duration"] },
  plug: { label: "Smart plug", domain: "switch", capabilities: ["turn_on", "turn_off"] },
  fan: { label: "Fan", domain: "fan", capabilities: ["turn_on", "turn_off", "speed", "oscillate"] },
  boiler: { label: "Water heater", domain: "water_heater", capabilities: ["set_temperature", "operation_mode"] },
  mower: { label: "Mower", domain: "lawn_mower", capabilities: ["start_mowing", "pause", "dock"] },
  vacuum: { label: "Vacuum", domain: "vacuum", capabilities: ["start", "pause", "return_to_base", "fan_speed"] },
  scene: { label: "Scene", domain: "scene", capabilities: ["turn_on"] },
  automation: { label: "Automation", domain: "automation", capabilities: ["turn_on", "turn_off", "trigger"] },
  alarm: { label: "Alarm", domain: "alarm_control_panel", capabilities: ["arm_home", "arm_away", "arm_night", "arm_vacation", "disarm", "trigger"] },
  input_boolean: { label: "Boolean helper", domain: "input_boolean", capabilities: ["turn_on", "turn_off", "toggle"] },
  input_number: { label: "Number helper", domain: "input_number", capabilities: ["set_value"] },
  input_select: { label: "Select helper", domain: "input_select", capabilities: ["select_option"] },
  service: { label: "HA service", domain: "service", capabilities: ["call_service"] },
};

export function computeRepeat(days: number[]): string {
  if (!days || !days.length) return "";
  if (days.every(Boolean)) return t("schedule.every_day");
  const D = getDays();
  return days.map((d, i) => (d ? D[i] : null)).filter(Boolean).join(" · ");
}

/** The pause deadline of a schedule as a Date, or null when it is not
 * paused (unset, unparsable, or already behind us). */
export function pausedUntil(s: { paused_until?: string | null }, now: Date = new Date()): Date | null {
  if (!s.paused_until) return null;
  const d = new Date(s.paused_until);
  if (isNaN(d.getTime()) || d <= now) return null;
  return d;
}

/** "HH:MM" today, otherwise "DD/MM HH:MM", on the server's clock. */
export function fmtWhen(d: Date, now: Date = new Date()): string {
  const two = (n: number) => String(n).padStart(2, "0");
  const a = serverParts(d), b = serverParts(now);
  const time = `${two(a.hour)}:${two(a.minute)}`;
  const sameDay = a.year === b.year && a.month === b.month && a.day === b.day;
  return sameDay ? time : `${two(a.day)}/${two(a.month)} ${time}`;
}

/** Naive ISO of the next midnight on the server's clock: the backend reads a
 * naive value in Home Assistant's own zone, so "skip today" ends when the
 * server's day ends, not the device's. */
export function serverTomorrowMidnightIso(now: Date = new Date()): string {
  const two = (n: number) => String(n).padStart(2, "0");
  const p = serverParts(now);
  const next = new Date(Date.UTC(p.year, p.month - 1, p.day + 1));
  return `${next.getUTCFullYear()}-${two(next.getUTCMonth() + 1)}-${two(next.getUTCDate())}T00:00:00`;
}
