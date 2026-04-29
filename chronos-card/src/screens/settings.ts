import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon } from "../icons";
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
    if (!s) return html`<div class="text-mute">Caricamento…</div>`;

    return html`
      <div class="col" style="gap:22px;max-width:980px">
        <div>
          <h1 class="page-title">Impostazioni</h1>
          <p class="page-sub">Parametri globali dell'integrazione Chronos · validi per tutte le schedulazioni</p>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Sorgente meteo</h3><p class="card__sub">Entità HA usata per valutare le regole meteo · puoi anche puntare attributi specifici a sensori puntuali (stazione meteo locale, Ecowitt, …)</p></div></div>
          <div class="col" style="gap:14px">
            <div class="field">
              <label class="field__label">Entità meteo principale</label>
              <select class="select mono"
                @change=${(e: Event) => this._updateSetting("weather_entity", (e.target as HTMLSelectElement).value)}>
                <option value="" ?selected=${!s.weather_entity}>Nessuna</option>
                ${this.card._weatherEntities.map((w) => html`
                  <option value="${w.entity_id}" ?selected=${s.weather_entity === w.entity_id}>${w.entity_id} — ${w.friendly_name}</option>
                `)}
              </select>
              <span class="field__hint">Usata per le forecast.* e come fallback se nessun override è impostato qui sotto</span>
            </div>

            ${this._renderSensorOverrides()}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Comportamento esecuzione</h3><p class="card__sub">Frequenza di aggiornamento e granularità</p></div></div>
          <div class="grid-2">
            <div class="field">
              <label class="field__label">Polling meteo</label>
              <div class="segmented">
                ${[1, 5, 15].map((v) => html`
                  <button data-active="${s.polling_minutes === v}" @click=${() => this._updateSetting("polling_minutes", v)}>${v} min</button>
                `)}
              </div>
              <span class="field__hint">Ogni quanto rivalutare le regole</span>
            </div>
            <div class="field">
              <label class="field__label">Snap timeline</label>
              <div class="segmented">
                ${[15, 30, 60].map((v) => html`
                  <button data-active="${s.snap_minutes === v}" @click=${() => this._updateSetting("snap_minutes", v)}>${v === 60 ? "1 h" : `${v} min`}</button>
                `)}
              </div>
              <span class="field__hint">Granularità nel disegnare le fasce</span>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Notifiche</h3><p class="card__sub">Eventi che vogliono una notifica HA</p></div></div>
          <div class="col" style="gap:0">
            ${([
              ["notify_rule_triggered", "Regola meteo attivata", "Quando una regola override entra in azione"],
              ["notify_sched_skipped", "Schedulazione saltata", "Quando una fascia viene skippata per condizioni meteo"],
              ["notify_command_error", "Errore comando", "Se un dispositivo non risponde"],
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
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Aspetto</h3><p class="card__sub">Tema e densità predefinita</p></div></div>
          <div class="grid-2">
            <div class="field">
              <label class="field__label">Tema</label>
              <div class="segmented">
                ${(["light", "dark", "auto"] as const).map((v) => html`
                  <button data-active="${s.theme === v}" @click=${() => this._updateSetting("theme", v)}>
                    ${{ light: "Chiaro", dark: "Scuro", auto: "Auto" }[v]}
                  </button>
                `)}
              </div>
            </div>
            <div class="field">
              <label class="field__label">Densità</label>
              <div class="segmented">
                ${(["comfortable", "compact"] as const).map((v) => html`
                  <button data-active="${s.density === v}" @click=${() => this._updateSetting("density", v)}>
                    ${{ comfortable: "Comoda", compact: "Compatta" }[v]}
                  </button>
                `)}
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Timeline predefinita</h3><p class="card__sub">Quale variante mostrare di default nell'editor</p></div></div>
          <div class="segmented">
            ${(["linear", "radial", "list"] as const).map((v) => html`
              <button data-active="${s.default_timeline_variant === v}" @click=${() => this._updateSetting("default_timeline_variant", v)}>
                ${{ linear: "Lineare", radial: "Radiale", list: "Lista" }[v]}
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
        <div class="card__header"><div style="flex:1"><h3 class="card__title">Colori dispositivi</h3><p class="card__sub">L'accent del dispositivo riflette il suo stato corrente</p></div></div>

        <div class="col" style="gap:18px">
          <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0;padding:8px 0">
            <div class="device-row__main">
              <div class="device-row__name">Luci · usa colore reale da Home Assistant</div>
              <div class="device-row__meta" style="font-family:var(--font-sans)">Se attivo, l'icona della luce riflette il colore RGB corrente. Altrimenti usa giallo soft.</div>
            </div>
            <label class="switch">
              <input type="checkbox" .checked=${useState}
                @change=${(e: Event) => this._updateSetting("color_light_use_state", (e.target as HTMLInputElement).checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
          </div>

          ${this._renderTempStops(
            "Termostati · gradiente temperatura",
            "Soglia ≤ → colore. La fascia oltre l'ultima soglia usa l'ultimo colore.",
            climateStops,
            "color_stops_climate",
            DEFAULT_TEMP_STOPS_CLIMATE,
          )}

          ${this._renderTempStops(
            "Boiler · gradiente temperatura",
            "Stessa logica del termostato, range tipico 30-75°C.",
            boilerStops,
            "color_stops_boiler",
            DEFAULT_TEMP_STOPS_BOILER,
          )}

          <div>
            <div class="row" style="justify-content:space-between;align-items:flex-end;margin-bottom:8px">
              <div>
                <div class="fw-600" style="font-size:13.5px">Preset modalità (climate)</div>
                <div class="text-xs text-mute">Override del colore quando il termostato è in un preset specifico</div>
              </div>
              <button class="btn btn--sm" @click=${() => this._updateSetting("color_presets", { ...DEFAULT_PRESET_COLORS })}>
                ${icon("repeat", 12)} Reset default
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
              ${icon("plus", 12)} Stop
            </button>
            <button class="btn btn--sm" @click=${() => this._updateSetting(settingsKey, defaults.map((s) => ({ ...s })))}>
              ${icon("repeat", 12)} Default
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
                  <button class="btn btn--icon btn--ghost btn--sm" @click=${() => this._removeStop(stops, settingsKey, idx)} title="Rimuovi">
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

    // Solo gli attributi numerici/condition (le forecast.* richiedono il provider weather)
    const overrideable = (this.card._weatherAttributes || []).filter(
      (a) => !a.key.startsWith("forecast.")
    );

    if (!overrideable.length) return nothing;

    const groupedSensors = this._groupSensorsByDeviceClass(sensors);

    return html`
      <div class="field" style="margin-top:8px">
        <label class="field__label">Override su sensori puntuali</label>
        <span class="field__hint" style="margin-bottom:10px;display:block">
          Per ogni attributo puoi specificare un'entità <span class="mono">sensor.*</span> da cui leggere il valore.
          Se vuoto, viene letto dall'entità weather principale.
        </span>
        <div class="col" style="gap:6px">
          ${overrideable.map((attr) => {
            const current = map[attr.key] || "";
            const sensor = sensors.find((sen: any) => sen.entity_id === current);
            const stateStr = sensor ? `${sensor.state}${sensor.unit_of_measurement ? " " + sensor.unit_of_measurement : ""}` : "";
            return html`
              <div class="row" style="gap:10px;padding:8px 10px;background:var(--bg-sunken);border-radius:var(--r-md);align-items:center;flex-wrap:wrap">
                <div style="min-width:160px">
                  <div class="fw-600 text-sm">${attr.label}</div>
                  <div class="text-xs text-mute mono">${attr.key}${attr.unit ? ` · ${attr.unit}` : ""}</div>
                </div>
                <select class="select mono" style="flex:1;min-width:240px"
                  @change=${(e: Event) => this._updateSensorOverride(attr.key, (e.target as HTMLSelectElement).value)}>
                  <option value="" ?selected=${!current}>— usa entità weather —</option>
                  ${this._renderSensorOptions(groupedSensors, attr, current)}
                </select>
                ${current ? html`
                  <span class="mono text-xs" style="color:var(--text-muted);min-width:90px;text-align:right">${stateStr}</span>
                  <button class="btn btn--icon btn--ghost btn--sm" @click=${() => this._updateSensorOverride(attr.key, "")} title="Rimuovi override">
                    ${icon("close", 12)}
                  </button>
                ` : nothing}
              </div>
            `;
          })}
        </div>
      </div>
    `;
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
    // Prima i sensori con device_class affine all'attributo (hint), poi tutti
    const hint = this._matchingDeviceClass(attr.key);
    const order = hint && groups[hint] ? [hint, ...Object.keys(groups).filter((k) => k !== hint).sort()] : Object.keys(groups).sort();

    return order.map((dc) => html`
      <optgroup label="${dc === "other" ? "Altri sensori" : dc}${dc === hint ? " · suggeriti" : ""}">
        ${groups[dc].map((sen: any) => html`
          <option value="${sen.entity_id}" ?selected=${current === sen.entity_id}>
            ${sen.entity_id}${sen.unit_of_measurement ? ` (${sen.unit_of_measurement})` : ""} — ${sen.friendly_name}
          </option>
        `)}
      </optgroup>
    `);
  }

  private _matchingDeviceClass(key: string): string | null {
    const map: Record<string, string> = {
      temperature: "temperature",
      humidity: "humidity",
      wind_speed: "wind_speed",
      wind_bearing: "wind_direction",
      pressure: "atmospheric_pressure",
      uv_index: "uv_index",
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
