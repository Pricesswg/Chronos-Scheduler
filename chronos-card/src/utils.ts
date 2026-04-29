export function fmtHour(h: number): string {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x));
}

export function snapToGrid(h: number, snapMinutes = 15): number {
  const factor = 60 / snapMinutes;
  return Math.round(h * factor) / factor;
}

import { t } from "./i18n";

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
};

export function computeRepeat(days: number[]): string {
  if (!days || !days.length) return "";
  if (days.every(Boolean)) return t("schedule.every_day");
  const D = getDays();
  return days.map((d, i) => (d ? D[i] : null)).filter(Boolean).join(" · ");
}
