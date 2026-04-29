export type DeviceType =
  | "thermostat"
  | "boiler"
  | "light"
  | "blind"
  | "irrigation"
  | "plug"
  | "fan"
  | "mower"
  | "vacuum";

export interface ChronosDevice {
  id: string;
  entity_id: string;
  alias: string;
  area: string;
  type: DeviceType;
}

export interface BlockAction {
  id: string;
  value?: number | string;
}

export interface Block {
  start: number;
  end: number;
  action: BlockAction;
}

export interface WeatherRule {
  if: string;
  then: string;
  active: boolean;
}

export interface Schedule {
  id: string;
  name: string;
  device_type: DeviceType;
  device_ids: string[];
  days: number[];
  enabled: boolean;
  blocks: Block[];
  weather_rules: WeatherRule[];
}

export interface Settings {
  weather_entity: string;
  polling_minutes: number;
  snap_minutes: number;
  notify_rule_triggered: boolean;
  notify_sched_skipped: boolean;
  notify_command_error: boolean;
  theme: "light" | "dark" | "auto";
  density: "comfortable" | "compact";
  default_timeline_variant: "linear" | "radial" | "list";
  color_light_use_state?: boolean;
  color_stops_climate?: { max: number; color: string }[];
  color_stops_boiler?: { max: number; color: string }[];
  color_presets?: Record<string, string>;
  weather_sensor_map?: Record<string, string>;
  language?: "auto" | "it" | "en" | "fr" | "de";
}

export interface ActionValueSpec {
  type: "number" | "enum";
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  default?: number | string;
  label?: string;
  options?: string[];
}

export interface ActionDef {
  id: string;
  label: string;
  kind: "on" | "off" | "set" | "preset" | "cmd";
  service: string;
  value?: ActionValueSpec;
}

export interface WeatherAttribute {
  key: string;
  label: string;
  unit: string;
  icon: string;
  type: "number" | "enum";
  options?: string[];
}

export interface ChronosCardConfig {
  type: string;
}

export type Screen =
  | "overview"
  | "editor"
  | "weatherRule"
  | "device"
  | "week"
  | "live"
  | "wizard"
  | "devices"
  | "settings";

export interface ChronosState {
  screen: Screen;
  selectedId: string;
  deviceDetailId: string;
  schedules: Schedule[];
  savedSchedules: Schedule[];
  devices: ChronosDevice[];
  settings: Settings;
  timelineVariant: "linear" | "radial" | "list";
  pendingNav: Screen | null;
  loading: boolean;
  availableEntities: any[];
  weatherEntities: any[];
  actionsMap: Record<string, ActionDef[]>;
  weatherAttributes: WeatherAttribute[];
  forecast: any[];
}

export interface HomeAssistant {
  callWS: <T>(msg: Record<string, any>) => Promise<T>;
  connection: {
    subscribeEvents: (
      callback: (ev: any) => void,
      eventType: string
    ) => Promise<() => void>;
  };
  states: Record<string, any>;
  themes: { darkMode: boolean };
  language: string;
}
