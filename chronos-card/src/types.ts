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

export type TimeAnchor = "sunrise" | "sunset";

export interface Block {
  start: number;
  end: number;
  /** Optional anchor for start time. If set, `start` is the resolved fallback. */
  start_anchor?: TimeAnchor;
  start_offset?: number; // minutes, can be negative
  end_anchor?: TimeAnchor;
  end_offset?: number;
  action: BlockAction;
}

export type FireMode = "every" | "once_per_day" | "once_per_daytime" | "once_per_nighttime";

export interface TriggerAction {
  action_id: string;
  value?: number | string;
}

export interface WeatherRule {
  if: string;
  then: string;
  active: boolean;
  /** When set, the rule is a real trigger: scheduler edge-fires this action
   * whenever the IF condition becomes true (rate-limited by fire_mode).
   * When unset, the rule is legacy skip-style: it only modifies block execution. */
  trigger_action?: TriggerAction;
  fire_mode?: FireMode;
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
  | "weatherRulesList"
  | "device"
  | "week"
  | "live"
  | "wizard"
  | "devices"
  | "settings"
  | "help";

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
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, any>,
    target?: Record<string, any>
  ) => Promise<unknown>;
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
