import type { ChronosDevice, DeviceType, Settings } from "./types";

export interface ColorStop {
  max: number;
  color: string;
}

export const DEFAULT_TEMP_STOPS_CLIMATE: ColorStop[] = [
  { max: 10, color: "#3b82f6" },
  { max: 15, color: "#06b6d4" },
  { max: 19, color: "#fbbf24" },
  { max: 23, color: "#10b981" },
  { max: 25, color: "#fbbf24" },
  { max: 999, color: "#ef4444" },
];

export const DEFAULT_TEMP_STOPS_BOILER: ColorStop[] = [
  { max: 35, color: "#3b82f6" },
  { max: 50, color: "#10b981" },
  { max: 60, color: "#fbbf24" },
  { max: 999, color: "#ef4444" },
];

export const DEFAULT_PRESET_COLORS: Record<string, string> = {
  eco: "#10b981",
  comfort: "#3b82f6",
  sleep: "#6366f1",
  away: "#9ca3af",
  boost: "#ef4444",
  home: "#06b6d4",
  none: "#9ca3af",
};

export function getStops(s: Settings | null, type: DeviceType): ColorStop[] {
  if (!s) return type === "boiler" ? DEFAULT_TEMP_STOPS_BOILER : DEFAULT_TEMP_STOPS_CLIMATE;
  const key = type === "boiler" ? "color_stops_boiler" : "color_stops_climate";
  const raw = (s as any)[key] as ColorStop[] | undefined;
  if (!raw || !raw.length) {
    return type === "boiler" ? DEFAULT_TEMP_STOPS_BOILER : DEFAULT_TEMP_STOPS_CLIMATE;
  }
  return [...raw].sort((a, b) => a.max - b.max);
}

export function getPresetColors(s: Settings | null): Record<string, string> {
  const fromSettings = (s as any)?.color_presets as Record<string, string> | undefined;
  return { ...DEFAULT_PRESET_COLORS, ...(fromSettings || {}) };
}

export function lightUseState(s: Settings | null): boolean {
  const v = (s as any)?.color_light_use_state;
  return v === undefined ? true : !!v;
}

function colorForTemp(temp: number, stops: ColorStop[]): string {
  const sorted = [...stops].sort((a, b) => a.max - b.max);
  for (const stop of sorted) {
    if (temp <= stop.max) return stop.color;
  }
  return sorted[sorted.length - 1]?.color || "#9ca3af";
}

export interface DeviceColor {
  /** Solid accent color, e.g. "#3b82f6" or "rgb(255, 200, 100)". */
  accent: string;
  /** Soft background tint derived from accent (semi-transparent). */
  soft: string;
  /** Whether to use as a "live" color (pulse, glow). */
  live: boolean;
}

const FALLBACK: DeviceColor = {
  accent: "var(--accent)",
  soft: "var(--accent-soft)",
  live: false,
};

export function getDeviceColor(
  device: ChronosDevice,
  haState: any,
  settings: Settings | null
): DeviceColor {
  if (!haState) return FALLBACK;
  const stateStr: string = haState.state || "";
  const attrs = haState.attributes || {};

  if (device.type === "light") {
    const off = stateStr === "off" || stateStr === "unavailable";
    if (off) {
      return { accent: "var(--text-muted)", soft: "var(--bg-sunken)", live: false };
    }
    if (lightUseState(settings)) {
      const rgb = attrs.rgb_color;
      if (Array.isArray(rgb) && rgb.length === 3) {
        const css = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        return { accent: css, soft: `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.18)`, live: true };
      }
    }
    return { accent: "#fbbf24", soft: "rgba(251, 191, 36, 0.18)", live: true };
  }

  if (device.type === "thermostat" || device.type === "boiler") {
    const presetColors = getPresetColors(settings);
    const preset = attrs.preset_mode;
    if (preset && presetColors[preset] && stateStr !== "off") {
      const c = presetColors[preset];
      return { accent: c, soft: hexToSoft(c), live: true };
    }
    const temp = numericTemp(attrs);
    if (typeof temp === "number") {
      const stops = getStops(settings, device.type);
      const c = colorForTemp(temp, stops);
      return { accent: c, soft: hexToSoft(c), live: true };
    }
    return FALLBACK;
  }

  if (device.type === "blind") {
    const pos = attrs.current_position;
    if (typeof pos === "number") {
      const t = pos / 100;
      const r = Math.round(60 + (200 - 60) * t);
      const g = Math.round(80 + (180 - 80) * t);
      const b = Math.round(120 + (255 - 120) * t);
      const c = `rgb(${r}, ${g}, ${b})`;
      return { accent: c, soft: `rgba(${r}, ${g}, ${b}, 0.18)`, live: true };
    }
  }

  if (device.type === "fan") {
    const speed = attrs.percentage;
    if (typeof speed === "number" && stateStr === "on") {
      const t = speed / 100;
      const c = mixHex("#06b6d4", "#3b82f6", t);
      return { accent: c, soft: hexToSoft(c), live: true };
    }
  }

  if (stateStr === "on" || stateStr === "open" || stateStr === "cleaning" || stateStr === "mowing") {
    return { accent: "#10b981", soft: "rgba(16, 185, 129, 0.18)", live: true };
  }
  if (stateStr === "off" || stateStr === "closed" || stateStr === "docked" || stateStr === "unavailable") {
    return { accent: "var(--text-muted)", soft: "var(--bg-sunken)", live: false };
  }

  return FALLBACK;
}

function numericTemp(attrs: any): number | undefined {
  const candidates = [attrs.current_temperature, attrs.temperature];
  for (const c of candidates) {
    if (typeof c === "number") return c;
    const n = parseFloat(c);
    if (!isNaN(n)) return n;
  }
  return undefined;
}

function hexToSoft(hex: string): string {
  if (!hex.startsWith("#")) return "var(--bg-sunken)";
  const h = hex.replace("#", "");
  const r = parseInt(h.length === 3 ? h[0] + h[0] : h.slice(0, 2), 16);
  const g = parseInt(h.length === 3 ? h[1] + h[1] : h.slice(2, 4), 16);
  const b = parseInt(h.length === 3 ? h[2] + h[2] : h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.18)`;
}

function mixHex(a: string, b: string, t: number): string {
  const ah = a.replace("#", "");
  const bh = b.replace("#", "");
  const ar = parseInt(ah.slice(0, 2), 16),
    ag = parseInt(ah.slice(2, 4), 16),
    ab = parseInt(ah.slice(4, 6), 16);
  const br = parseInt(bh.slice(0, 2), 16),
    bg = parseInt(bh.slice(2, 4), 16),
    bb = parseInt(bh.slice(4, 6), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bv = Math.round(ab + (bb - ab) * t);
  return `rgb(${r}, ${g}, ${bv})`;
}
