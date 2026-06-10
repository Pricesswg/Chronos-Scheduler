import { LitElement, html, svg, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { t } from "../i18n";
import { actionColor } from "../actions";
import { DAY_END_HOUR } from "../utils";
import type { ChronosCard } from "../chronos-card";
import type { Block, DateRange, DeviceType, Schedule, WeatherRule } from "../types";

interface Recipe {
  id: string;
  device_type: DeviceType;
  default_name_key: string;
  blocks: Block[];
  weather_rules: WeatherRule[];
  days: number[];
  /** Optional recurring yearly window (e.g. seasonal recipes). */
  date_range?: DateRange;
}

const RECIPES: Recipe[] = [
  {
    id: "thermostat_day_night",
    device_type: "thermostat",
    default_name_key: "recipe.thermostat_day_night.preset_name",
    days: [1, 1, 1, 1, 1, 1, 1],
    blocks: [
      { start: 0, end: 7, action: { id: "set_temperature", value: 18 } },
      { start: 7, end: 22, action: { id: "set_temperature", value: 21 } },
      { start: 22, end: DAY_END_HOUR, action: { id: "set_temperature", value: 18 } },
    ],
    weather_rules: [
      { if: "temperature > 22", then: "Skip", active: true, effect: "skip", block_index: null },
    ],
  },
  {
    id: "lights_at_sunset",
    device_type: "light",
    default_name_key: "recipe.lights_at_sunset.preset_name",
    days: [1, 1, 1, 1, 1, 1, 1],
    blocks: [
      {
        start: 18, end: 23,
        start_anchor: "sunset", start_offset: -30,
        action: { id: "turn_on", value: 80 },
      },
    ],
    weather_rules: [],
  },
  {
    id: "blinds_wind_safety",
    device_type: "blind",
    default_name_key: "recipe.blinds_wind_safety.preset_name",
    days: [1, 1, 1, 1, 1, 1, 1],
    blocks: [
      {
        start: 7, end: 19,
        start_anchor: "sunrise", start_offset: 0,
        end_anchor: "sunset", end_offset: 0,
        action: { id: "set_position", value: 100 },
      },
    ],
    weather_rules: [
      {
        if: "wind_speed > 30",
        then: "Force close",
        active: true,
        effect: "force_action",
        block_index: 0,
        action_id: "close_cover",
        fire_mode: "once_per_daytime",
      },
    ],
  },
  {
    id: "irrigation_skip_rain",
    device_type: "irrigation",
    default_name_key: "recipe.irrigation_skip_rain.preset_name",
    days: [1, 1, 1, 1, 1, 1, 1],
    blocks: [
      { start: 6, end: 6.5, action: { id: "turn_on", value: 30 } },
    ],
    weather_rules: [
      { if: "forecast.rain_6h > 2", then: "Skip", active: true, effect: "skip", block_index: 0 },
    ],
  },
  {
    id: "boiler_eco_night",
    device_type: "boiler",
    default_name_key: "recipe.boiler_eco_night.preset_name",
    days: [1, 1, 1, 1, 1, 1, 1],
    blocks: [
      { start: 0, end: 6, action: { id: "set_operation", value: "eco" } },
      { start: 6, end: 23, action: { id: "set_operation", value: "electric" } },
      { start: 23, end: DAY_END_HOUR, action: { id: "set_operation", value: "eco" } },
    ],
    weather_rules: [],
  },
  {
    id: "scene_routine",
    device_type: "scene",
    default_name_key: "recipe.scene_routine.preset_name",
    days: [1, 1, 1, 1, 1, 1, 1],
    blocks: [
      // Each block fires "activate" — the user picks the actual scene(s) per
      // block in the editor's multi-select after creating the recipe.
      { start: 7, end: 8, action: { id: "activate" } },
      { start: 19, end: 20, action: { id: "activate" } },
      { start: 22, end: 23, action: { id: "activate" } },
    ],
    weather_rules: [],
  },
  {
    id: "alarm_arm_night",
    device_type: "alarm",
    default_name_key: "recipe.alarm_arm_night.preset_name",
    days: [1, 1, 1, 1, 1, 1, 1],
    blocks: [
      { start: 0, end: 7, action: { id: "arm_night" } },
      { start: 7, end: 23, action: { id: "disarm" } },
      { start: 23, end: DAY_END_HOUR, action: { id: "arm_night" } },
    ],
    weather_rules: [],
  },
  {
    id: "boiler_offgrid_soc",
    device_type: "boiler",
    default_name_key: "recipe.boiler_offgrid_soc.preset_name",
    days: [1, 1, 1, 1, 1, 1, 1],
    blocks: [
      // Baseline minimum temperature; the rule below boosts it whenever the
      // off-grid battery is full and there's still daylight to keep recharging.
      { start: 0, end: DAY_END_HOUR, action: { id: "set_temperature", value: 35 } },
    ],
    weather_rules: [
      {
        // The user MUST replace `sensor.battery_soc` with their actual SOC
        // entity in the rule editor after creating the recipe; the rest of
        // the expression (sun.minutes_until_sunset > 120) is generic.
        if: "sensor.battery_soc > 96 AND sun.minutes_until_sunset > 120",
        then: "Boost",
        active: true,
        effect: "force_action",
        block_index: null,
        action_id: "set_temperature",
        action_value: 60,
        fire_mode: "once_per_daytime",
      },
    ],
  },
  {
    // scale_value showcase: hotter afternoon → faster fan, linearly.
    id: "fan_heat_scale",
    device_type: "fan",
    default_name_key: "recipe.fan_heat_scale.preset_name",
    days: [1, 1, 1, 1, 1, 1, 1],
    blocks: [
      { start: 12, end: 20, action: { id: "turn_on", value: 50 } },
    ],
    weather_rules: [
      {
        then: "Scale speed",
        active: true,
        effect: "scale_value",
        block_index: 0,
        scale_var: "temperature",
        scale_var_min: 24,
        scale_var_max: 34,
        scale_out_min: 30,
        scale_out_max: 100,
      },
    ],
  },
  {
    // Multi-clause AND + force_action with value + seasonal date range:
    // drop the blinds to 25% when the sun is high AND it's hot, summer only.
    id: "blinds_summer_shade",
    device_type: "blind",
    default_name_key: "recipe.blinds_summer_shade.preset_name",
    days: [1, 1, 1, 1, 1, 1, 1],
    date_range: { start_month: 6, start_day: 1, end_month: 9, end_day: 15 },
    blocks: [
      {
        start: 7, end: 19,
        start_anchor: "sunrise", start_offset: 0,
        end_anchor: "sunset", end_offset: 0,
        action: { id: "set_position", value: 100 },
      },
    ],
    weather_rules: [
      {
        if: "sun.elevation > 40 AND temperature > 28",
        then: "Shade 25%",
        active: true,
        effect: "force_action",
        block_index: 0,
        action_id: "set_position",
        action_value: 25,
        fire_mode: "once_per_day",
      },
    ],
  },
  {
    // Deferred load on solar surplus: the plug window only runs when there
    // is real sun; the skip rule keeps it off on overcast days.
    id: "pv_surplus_plug",
    device_type: "plug",
    default_name_key: "recipe.pv_surplus_plug.preset_name",
    days: [1, 1, 1, 1, 1, 1, 1],
    blocks: [
      { start: 0, end: 11, action: { id: "turn_off" } },
      { start: 11, end: 14, action: { id: "turn_on" } },
      { start: 14, end: DAY_END_HOUR, action: { id: "turn_off" } },
    ],
    weather_rules: [
      { if: "solar_radiation < 500", then: "Skip", active: true, effect: "skip", block_index: 1 },
    ],
  },
  {
    // Plain weekday automation, no weather: vacuum starts while the house
    // is empty. Also the only recipe covering the vacuum device type.
    id: "vacuum_weekday_morning",
    device_type: "vacuum",
    default_name_key: "recipe.vacuum_weekday_morning.preset_name",
    days: [1, 1, 1, 1, 1, 0, 0],
    blocks: [
      { start: 10, end: 10.5, action: { id: "start" } },
    ],
    weather_rules: [],
  },
  {
    // scale_duration + date_range showcase: pool pump filters longer on hot
    // days (the on-block grows forward into the off-block), summer only.
    id: "pool_pump_season",
    device_type: "plug",
    default_name_key: "recipe.pool_pump_season.preset_name",
    days: [1, 1, 1, 1, 1, 1, 1],
    date_range: { start_month: 6, start_day: 1, end_month: 9, end_day: 15 },
    blocks: [
      { start: 0, end: 8, action: { id: "turn_off" } },
      { start: 8, end: 13, action: { id: "turn_on" } },
      { start: 13, end: DAY_END_HOUR, action: { id: "turn_off" } },
    ],
    weather_rules: [
      {
        then: "Scale filtering time",
        active: true,
        effect: "scale_duration",
        block_index: 1,
        direction: "forward",
        scale_var: "temperature",
        scale_var_min: 24,
        scale_var_max: 34,
        scale_out_min: 240,
        scale_out_max: 420,
      },
    ],
  },
];

@customElement("chronos-help-screen")
export class ChronosHelpScreen extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  render() {
    return html`
      <div class="col" style="gap:22px;max-width:1100px">
        <div>
          <h1 class="page-title">${t("help.title")}</h1>
          <p class="page-sub">${t("help.subtitle")}</p>
        </div>

        <div class="card">
          <h3 class="card__title" style="margin:0 0 6px">${t("help.intro.title")}</h3>
          <p class="text-sm" style="margin:0;color:var(--text-soft);line-height:1.55">
            ${t("help.intro.body")}
          </p>
        </div>

        ${this._renderQuickStart()}

        <div class="grid-auto" style="grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:12px">
          ${RECIPES.map((r) => this._renderRecipe(r))}
        </div>

        ${this._renderFaq()}

        <div class="card">
          <h3 class="card__title" style="margin:0 0 10px">${t("help.glossary.title")}</h3>
          <div class="col" style="gap:10px">
            ${[
              ["help.glossary.block.title", "help.glossary.block.body"],
              ["help.glossary.anchor.title", "help.glossary.anchor.body"],
              ["help.glossary.rule.title", "help.glossary.rule.body"],
              ["help.glossary.fire_mode.title", "help.glossary.fire_mode.body"],
              ["help.glossary.override.title", "help.glossary.override.body"],
            ].map(([titleKey, bodyKey]) => html`
              <div>
                <div class="fw-600 text-sm">${t(titleKey)}</div>
                <div class="text-sm" style="color:var(--text-soft);line-height:1.5">${t(bodyKey)}</div>
              </div>
            `)}
          </div>
        </div>
      </div>
    `;
  }

  /** Quick start card: short ordered list of the typical setup flow + a
   * prominent link that opens the full guide on GitHub in a new tab.
   * The full guide lives in docs/USER_GUIDE.md, a 700-line reference with
   * screenshots that we don't want to embed in the bundle. */
  private _renderQuickStart() {
    const steps: [string, string][] = [
      ["help.quickstart.s1.title", "help.quickstart.s1.body"],
      ["help.quickstart.s2.title", "help.quickstart.s2.body"],
      ["help.quickstart.s3.title", "help.quickstart.s3.body"],
      ["help.quickstart.s4.title", "help.quickstart.s4.body"],
      ["help.quickstart.s5.title", "help.quickstart.s5.body"],
      ["help.quickstart.s6.title", "help.quickstart.s6.body"],
    ];
    return html`
      <div class="card">
        <div class="sp-between" style="align-items:flex-start;margin-bottom:10px">
          <div>
            <h3 class="card__title" style="margin:0">${t("help.quickstart.title")}</h3>
            <p class="text-sm" style="margin:4px 0 0;color:var(--text-soft)">${t("help.quickstart.subtitle")}</p>
          </div>
          <a class="btn btn--primary" href="https://github.com/Pricesswg/Chronos-Scheduler/blob/main/docs/USER_GUIDE.md"
            target="_blank" rel="noopener noreferrer"
            style="text-decoration:none;white-space:nowrap">
            ${icon("info", 13)} ${t("help.quickstart.open_full_guide")}
          </a>
        </div>
        <ol style="margin:0;padding-left:22px;color:var(--text);font-size:13.5px;line-height:1.55">
          ${steps.map(([titleKey, bodyKey]) => html`
            <li style="margin-bottom:8px">
              <span class="fw-600">${t(titleKey)}</span>
              <span style="color:var(--text-soft)"> · ${t(bodyKey)}</span>
            </li>
          `)}
        </ol>
      </div>
    `;
  }

  private _renderFaq() {
    const items: [string, string][] = [
      ["help.faq.q1", "help.faq.a1"],
      ["help.faq.q2", "help.faq.a2"],
      ["help.faq.q3", "help.faq.a3"],
      ["help.faq.q4", "help.faq.a4"],
      ["help.faq.q5", "help.faq.a5"],
      ["help.faq.q6", "help.faq.a6"],
    ];
    return html`
      <div class="card">
        <h3 class="card__title" style="margin:0 0 10px">${t("help.faq.title")}</h3>
        <div class="col" style="gap:14px">
          ${items.map(([qKey, aKey]) => html`
            <div>
              <div class="fw-600 text-sm">${t(qKey)}</div>
              <div class="text-sm" style="color:var(--text-soft);line-height:1.55;margin-top:2px">${t(aKey)}</div>
            </div>
          `)}
        </div>
      </div>
    `;
  }

  private _renderRecipe(r: Recipe) {
    const totalCoverage = r.blocks.reduce((s, b) => s + (b.end - b.start), 0);
    const hasAnchors = r.blocks.some((b: any) => b.start_anchor || b.end_anchor);
    const hasTriggers = r.weather_rules.some((w) => w.effect === "force_action" || w.effect === "scale_duration" || w.effect === "scale_value");
    return html`
      <div class="card" style="padding:16px;display:flex;flex-direction:column;gap:12px">
        <div class="row" style="gap:10px;align-items:flex-start">
          <div class="device-row__icon" style="background:var(--accent-soft);color:var(--accent-ink)">
            ${deviceIcon(r.device_type, 18)}
          </div>
          <div style="flex:1;min-width:0">
            <div class="fw-600">${t(`recipe.${r.id}.title`)}</div>
            <div class="text-xs text-mute" style="margin-top:2px">${t(`recipe.${r.id}.when`)}</div>
          </div>
        </div>

        ${this._renderTimelinePreview(r)}

        <div class="text-sm" style="color:var(--text-soft);line-height:1.5">
          ${t(`recipe.${r.id}.howto`)}
        </div>

        <div class="row" style="gap:6px;flex-wrap:wrap">
          <span class="chip">${r.blocks.length} ${t("wizard.step.time").toLowerCase()}</span>
          ${hasAnchors ? html`<span class="chip chip--weather">${icon("sun", 11)} ${t("help.tag.anchored")}</span>` : nothing}
          ${r.weather_rules.length ? html`<span class="chip chip--accent">${icon("cloud", 11)} ${r.weather_rules.length} ${t("nav.weather_rules").toLowerCase()}</span>` : nothing}
          ${hasTriggers ? html`<span class="chip" style="background:#fef3c7;color:#92400e">${icon("bolt", 11)} ${t("help.tag.trigger")}</span>` : nothing}
        </div>

        <button class="btn btn--primary" @click=${() => this._createFromRecipe(r)}>
          ${icon("plus", 13)} ${t("help.create_button")}
        </button>
      </div>
    `;
  }

  private _renderTimelinePreview(r: Recipe) {
    // Mini SVG strip showing the blocks layout (no anchor resolution, just visual)
    const W = 280;
    const H = 18;
    return html`
      <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"
        style="width:100%;height:18px;border-radius:4px;background:var(--bg-sunken);display:block">
        ${r.blocks.map((b) => {
          const x = (b.start / 24) * W;
          const w = ((b.end - b.start) / 24) * W;
          return svg`<rect x="${x}" y="0" width="${Math.max(2, w)}" height="${H}" fill="${actionColor(r.device_type, b.action)}" rx="2"/>`;
        })}
      </svg>
    `;
  }

  private async _createFromRecipe(r: Recipe) {
    const presetName = t(r.default_name_key);
    const schedule: Schedule = {
      id: "",
      name: presetName,
      device_type: r.device_type,
      device_ids: [],
      days: r.days,
      enabled: false, // start disabled until user picks devices
      blocks: r.blocks.map((b) => ({ ...b, action: { ...b.action } })),
      weather_rules: r.weather_rules.map((w) => ({ ...w })),
      date_range: r.date_range ? { ...r.date_range } : null,
    };
    await this.card.doAddSchedule(schedule);
    // doAddSchedule navigates to editor automatically
  }
}
