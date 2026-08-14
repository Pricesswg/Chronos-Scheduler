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
  /** Auto-off timer for turn_on blocks (light/plug/fan/thermostat): Chronos
   * switches the devices off this many minutes after turning them on. NOT an
   * extra because extras are forwarded verbatim to the HA service call.
   * Unset/0 = disabled. */
  auto_off_min?: number;
  /** Per-device-type behaviour flag.
   * Irrigation: "global" (default) = all valves in parallel for `value`
   * minutes; "sequential" = one station at a time using `sequence`.
   * Scene: "on_demand" = don't activate the scene at block start (which
   * would switch its lights on); apply it only when a member entity is
   * turned on during the block window, or immediately for members already
   * on. Unset = the classic behaviour (activate at block start). */
  mode?: "global" | "sequential" | "on_demand";
  /** Irrigation sequential mode: ordered list of stations. The scheduler
   * opens each valve, waits its minutes, closes it, then moves to the
   * next. Total program length = sum of all minutes. */
  sequence?: { entity_id: string; minutes: number }[];
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
  | "scale_value"
  /** Keep a device in one state while a measured value stays past a
   * threshold, and apply a release action once it comes back (twilight
   * switch: lights on under 20 lx, off over 40 lx). Unlike force_action it
   * drives both transitions. */
  | "hold";

export type DurationDirection = "forward" | "backward";

export interface RuleTarget {
  schedule_id: string;
  /** Which block of that schedule the rule targets. null = all blocks. */
  block_index?: number | null;
}

export interface WeatherRule {
  /** Stable id assigned by the backend (v1.17+). Empty/undefined = new. */
  id?: string;
  active: boolean;
  /** Display strings (kept for human readability, also used by old views). */
  if?: string;
  then: string;

  /** Schedules this rule applies to (v1.17+ global rules store). */
  targets?: RuleTarget[];

  /** Legacy / flattened view: when a rule is projected onto one schedule
   * (rulesForSchedule) the target's block_index is inlined here. Also used
   * by recipes and pre-1.17 JSON exports. null = all blocks. */
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

  /** For "hold": the measured variable (weather attribute key or an HA
   * entity_id read directly, e.g. sensor.outdoor_lux). */
  hold_var?: string;
  /** Threshold that engages the hold, and the one that releases it. Their
   * order sets the direction: hold_on below hold_off engages under hold_on
   * (dark), hold_on above hold_off engages over hold_on (hot). The gap
   * between them is the deadband that prevents flapping. */
  hold_on?: number;
  hold_off?: number;
  /** Minutes the new state must persist before it is applied. 0 = at once. */
  hold_dwell_min?: number;
  /** Action applied while engaged, and the one applied on release. */
  hold_action_id?: string;
  hold_action_value?: number | string;
  hold_release_action_id?: string;
  hold_release_action_value?: number | string;
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
  /** Legacy embedded rules (pre-1.17). Still present in old JSON exports;
   * live schedules no longer carry it — rules live in the global store. */
  weather_rules?: WeatherRule[];
  /** Optional recurring date range. When set, the schedule only fires on
   * dates inside the range, ignoring the year. Wraps across year-end if
   * end_month/day < start_month/day. */
  date_range?: DateRange | null;
  /** Per-schedule timeline view preference (issue #13). Unset = follow
   * settings.default_timeline_variant. Persisted outside the dirty/save
   * flow: flipping the view must not prompt "unsaved changes". */
  timeline_variant?: "linear" | "radial" | "list";
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
  /** Per-action-kind HEX colors for timeline blocks. Keys: on/off/set/preset/cmd. */
  color_kind?: Record<string, string>;
  /** Per-device-type {active, inactive} HEX colors for state-driven coloring
   * of devices without a continuous range (plug, mower, vacuum, irrigation,
   * alarm, input_boolean, input_select, input_number). */
  color_simple?: Record<string, { active: string; inactive: string }>;
  /** Per-device-type {start, end} gradient endpoints for devices with a
   * continuous state range (blind position, fan speed). */
  color_range?: Record<string, { start: string; end: string }>;
  weather_sensor_map?: Record<string, string>;
  language?: "auto" | "it" | "en" | "fr" | "de" | "es" | "pt" | "nl" | "pl";
  /** When true, the editor blocks saving an irrigation schedule whose
   * sequential program overlaps in time with another sequential program
   * that shares a valve (water-pressure hazard). Default false: only a
   * non-blocking warning is shown and the user decides. */
  irrigation_conflict_block?: boolean;
  /** Offline-device recall: retry a block action on entities that were
   * unavailable at dispatch, when they come back online and the block is
   * still active. Default true. */
  offline_recall?: boolean;
  /** Max recall attempts per (schedule, entity). Default 3. */
  offline_recall_max_attempts?: number;
  /** Weather map on the Live screen. Tiles (OpenStreetMap) and radar
   * (RainViewer) are fetched from the internet at view time, so offline
   * installations can switch the whole map off. Default true. */
  live_map?: boolean;
  /** Optional OpenWeatherMap API key. Unlocks the temperature / wind /
   * clouds / pressure overlays on the Live weather map. Empty = only the
   * free RainViewer radar layer is available. */
  owm_api_key?: string;
  /** Animated weather backdrop on the Live hero (sun glow, clouds, rain,
   * lightning, snow driven by the weather condition). Default true;
   * prefers-reduced-motion disables it regardless. */
  live_fx?: boolean;
  /** Navigation layout: "top" (default) merges sidebar and topbar into a
   * single icon bar; "sidebar" keeps the classic left sidebar. */
  nav_style?: "top" | "sidebar";
  /** Ask for confirmation before switching a schedule or a weather rule
   * OFF from the card. Switching one back ON is never confirmed. Default
   * true. Card-side only: the switch entities and the schedule_toggle
   * service are deliberately not gated. */
  confirm_disable?: boolean;
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
  /** Embed a single screen with no app chrome (no sidebar, no top bar).
   * Turns the full Chronos app into a compact dashboard card showing only
   * this screen. Best with the display screens (live, week, history,
   * overview). Unset = the full app. */
  view?: Screen;
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

/** Config for `custom:chronos-schedule-card`: a compact, non-interactive
 * status recap for one schedule. Every `show_*` flag defaults to true
 * except `show_weather_ribbon`; `alarm_glow` defaults to true. */
export interface ScheduleCardConfig {
  type: string;
  /** Id of the schedule to recap (required to show anything). */
  schedule?: string;
  /** Optional header override; defaults to the schedule name. */
  title?: string;
  /** Timeline bar variant. Unset = the schedule's own saved variant, else linear. */
  timeline_variant?: "linear" | "radial" | "list";
  show_timeline?: boolean;
  show_weather_ribbon?: boolean;
  show_now?: boolean;
  show_next?: boolean;
  show_status_active?: boolean;
  show_status_devices?: boolean;
  show_status_weather?: boolean;
  show_status_days?: boolean;
  show_status_period?: boolean;
  show_last_activity?: boolean;
  show_log?: boolean;
  /** Number of activity-log rows to show. Default 6. */
  log_limit?: number;
  /** Pulse a red glow while the newest activity is an error. Default true. */
  alarm_glow?: boolean;
  /** Header (name + enabled pill). Turn it off, leave only the timeline on,
   * and the card becomes a bare schedule bar for a dashboard. Default true. */
  show_header?: boolean;
  /** Id of a second schedule drawn under the bar for comparison (two
   * irrigation zones, …). Overlapping stretches are outlined in red. */
  compare_with?: string;
  /** Show a small button that opens Chronos. The card itself stays
   * read-only; this is just a way back to the full app. Default false. */
  show_link?: boolean;
  /** Dashboard path the link button opens. Default "/chronos". */
  link_path?: string;
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
  rules: WeatherRule[];
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
