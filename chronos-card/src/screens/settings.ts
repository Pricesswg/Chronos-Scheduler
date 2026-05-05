import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon } from "../icons";
import { t, attrLabel } from "../i18n";
import {
  DEFAULT_TEMP_STOPS_CLIMATE,
  DEFAULT_TEMP_STOPS_BOILER,
  DEFAULT_PRESET_COLORS,
  getStops,
  getPresetColors,
  lightUseState,
  type ColorStop,
} from "../device-colors";
import type { ChronosCard } from "../chronos-card";

@customElement("chronos-settings-screen")
export class ChronosSettingsScreen extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  render() {
    const s = this.card._settings;
    if (!s) return html`<div class="text-mute">${t("common.loading")}</div>`;

    return html`
      <div class="col" style="gap:22px;max-width:980px">
        <div>
          <h1 class="page-title">${t("screen.settings.title")}</h1>
          <p class="page-sub">${t("settings.subtitle")}</p>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("settings.language.title")}</h3><p class="card__sub">${t("settings.language.subtitle")}</p></div></div>
          <div class="segmented">
            ${(["auto", "it", "en", "fr", "de"] as const).map((v) => html`
              <button data-active="${(s.language || "auto") === v}" @click=${() => this._updateSetting("language", v)}>
                ${v === "auto" ? t("settings.language.auto") : v.toUpperCase()}
              </button>
            `)}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("settings.weather.title")}</h3><p class="card__sub">${t("settings.weather.subtitle")}</p></div></div>
          <div class="col" style="gap:14px">
            <div class="field">
              <label class="field__label">${t("settings.weather.entity")}</label>
              <select class="select mono"
                @change=${(e: Event) => this._updateSetting("weather_entity", (e.target as HTMLSelectElement).value)}>
                <option value="" ?selected=${!s.weather_entity}>${t("common.none")}</option>
                ${this.card._weatherEntities.map((w) => html`
                  <option value="${w.entity_id}" ?selected=${s.weather_entity === w.entity_id}>${w.entity_id} — ${w.friendly_name}</option>
                `)}
              </select>
              <span class="field__hint">${t("settings.weather.entity.hint")}</span>
            </div>

            ${this._renderSensorOverrides()}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("settings.behavior.title")}</h3><p class="card__sub">${t("settings.behavior.subtitle")}</p></div></div>
          <div class="grid-2">
            <div class="field">
              <label class="field__label">${t("settings.polling")}</label>
              <div class="segmented">
                ${[1, 5, 15].map((v) => html`
                  <button data-active="${s.polling_minutes === v}" @click=${() => this._updateSetting("polling_minutes", v)}>${v} ${t("common.min")}</button>
                `)}
              </div>
              <span class="field__hint">${t("settings.polling.hint")}</span>
            </div>
            <div class="field">
              <label class="field__label">${t("settings.snap")}</label>
              <div class="segmented">
                ${[5, 15, 30, 60].map((v) => html`
                  <button data-active="${s.snap_minutes === v}" @click=${() => this._updateSetting("snap_minutes", v)}>${v === 60 ? `1 ${t("common.hour_short")}` : `${v} ${t("common.min")}`}</button>
                `)}
              </div>
              <span class="field__hint">${t("settings.snap.hint")}</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("settings.notify.title")}</h3><p class="card__sub">${t("settings.notify.subtitle")}</p></div></div>
          <div class="col" style="gap:0">
            ${([
              ["notify_block_executed", t("settings.notify.block_executed"), t("settings.notify.block_executed.desc")],
              ["notify_rule_triggered", t("settings.notify.rule_triggered"), t("settings.notify.rule_triggered.desc")],
              ["notify_sched_skipped", t("settings.notify.sched_skipped"), t("settings.notify.sched_skipped.desc")],
              ["notify_command_error", t("settings.notify.command_error"), t("settings.notify.command_error.desc")],
            ] as const).map(([key, label, desc]) => html`
              <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0">
                <div class="device-row__main">
                  <div class="device-row__name">${label}</div>
                  <div class="device-row__meta" style="font-family:var(--font-sans)">${desc}</div>
                </div>
                <label class="switch">
                  <input type="checkbox" .checked=${!!(s as any)[key]}
                    @change=${(e: Event) => this._updateSetting(key, (e.target as HTMLInputElement).checked)}/>
                  <span class="switch__track"></span>
                  <span class="switch__thumb"></span>
                </label>
              </div>
            `)}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("settings.appearance.title")}</h3><p class="card__sub">${t("settings.appearance.subtitle")}</p></div></div>
          <div class="field">
            <label class="field__label">${t("settings.density")}</label>
            <div class="segmented">
              ${(["comfortable", "compact"] as const).map((v) => html`
                <button data-active="${s.density === v}" @click=${() => this._updateSetting("density", v)}>
                  ${t("settings.density." + v)}
                </button>
              `)}
            </div>
            <span class="field__hint">${t("settings.appearance.theme_hint")}</span>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("settings.timeline_default.title")}</h3><p class="card__sub">${t("settings.timeline_default.subtitle")}</p></div></div>
          <div class="segmented">
            ${(["linear", "radial", "list"] as const).map((v) => html`
              <button data-active="${s.default_timeline_variant === v}" @click=${() => this._updateSetting("default_timeline_variant", v)}>
                ${t("timeline." + v)}
              </button>
            `)}
          </div>
        </div>

        ${this._renderColorsSection()}
      </div>
    `;
  }

  private _renderColorsSection() {
    const s = this.card._settings!;
    const climateStops = getStops(s, "thermostat");
    const boilerStops = getStops(s, "boiler");
    const presets = getPresetColors(s);
    const useState = lightUseState(s);

    return html`
      <div class="card">
        <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("settings.colors.title")}</h3><p class="card__sub">${t("settings.colors.subtitle")}</p></div></div>

        <div class="col" style="gap:18px">
          <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0;padding:8px 0">
            <div class="device-row__main">
              <div class="device-row__name">${t("settings.colors.lights.title")}</div>
              <div class="device-row__meta" style="font-family:var(--font-sans)">${t("settings.colors.lights.desc")}</div>
            </div>
            <label class="switch">
              <input type="checkbox" .checked=${useState}
                @change=${(e: Event) => this._updateSetting("color_light_use_state", (e.target as HTMLInputElement).checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
          </div>

          ${this._renderTempStops(
            t("settings.colors.thermostat.title"),
            t("settings.colors.thermostat.desc"),
            climateStops,
            "color_stops_climate",
            DEFAULT_TEMP_STOPS_CLIMATE,
          )}

          ${this._renderTempStops(
            t("settings.colors.boiler.title"),
            t("settings.colors.boiler.desc"),
            boilerStops,
            "color_stops_boiler",
            DEFAULT_TEMP_STOPS_BOILER,
          )}

          <div>
            <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:8px">
              <div>
                <div class="fw-600" style="font-size:13.5px">${t("settings.colors.preset.title")}</div>
                <div class="text-xs text-mute">${t("settings.colors.preset.desc")}</div>
              </div>
              <button class="btn btn--sm" @click=${() => this._updateSetting("color_presets", { ...DEFAULT_PRESET_COLORS })}>
                ${icon("repeat", 12)} ${t("common.default")}
              </button>
            </div>
            <div class="grid-2" style="gap:8px">
              ${Object.entries(presets).map(([name, color]) => html`
                <div class="row" style="gap:10px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md);align-items:center">
                  <div style="width:14px;height:14px;border-radius:50%;background:${color};border:1px solid var(--border)"></div>
                  <span class="mono text-sm" style="flex:1">${name}</span>
                  <input type="color" .value=${color}
                    @change=${(e: Event) => this._updatePresetColor(name, (e.target as HTMLInputElement).value)}
                    style="width:36px;height:28px;padding:0;border:1px solid var(--border-soft);border-radius:6px;background:transparent;cursor:pointer"/>
                </div>
              `)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderTempStops(
    title: string,
    desc: string,
    stops: ColorStop[],
    settingsKey: "color_stops_climate" | "color_stops_boiler",
    defaults: ColorStop[],
  ) {
    return html`
      <div>
        <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:8px">
          <div>
            <div class="fw-600" style="font-size:13.5px">${title}</div>
            <div class="text-xs text-mute">${desc}</div>
          </div>
          <div class="row" style="gap:6px">
            <button class="btn btn--sm" @click=${() => this._addStop(stops, settingsKey)}>
              ${icon("plus", 12)} ${t("settings.colors.add_stop")}
            </button>
            <button class="btn btn--sm" @click=${() => this._updateSetting(settingsKey, defaults.map((s) => ({ ...s })))}>
              ${icon("repeat", 12)} ${t("common.default")}
            </button>
          </div>
        </div>
        <div class="col" style="gap:6px">
          ${stops.map((stop, idx) => {
            const isLast = idx === stops.length - 1;
            return html`
              <div class="row" style="gap:10px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md);align-items:center">
                <span class="text-sm text-mute" style="width:18px">${isLast ? ">" : "≤"}</span>
                ${isLast
                  ? html`<span class="mono text-sm" style="width:80px">${stops[idx - 1]?.max ?? 0}°+</span>`
                  : html`<input type="number" class="input mono" step="0.5" .value=${String(stop.max)}
                      @change=${(e: Event) => this._updateStopMax(stops, settingsKey, idx, parseFloat((e.target as HTMLInputElement).value))}
                      style="width:80px;font-size:13px"/>`}
                <span class="text-sm text-mute">°C</span>
                <div style="width:14px;height:14px;border-radius:50%;background:${stop.color};border:1px solid var(--border)"></div>
                <span class="mono text-xs" style="flex:1;color:var(--text-muted)">${stop.color}</span>
                <input type="color" .value=${stop.color}
                  @change=${(e: Event) => this._updateStopColor(stops, settingsKey, idx, (e.target as HTMLInputElement).value)}
                  style="width:36px;height:28px;padding:0;border:1px solid var(--border-soft);border-radius:6px;background:transparent;cursor:pointer"/>
                ${stops.length > 1 ? html`
                  <button class="btn btn--icon btn--ghost btn--sm" @click=${() => this._removeStop(stops, settingsKey, idx)} title="${t("common.remove")}">
                    ${icon("trash", 12)}
                  </button>
                ` : nothing}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _addStop(stops: ColorStop[], key: "color_stops_climate" | "color_stops_boiler") {
    const nonOpen = stops.filter((s) => s.max < 900);
    const lastMax = nonOpen.length ? nonOpen[nonOpen.length - 1].max : 20;
    const next: ColorStop = { max: lastMax + 5, color: "#9ca3af" };
    const open = stops.find((s) => s.max >= 900);
    const newList = [...nonOpen, next];
    if (open) newList.push(open);
    this._updateSetting(key, newList);
  }

  private _removeStop(stops: ColorStop[], key: "color_stops_climate" | "color_stops_boiler", idx: number) {
    const newList = stops.filter((_, i) => i !== idx);
    this._updateSetting(key, newList);
  }

  private _updateStopMax(stops: ColorStop[], key: "color_stops_climate" | "color_stops_boiler", idx: number, value: number) {
    if (isNaN(value)) return;
    const newList = stops.map((s, i) => (i === idx ? { ...s, max: value } : s));
    this._updateSetting(key, newList);
  }

  private _updateStopColor(stops: ColorStop[], key: "color_stops_climate" | "color_stops_boiler", idx: number, color: string) {
    const newList = stops.map((s, i) => (i === idx ? { ...s, color } : s));
    this._updateSetting(key, newList);
  }

  private _updatePresetColor(name: string, color: string) {
    const cur = getPresetColors(this.card._settings);
    this._updateSetting("color_presets", { ...cur, [name]: color });
  }

  private _renderSensorOverrides() {
    const s = this.card._settings!;
    const map: Record<string, string> = (s as any).weather_sensor_map || {};
    const sensors = this.card._sensorEntities || [];

    const overrideable = (this.card._weatherAttributes || []).filter(
      (a) => !a.key.startsWith("forecast.")
    );

    if (!overrideable.length) return nothing;

    const groupedSensors = this._groupSensorsByDeviceClass(sensors);

    return html`
      <div class="field" style="margin-top:8px">
        <label class="field__label">${t("settings.weather.overrides.title")}</label>
        <span class="field__hint" style="margin-bottom:10px;display:block">
          ${t("settings.weather.overrides.hint")}
        </span>
        ${!sensors.length ? html`
          <div style="padding:10px 12px;background:#fef3c7;color:#92400e;border-radius:var(--r-md);font-size:12.5px">
            ${t("settings.weather.overrides.no_sensors")}
          </div>
        ` : nothing}
        <div class="col" style="gap:6px">
          ${overrideable.map((attr) => {
            const current = map[attr.key] || "";
            const sensor = sensors.find((sen: any) => sen.entity_id === current);
            const stateStr = sensor ? `${sensor.state}${sensor.unit_of_measurement ? " " + sensor.unit_of_measurement : ""}` : "";
            const warn = current && sensor ? this._compatWarning(attr, sensor) : "";
            return html`
              <div class="col" style="gap:4px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md)">
                <div class="row" style="gap:10px;align-items:center;flex-wrap:wrap">
                  <div style="min-width:160px">
                    <div class="fw-600 text-sm">${attrLabel(attr.key, attr.label)}</div>
                    <div class="text-xs text-mute mono">${attr.key}${attr.unit ? ` · ${attr.unit}` : ""}</div>
                  </div>
                  <select class="select mono" style="flex:1;min-width:240px"
                    @change=${(e: Event) => this._updateSensorOverride(attr.key, (e.target as HTMLSelectElement).value)}>
                    <option value="" ?selected=${!current}>${t("settings.weather.overrides.use_main")}</option>
                    ${this._renderSensorOptions(groupedSensors, attr, current)}
                  </select>
                  ${current ? html`
                    <span class="mono text-xs" style="color:${warn ? "#b45309" : "var(--text-muted)"};min-width:90px;text-align:right;font-weight:${warn ? 600 : 400}">${stateStr}</span>
                    <button class="btn btn--icon btn--ghost btn--sm" @click=${() => this._updateSensorOverride(attr.key, "")} title="${t("common.remove")}">
                      ${icon("close", 12)}
                    </button>
                  ` : nothing}
                </div>
                ${warn ? html`
                  <div class="text-xs" style="color:#b45309;padding:6px 8px;background:#fef3c7;border-radius:6px;margin-top:2px">
                    ${icon("info", 11)} ${warn}
                  </div>
                ` : nothing}
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _compatWarning(attr: any, sensor: any): string {
    // Confronta unit_of_measurement (se nota) e device_class
    const expectedUnit = (attr.unit || "").trim();
    const sensorUnit = (sensor.unit_of_measurement || "").trim();
    const expectedDC = this._matchingDeviceClass(attr.key);
    const sensorDC = sensor.device_class || "";

    // Enum-typed attributes (condition, rain_state, sun.state) accept any
    // non-numeric string state. We just warn if the user picked a sensor
    // that returns a number — that wouldn't compare meaningfully.
    if (attr.type === "enum") {
      const v = String(sensor.state || "");
      if (v && !isNaN(parseFloat(v))) {
        return t("settings.weather.overrides.warn.numeric_for_condition", { state: v });
      }
      return "";
    }

    // Per attributi numerici: state deve essere parsabile come number
    const v = sensor.state;
    if (v !== undefined && v !== null && v !== "" && isNaN(parseFloat(v))) {
      return t("settings.weather.overrides.warn.not_numeric", { state: String(v) });
    }

    // Unit mismatch
    if (expectedUnit && sensorUnit && expectedUnit !== sensorUnit) {
      return t("settings.weather.overrides.warn.unit_mismatch", {
        expected: expectedUnit,
        got: sensorUnit,
      });
    }

    // device_class mismatch (warning soft)
    if (expectedDC && sensorDC && expectedDC !== sensorDC) {
      return t("settings.weather.overrides.warn.class_mismatch", {
        expected: expectedDC,
        got: sensorDC,
      });
    }

    return "";
  }

  private _groupSensorsByDeviceClass(sensors: any[]): Record<string, any[]> {
    const groups: Record<string, any[]> = {};
    for (const s of sensors) {
      const key = s.device_class || "other";
      (groups[key] = groups[key] || []).push(s);
    }
    return groups;
  }

  private _renderSensorOptions(groups: Record<string, any[]>, attr: any, current: string) {
    const hint = this._matchingDeviceClass(attr.key);
    const order = hint && groups[hint] ? [hint, ...Object.keys(groups).filter((k) => k !== hint).sort()] : Object.keys(groups).sort();

    return order.map((dc) => html`
      <optgroup label="${dc === "other" ? t("settings.weather.overrides.others") : dc}${dc === hint ? " · " + t("settings.weather.overrides.suggested") : ""}">
        ${groups[dc].map((sen: any) => html`
          <option value="${sen.entity_id}" ?selected=${current === sen.entity_id}>
            ${sen.entity_id}${sen.unit_of_measurement ? ` (${sen.unit_of_measurement})` : ""} — ${sen.friendly_name}
          </option>
        `)}
      </optgroup>
    `);
  }

  private _matchingDeviceClass(key: string): string | null {
    // HA device_class hints. Used to pre-rank candidates in the sensor picker
    // and to flag soft "class mismatch" warnings. Keys without a canonical
    // device_class (rain_state for example) are intentionally absent.
    const map: Record<string, string> = {
      temperature: "temperature",
      feels_like: "temperature",
      dew_point: "temperature",
      humidity: "humidity",
      wind_speed: "wind_speed",
      wind_gust: "wind_speed",
      wind_bearing: "wind_direction",
      pressure: "atmospheric_pressure",
      uv_index: "uv_index",
      solar_radiation: "irradiance",
      rain_rate: "precipitation_intensity",
    };
    return map[key] || null;
  }

  private _updateSensorOverride(attrKey: string, sensorId: string) {
    const cur: Record<string, string> = { ...((this.card._settings as any)?.weather_sensor_map || {}) };
    if (sensorId) cur[attrKey] = sensorId;
    else delete cur[attrKey];
    this._updateSetting("weather_sensor_map", cur);
  }

  private _updateSetting(key: string, value: any) {
    this.card.doUpdateSettings({ [key]: value } as any);
  }
}
