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
          const base = t.getHours() + t.getMinutes() / 60 + t.getSeconds() / 3600;
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
  thermostat: { label: "Termostato", domain: "climate", capabilities: ["set_temperature", "hvac_mode", "preset_mode"] },
  light: { label: "Luce", domain: "light", capabilities: ["turn_on", "turn_off", "brightness", "color_temp"] },
  blind: { label: "Tapparella", domain: "cover", capabilities: ["open", "close", "set_position", "stop"] },
  irrigation: { label: "Irrigazione", domain: "valve", capabilities: ["turn_on", "turn_off", "duration"] },
  plug: { label: "Presa smart", domain: "switch", capabilities: ["turn_on", "turn_off"] },
  fan: { label: "Ventilatore", domain: "fan", capabilities: ["turn_on", "turn_off", "speed", "oscillate"] },
  boiler: { label: "Boiler", domain: "water_heater", capabilities: ["set_temperature", "operation_mode"] },
  mower: { label: "Tosaerba", domain: "lawn_mower", capabilities: ["start_mowing", "pause", "dock"] },
  vacuum: { label: "Robot aspirapolvere", domain: "vacuum", capabilities: ["start", "pause", "return_to_base", "fan_speed"] },
  scene: { label: "Scena", domain: "scene", capabilities: ["turn_on"] },
  automation: { label: "Automazione", domain: "automation", capabilities: ["turn_on", "turn_off", "trigger"] },
  alarm: { label: "Allarme", domain: "alarm_control_panel", capabilities: ["arm_home", "arm_away", "arm_night", "arm_vacation", "disarm", "trigger"] },
  input_boolean: { label: "Helper booleano", domain: "input_boolean", capabilities: ["turn_on", "turn_off", "toggle"] },
  input_number: { label: "Helper numerico", domain: "input_number", capabilities: ["set_value"] },
  input_select: { label: "Helper selettore", domain: "input_select", capabilities: ["select_option"] },
  service: { label: "Servizio HA", domain: "service", capabilities: ["call_service"] },
};

export function computeRepeat(days: number[]): string {
  if (!days || !days.length) return "";
  if (days.every(Boolean)) return t("schedule.every_day");
  const D = getDays();
  return days.map((d, i) => (d ? D[i] : null)).filter(Boolean).join(" · ");
}
