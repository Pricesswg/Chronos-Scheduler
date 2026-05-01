import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { t } from "../i18n";
import { actionColor } from "../actions";
import type { ChronosCard } from "../chronos-card";
import type { Block, DeviceType, Schedule, WeatherRule } from "../types";

interface Recipe {
  id: string;
  device_type: DeviceType;
  default_name_key: string;
  blocks: Block[];
  weather_rules: WeatherRule[];
  days: number[];
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
      { start: 22, end: 24, action: { id: "set_temperature", value: 18 } },
    ],
    weather_rules: [
      { if: "temperature > 22", then: "Salta esecuzione", active: true },
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
        then: "Forza: Chiudi",
        active: true,
        trigger_action: { action_id: "close_cover" },
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
      { if: "forecast.rain_6h > 2", then: "Salta esecuzione", active: true },
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
      { start: 23, end: 24, action: { id: "set_operation", value: "eco" } },
    ],
    weather_rules: [],
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

        <div class="grid-auto" style="grid-template-columns:repeat(auto-fill, minmax(320px, 1fr));gap:12px">
          ${RECIPES.map((r) => this._renderRecipe(r))}
        </div>

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

  private _renderRecipe(r: Recipe) {
    const totalCoverage = r.blocks.reduce((s, b) => s + (b.end - b.start), 0);
    const hasAnchors = r.blocks.some((b: any) => b.start_anchor || b.end_anchor);
    const hasTriggers = r.weather_rules.some((w) => w.trigger_action);
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
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:18px;border-radius:4px;background:var(--bg-sunken)">
        ${r.blocks.map((b) => {
          const x = (b.start / 24) * W;
          const w = ((b.end - b.start) / 24) * W;
          return html`<rect x="${x}" y="0" width="${Math.max(2, w)}" height="${H}" fill="${actionColor(r.device_type, b.action)}" rx="2"/>`;
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
    };
    await this.card.doAddSchedule(schedule);
    // doAddSchedule navigates to editor automatically
  }
}
