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

/** Default colors for action kinds (timeline blocks). Customizable per
 * setting `color_kind`. The CSS vars `--mode-*` are still defined in
 * styles.ts as a backstop for the very first render before settings load. */
export const DEFAULT_KIND_COLORS: Record<string, string> = {
  on: "#10b981",
  off: "#9ca3af",
  set: "#06b6d4",
  preset: "#6366f1",
  cmd: "#f59e0b",
};

/** Default {active, inactive} colors per device type with discrete on/off
 * state. Used by getSimpleColor when a setting override isn't present. */
export const DEFAULT_SIMPLE_COLORS: Record<string, { active: string; inactive: string }> = {
  plug:          { active: "#10b981", inactive: "#9ca3af" },
  mower:         { active: "#10b981", inactive: "#9ca3af" },
  vacuum:        { active: "#10b981", inactive: "#9ca3af" },
  irrigation:    { active: "#10b981", inactive: "#9ca3af" },
  alarm:         { active: "#10b981", inactive: "#9ca3af" },
  input_boolean: { active: "#10b981", inactive: "#9ca3af" },
  input_select:  { active: "#10b981", inactive: "#9ca3af" },
  input_number:  { active: "#10b981", inactive: "#9ca3af" },
};

/** Default gradient endpoints for device types with a continuous state. */
export const DEFAULT_RANGE_COLORS: Record<string, { start: string; end: string }> = {
  blind: { start: "#3c5078", end: "#c8b4ff" },
  fan:   { start: "#06b6d4", end: "#3b82f6" },
};

/** CSS-variable fallbacks for action kinds. Used when the user has NOT
 * picked a custom color for a given kind: this way HA themes that override
 * --mode-* tokens still influence Chronos's appearance, instead of being
 * shadowed by a frozen hex default. */
const KIND_CSS_FALLBACK: Record<string, string> = {
  on: "var(--mode-comfort)",
  off: "var(--mode-off)",
  set: "var(--mode-eco)",
  preset: "var(--mode-night)",
  cmd: "var(--mode-boost)",
};

/** Resolved color for a given action kind (on/off/set/preset/cmd). User
 * override in settings.color_kind wins; otherwise we hand back the CSS
 * variable so themes keep their say. */
export function getKindColor(kind: string, s: Settings | null): string {
  const fromSettings = (s as any)?.color_kind?.[kind];
  if (typeof fromSettings === "string" && fromSettings) return fromSettings;
  return KIND_CSS_FALLBACK[kind] || DEFAULT_KIND_COLORS[kind] || "#9ca3af";
}

/** Resolved {active, inactive} pair for a simple-state device type. */
export function getSimpleColors(deviceType: string, s: Settings | null): { active: string; inactive: string } {
  const fromSettings = (s as any)?.color_simple?.[deviceType];
  if (fromSettings && typeof fromSettings === "object" && fromSettings.active && fromSettings.inactive) {
    return fromSettings;
  }
  return DEFAULT_SIMPLE_COLORS[deviceType] || { active: "#10b981", inactive: "#9ca3af" };
}

/** Resolved {start, end} gradient pair for a range device type. */
export function getRangeColors(deviceType: string, s: Settings | null): { start: string; end: string } {
  const fromSettings = (s as any)?.color_range?.[deviceType];
  if (fromSettings && typeof fromSettings === "object" && fromSettings.start && fromSettings.end) {
    return fromSettings;
  }
  return DEFAULT_RANGE_COLORS[deviceType] || { start: "#3c5078", end: "#c8b4ff" };
}

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
      const range = getRangeColors("blind", settings);
      const c = mixAnyColor(range.start, range.end, pos / 100);
      return { accent: c, soft: hexToSoft(c), live: true };
    }
  }

  if (device.type === "fan") {
    const speed = attrs.percentage;
    if (typeof speed === "number" && stateStr === "on") {
      const range = getRangeColors("fan", settings);
      const c = mixAnyColor(range.start, range.end, speed / 100);
      return { accent: c, soft: hexToSoft(c), live: true };
    }
  }

  // Simple-state devices: pick the user-configured active/inactive colors
  // based on the entity's HA state. The active states list is intentionally
  // permissive (covers HA conventions across domains) so most users get
  // sensible coloring without per-domain tweaks.
  const ACTIVE_STATES = new Set(["on", "open", "cleaning", "mowing", "armed_home", "armed_away", "armed_night", "armed_vacation", "triggered"]);
  const INACTIVE_STATES = new Set(["off", "closed", "docked", "unavailable", "unknown", "disarmed", "idle"]);
  if (DEFAULT_SIMPLE_COLORS[device.type]) {
    const colors = getSimpleColors(device.type, settings);
    if (ACTIVE_STATES.has(stateStr) || (device.type === "input_number" && stateStr !== "" && stateStr !== "unavailable" && stateStr !== "unknown")) {
      return { accent: colors.active, soft: hexToSoft(colors.active), live: true };
    }
    if (INACTIVE_STATES.has(stateStr)) {
      return { accent: colors.inactive, soft: hexToSoft(colors.inactive), live: false };
    }
    // Unknown state: lean active to be visually informative.
    return { accent: colors.active, soft: hexToSoft(colors.active), live: false };
  }

  // Generic fallback for device types not in any of the buckets above.
  if (ACTIVE_STATES.has(stateStr)) {
    return { accent: "#10b981", soft: "rgba(16, 185, 129, 0.18)", live: true };
  }
  if (INACTIVE_STATES.has(stateStr)) {
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

/** Permissive color mixer: accepts both #HEX and rgb()/rgba() input strings.
 * Returns rgb(...). Defensive against malformed user-provided values; in
 * that case it falls back to the start color or grey. */
function mixAnyColor(a: string, b: string, t: number): string {
  const parse = (c: string): [number, number, number] | null => {
    if (!c) return null;
    if (c.startsWith("#")) {
      const h = c.replace("#", "");
      if (h.length === 3) {
        return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
      }
      if (h.length === 6) {
        return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
      }
      return null;
    }
    const m = c.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    if (m) return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
    return null;
  };
  const A = parse(a) || [60, 80, 120];
  const B = parse(b) || [200, 180, 255];
  const tt = Math.max(0, Math.min(1, t));
  const r = Math.round(A[0] + (B[0] - A[0]) * tt);
  const g = Math.round(A[1] + (B[1] - A[1]) * tt);
  const bv = Math.round(A[2] + (B[2] - A[2]) * tt);
  return `rgb(${r}, ${g}, ${bv})`;
}
