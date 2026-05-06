import type { ActionDef, BlockAction, DeviceType, Settings } from "./types";
import { getStops, getPresetColors } from "./device-colors";
import { actionDefLabel } from "./i18n";

export const KIND_COLORS: Record<string, string> = {
  on: "var(--mode-comfort)",
  off: "var(--mode-off)",
  set: "var(--mode-eco)",
  preset: "var(--mode-night)",
  cmd: "var(--mode-boost)",
};

let _currentSettings: Settings | null = null;

export function setColorSettings(s: Settings | null) {
  _currentSettings = s;
}

function colorForTemp(temp: number, stops: { max: number; color: string }[]): string {
  const sorted = [...stops].sort((a, b) => a.max - b.max);
  for (const stop of sorted) {
    if (temp <= stop.max) return stop.color;
  }
  return sorted[sorted.length - 1]?.color || "var(--mode-comfort)";
}

const FALLBACK_ACTIONS: Record<string, ActionDef[]> = {
  thermostat: [
    { id: "set_temperature", label: "Imposta temperatura", kind: "set", service: "climate.set_temperature", value: { type: "number", unit: "°C", min: 5, max: 35, step: 0.5, default: 21 } },
    { id: "set_preset", label: "Preset", kind: "preset", service: "climate.set_preset_mode", value: { type: "enum", options: ["none", "eco", "comfort", "sleep", "away", "boost", "home"], default: "comfort" } },
    { id: "turn_off", label: "Spegni", kind: "off", service: "climate.turn_off" },
  ],
  boiler: [
    { id: "set_temperature", label: "Imposta temperatura", kind: "set", service: "water_heater.set_temperature", value: { type: "number", unit: "°C", min: 30, max: 75, step: 1, default: 55 } },
    { id: "set_operation", label: "Operation mode", kind: "preset", service: "water_heater.set_operation_mode", value: { type: "enum", options: ["off", "eco", "electric", "gas", "heat_pump", "high_demand", "performance"], default: "eco" } },
    { id: "turn_off", label: "Spegni", kind: "off", service: "water_heater.turn_off" },
  ],
  light: [
    {
      id: "turn_on", label: "Accendi", kind: "on", service: "light.turn_on",
      value: { type: "number", unit: "%", min: 1, max: 100, step: 1, default: 80, label: "Luminosità" },
      extras: [
        { key: "rgb_color", type: "color", label: "Colore RGB" },
        { key: "color_temp_kelvin", type: "number", label: "Temperatura colore", unit: "K", min: 2000, max: 6500, step: 100 },
        { key: "transition", type: "number", label: "Transizione", unit: "s", min: 0, max: 60, step: 1 },
      ],
    },
    { id: "turn_off", label: "Spegni", kind: "off", service: "light.turn_off" },
  ],
  scene: [
    {
      id: "activate", label: "Attiva scena", kind: "on", service: "scene.turn_on",
      value: { type: "entity", domain: "scene", label: "Scena", multi: true },
    },
  ],
  automation: [
    {
      id: "turn_on", label: "Attiva automazione", kind: "on", service: "automation.turn_on",
      value: { type: "entity", domain: "automation", label: "Automazione", multi: true },
    },
    {
      id: "turn_off", label: "Disattiva automazione", kind: "off", service: "automation.turn_off",
      value: { type: "entity", domain: "automation", label: "Automazione", multi: true },
    },
    {
      id: "trigger", label: "Trigger automazione", kind: "cmd", service: "automation.trigger",
      value: { type: "entity", domain: "automation", label: "Automazione", multi: true },
    },
  ],
  blind: [
    { id: "set_position", label: "Posiziona", kind: "set", service: "cover.set_cover_position", value: { type: "number", unit: "%", min: 0, max: 100, step: 5, default: 100, label: "Apertura" } },
    { id: "open_cover", label: "Apri", kind: "on", service: "cover.open_cover" },
    { id: "close_cover", label: "Chiudi", kind: "off", service: "cover.close_cover" },
  ],
  irrigation: [
    { id: "turn_on", label: "Avvia", kind: "on", service: "valve.open_valve", value: { type: "number", unit: "min", min: 1, max: 240, step: 1, default: 30, label: "Durata" } },
    { id: "turn_off", label: "Stop", kind: "off", service: "valve.close_valve" },
  ],
  plug: [
    { id: "turn_on", label: "Accendi", kind: "on", service: "switch.turn_on" },
    { id: "turn_off", label: "Spegni", kind: "off", service: "switch.turn_off" },
  ],
  fan: [
    { id: "turn_on", label: "Accendi", kind: "on", service: "fan.turn_on", value: { type: "number", unit: "%", min: 10, max: 100, step: 10, default: 50, label: "Velocità" } },
    { id: "turn_off", label: "Spegni", kind: "off", service: "fan.turn_off" },
  ],
  mower: [
    { id: "start_mowing", label: "Avvia taglio", kind: "on", service: "lawn_mower.start_mowing" },
    { id: "pause", label: "Pausa", kind: "cmd", service: "lawn_mower.pause" },
    { id: "dock", label: "Torna in base", kind: "off", service: "lawn_mower.dock" },
  ],
  vacuum: [
    { id: "start", label: "Avvia pulizia", kind: "on", service: "vacuum.start" },
    { id: "pause", label: "Pausa", kind: "cmd", service: "vacuum.pause" },
    { id: "return_to_base", label: "Torna in base", kind: "off", service: "vacuum.return_to_base" },
  ],
  alarm: [
    { id: "arm_home", label: "Inserisci (home)", kind: "on", service: "alarm_control_panel.alarm_arm_home" },
    { id: "arm_away", label: "Inserisci (away)", kind: "on", service: "alarm_control_panel.alarm_arm_away" },
    { id: "arm_night", label: "Inserisci (notte)", kind: "on", service: "alarm_control_panel.alarm_arm_night" },
    { id: "arm_vacation", label: "Inserisci (vacanza)", kind: "on", service: "alarm_control_panel.alarm_arm_vacation" },
    { id: "disarm", label: "Disinserisci", kind: "off", service: "alarm_control_panel.alarm_disarm" },
    { id: "trigger", label: "Attiva sirena", kind: "cmd", service: "alarm_control_panel.alarm_trigger" },
  ],
};

let _serverActions: Record<string, ActionDef[]> = {};

export function setActionsMap(map: Record<string, ActionDef[]>): void {
  _serverActions = map;
}

export function getActionsForType(type: DeviceType): ActionDef[] {
  const server = _serverActions[type];
  const fallback = FALLBACK_ACTIONS[type] || [];
  if (!server || !server.length) return fallback;
  // Merge each server action with its fallback counterpart. The fallback fills
  // in fields that an older backend version may not provide (e.g. `extras`),
  // while server data wins for everything it actually defines.
  return server.map((sAction) => {
    const fAction = fallback.find((f) => f.id === sAction.id);
    if (!fAction) return sAction;
    return {
      ...fAction,
      ...sAction,
      extras: sAction.extras || fAction.extras,
      value: sAction.value || fAction.value,
    };
  });
}

export function getActionDef(type: DeviceType, actionId: string): ActionDef | undefined {
  return getActionsForType(type).find((a) => a.id === actionId);
}

export function actionLabel(type: DeviceType, action?: BlockAction): string {
  if (!action) return "—";
  const def = getActionDef(type, action.id);
  if (!def) return action.id;
  // Resolve once: use the i18n translation when available, fall back to the
  // backend / FALLBACK_ACTIONS Italian label otherwise.
  const tLabel = actionDefLabel(type, action.id, def.label);
  if (def.value && action.value !== undefined && action.value !== null && action.value !== "") {
    if (def.value.type === "entity") {
      const list = Array.isArray(action.value) ? action.value : [String(action.value)];
      if (!list.length) return tLabel;
      if (list.length === 1) return `${tLabel}: ${shortEntity(list[0])}`;
      return `${tLabel} ×${list.length}`;
    }
    return `${action.value}${def.value.unit || ""}`;
  }
  return tLabel;
}

function shortEntity(eid: string): string {
  const dot = eid.indexOf(".");
  return dot >= 0 ? eid.slice(dot + 1) : eid;
}

export function actionColor(type: DeviceType, action?: BlockAction): string {
  if (!action) return "var(--mode-off)";
  const def = getActionDef(type, action.id);

  // Per termostati e boiler: usa i colori configurati in Impostazioni
  // se l'azione è set_temperature (gradiente) o set_preset (palette preset).
  if (type === "thermostat" || type === "boiler") {
    if (action.id === "set_preset" || action.id === "set_operation") {
      const presets = getPresetColors(_currentSettings);
      const key = String(action.value ?? "");
      if (key && presets[key]) return presets[key];
    }
    if (action.id === "set_temperature") {
      const v = typeof action.value === "number" ? action.value : parseFloat(String(action.value));
      if (!isNaN(v)) {
        const stops = getStops(_currentSettings, type);
        return colorForTemp(v, stops);
      }
    }
  }

  return KIND_COLORS[def?.kind || "on"] || "var(--mode-comfort)";
}

export function defaultAction(type: DeviceType): BlockAction {
  const actions = getActionsForType(type);
  const first = actions[0];
  if (!first) return { id: "turn_on" };
  return {
    id: first.id,
    value: first.value ? first.value.default : undefined,
  };
}
