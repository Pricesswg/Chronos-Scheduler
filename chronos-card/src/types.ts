export type DeviceType =
  | "thermostat"
  | "boiler"
  | "light"
  | "blind"
  | "irrigation"
  | "plug"
  | "fan"
  | "mower"
  | "vacuum"
  | "scene"
  | "automation"
  | "alarm"
  | "input_boolean"
  | "input_number"
  | "input_select"
  | "service";

export interface ChronosDevice {
  id: string;
  entity_id: string;
  alias: string;
  area: string;
  type: DeviceType;
}

export interface BlockAction {
  id: string;
  /** For numeric/enum values: a single primitive. For entity-typed actions
   * (scene/automation), a list of entity_ids — the scheduler invokes the
   * action's service once per entity. A bare string is also accepted for
   * backward-compatibility with v1.8 scene schedules. */
  value?: number | string | string[];
  /** Optional extra params merged into the HA service call (e.g. for lights:
   * rgb_color, color_temp_kelvin, transition). Keys come from the action def's
   * `extras` array exposed by the backend. */
  extras?: Record<string, any>;
}

export interface ActionExtraSpec {
  key: string;
  type: "color" | "number" | "enum" | "json" | "string";
  label?: string;
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  placeholder?: string;
  /** When true on a string extras, the editor renders the input as
   * type="password" so the value is masked while editing. The stored
   * value is still plain text in .storage/chronos.schedules. */
  secret?: boolean;
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
  /** Optional subset of the schedule's `device_ids` to act on for this block.
   * When unset or empty, dispatch falls back to all devices on the schedule.
   * Backend intersects with the schedule's set, so stale references are safe. */
  device_ids?: string[];
  action: BlockAction;
}

export type FireMode = "every" | "once_per_day" | "once_per_daytime" | "once_per_nighttime";

export type RuleEffect =
  | "skip"
  | "shift"
  | "extend"
  | "shrink"
  | "force_action"
  | "replace_value"
  | "scale_duration"
  | "scale_value";

export type DurationDirection = "forward" | "backward";

export interface WeatherRule {
  active: boolean;
  /** Display strings (kept for human readability, also used by old views). */
  if?: string;
  then: string;

  /** Which block this rule targets. undefined / null = all blocks. */
  block_index?: number | null;

  /** What this rule does. */
  effect: RuleEffect;

  /** For shift/extend/shrink. */
  delta_minutes?: number;
  /** For extend/shrink/shift/scale_duration: which edge of the block moves. */
  direction?: DurationDirection;

  /** For force_action / replace_value. */
  action_id?: string;
  action_value?: number | string;

  /** For force_action: how often the rule can fire. */
  fire_mode?: FireMode;

  /** For scale_duration / scale_value: linear interpolation parameters. */
  scale_var?: string;
  scale_var_min?: number;
  scale_var_max?: number;
  scale_out_min?: number;
  scale_out_max?: number;
}

export interface DateRange {
  start_month: number; // 1-12
  start_day: number;   // 1-31
  end_month: number;
  end_day: number;
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
  /** Optional recurring date range. When set, the schedule only fires on
   * dates inside the range, ignoring the year. Wraps across year-end if
   * end_month/day < start_month/day. */
  date_range?: DateRange | null;
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
  type: "number" | "enum" | "entity" | "string";
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
  default?: number | string;
  label?: string;
  options?: string[];
  /** For type="entity": HA domain to filter the picker (e.g. "scene", "automation"). */
  domain?: string;
  /** For type="entity": when true the picker stores a list of entity_ids
   * and the backend invokes the action's service once per entity. */
  multi?: boolean;
  /** For type="string": placeholder shown in the input. */
  placeholder?: string;
}

export interface ActionDef {
  id: string;
  label: string;
  kind: "on" | "off" | "set" | "preset" | "cmd";
  service: string;
  value?: ActionValueSpec;
  extras?: ActionExtraSpec[];
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
  /** Optional header text shown above the card. Empty / unset = no header. */
  title?: string;
  /** Screen the card opens on first render. Defaults to "overview". */
  default_screen?: Screen;
  /** Start with the sidebar collapsed (mini mode) on desktop. */
  collapse_sidebar?: boolean;
  /** Force the mobile (drawer) layout below this width in pixels.
   * Defaults to 700. Set to 0 to never use mobile mode. */
  mobile_threshold?: number;
  /** Manual override for panel-mode top offset detection. "auto" (default)
   * runs runtime detection on the card's viewport position. true forces
   * the offset on regardless. false disables it even in detected panel
   * mode. Useful for kiosk setups or themes that hide the HA app bar. */
  panel_mode?: "auto" | boolean;
  /** Pixel offset applied when panel mode is active. Defaults to the value
   * of HA's --header-height variable, or 56px when that's not exposed. */
  panel_offset?: number;
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
  | "history"
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
