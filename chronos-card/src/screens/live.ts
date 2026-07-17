import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon, weatherIcon } from "../icons";
import { getDeviceColor } from "../device-colors";
import { actionLabel } from "../actions";
import { resolveBlockTime } from "../utils";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import "../timeline";
import "../weather-map";

/** Weather severity buckets for the forecast strip: 0 = fine (green),
 * 1 = degraded (cloudy/fog/wind, yellow), 2 = bad (rain, orange),
 * 3 = severe (storm/hail/snow, red). Unknown conditions land on 1. */
const CONDITION_SEVERITY: Record<string, number> = {
  sunny: 0, "clear-night": 0, partlycloudy: 0,
  cloudy: 1, fog: 1, windy: 1, "windy-variant": 1,
  rainy: 2, pouring: 2,
  lightning: 3, "lightning-rainy": 3, hail: 3,
  snowy: 3, "snowy-rainy": 3, exceptional: 3,
};
const SEVERITY_COLORS = ["var(--ok)", "var(--warn)", "#f97316", "var(--danger)"];

function toKmh(v: number, unit: string): number {
  if (unit === "m/s") return v * 3.6;
  if (unit === "mph") return v * 1.609;
  if (unit === "kn") return v * 1.852;
  return v;
}

/** Wind can only escalate the condition's severity, never lower it.
 * Thresholds in km/h: 30 (awnings/blinds caution), 50 (strong), 70 (gale). */
function severityFor(cond: string, windKmh: number | null): number {
  let sev = CONDITION_SEVERITY[cond] ?? 1;
  if (windKmh !== null) {
    if (windKmh >= 70) sev = Math.max(sev, 3);
    else if (windKmh >= 50) sev = Math.max(sev, 2);
    else if (windKmh >= 30) sev = Math.max(sev, 1);
  }
  return sev;
}

/** Chronos attribute key → possible attribute names on the weather entity.
 * Chronos keys match the rules engine / sensor override map; the aliases
 * cover HA core naming (apparent_temperature, wind_gust_speed) so the hero
 * shows values for standard weather integrations too. */
const ATTR_ALIASES: Record<string, string[]> = {
  temperature: ["temperature"],
  feels_like: ["feels_like", "apparent_temperature"],
  humidity: ["humidity"],
  wind_speed: ["wind_speed"],
  wind_gust: ["wind_gust", "wind_gust_speed"],
  pressure: ["pressure"],
  uv_index: ["uv_index"],
  rain_rate: ["rain_rate", "precipitation"],
};

/** Hero stat chips. warnTh/badTh: |weather − local| thresholds that color
 * the compare badge (green below warnTh, amber, red from badTh). Units are
 * whatever each source reports; thresholds assume the HA defaults (%, km/h,
 * hPa, mm/h), which is also what the rules engine assumes. */
const HERO_STATS: { key: string; label: string; unitAttr: string; defUnit: string; warnTh: number; badTh: number }[] = [
  { key: "humidity", label: "live.stat.humidity", unitAttr: "", defUnit: "%", warnTh: 5, badTh: 12 },
  { key: "wind_speed", label: "live.stat.wind", unitAttr: "wind_speed_unit", defUnit: "km/h", warnTh: 5, badTh: 12 },
  { key: "wind_gust", label: "live.stat.gust", unitAttr: "wind_speed_unit", defUnit: "km/h", warnTh: 8, badTh: 15 },
  { key: "uv_index", label: "live.stat.uv", unitAttr: "", defUnit: "", warnTh: 1, badTh: 2.5 },
  { key: "pressure", label: "live.stat.pressure", unitAttr: "pressure_unit", defUnit: "hPa", warnTh: 2, badTh: 5 },
  { key: "rain_rate", label: "live.stat.rain", unitAttr: "precipitation_unit", defUnit: "mm", warnTh: 0.5, badTh: 2 },
];

const TEMP_WARN_TH = 1;
const TEMP_BAD_TH = 2.5;

type Source = "weather" | "local" | "compare";

function fmtNum(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}

function fmtDur(ms: number): string {
  const m = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(m / 60);
  return h > 0 ? `${h}h ${String(m % 60).padStart(2, "0")}m` : `${m}m`;
}

function fmtClock(d: Date): string {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

@customElement("chronos-live")
export class ChronosLive extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  @state() private _source: Source = "weather";
  @state() private _selHour = 0;

  render() {
    const { _schedules: schedules, _devices: devices, _forecast: forecast, _settings: settings } = this.card;
    const weatherEntity = settings?.weather_entity || "";
    const weatherState = weatherEntity ? this.card.hass?.states?.[weatherEntity] : null;
    const sensorMap: Record<string, string> = (settings as any)?.weather_sensor_map || {};
    const hasLocal = Object.keys(sensorMap).some((k) => this._localVal(k) !== null);
    const source: Source = hasLocal ? this._source : "weather";

    const condition = weatherState?.state || "cloud";
    const windUnit = weatherState?.attributes?.wind_speed_unit || "km/h";

    // Backend convention: days[0] = Monday (Python weekday()). JS getDay()
    // is 0 = Sunday, hence the +6 rotation. A schedule that doesn't run
    // today (day mask or date_range) must not show an "active" block.
    const weekday = (new Date().getDay() + 6) % 7;
    const liveSchedules = schedules.filter((s) => s.enabled).map((s) => {
      const today = !!(s.days?.[weekday] ?? 1) && this._inDateRange(s);
      const active = today
        ? s.blocks.find((b) => {
            const st = resolveBlockTime(b, "start");
            const en = resolveBlockTime(b, "end");
            return this.nowHour >= st && this.nowHour < en;
          })
        : undefined;
      return { schedule: s, active, today };
    });

    const homeZone = this.card.hass?.states?.["zone.home"];
    const lat = homeZone?.attributes?.latitude;
    const lon = homeZone?.attributes?.longitude;
    const mapEnabled = (settings as any)?.live_map !== false && typeof lat === "number" && typeof lon === "number";
    const isDark = settings?.theme === "dark"
      || (settings?.theme !== "light" && !!this.card.hass?.themes?.darkMode);

    return html`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">${t("screen.live.title")}</h1>
            <p class="page-sub">${weatherEntity ? t("live.weather.subtitle", { entity: weatherEntity }) : t("live.no_weather")}</p>
          </div>
          <div class="row">
            <span class="chip chip--on"><span class="chip__dot"></span>${t("schedule.active")}</span>
          </div>
        </div>

        <!-- Hero: current conditions + sun arc -->
        <div class="grid-2" style="align-items:stretch">
          ${this._renderHero(weatherState, weatherEntity, condition, sensorMap, hasLocal, source)}
          ${this._renderSunCard()}
        </div>

        <!-- Interactive 24h strip -->
        ${forecast.length ? this._renderHourly(forecast, windUnit) : nothing}

        <!-- Live schedules: kept above the map so the "what is Chronos
             doing right now" answer never scrolls below a 380px map. -->
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("live.schedules.title")}</h3><p class="card__sub">${liveSchedules.filter((l) => l.active).length}</p></div></div>
          <div class="col" style="gap:12px">
            ${liveSchedules.map(({ schedule, active, today }) => html`
              <div class="card card--ghost" style="padding:14px;opacity:${today ? 1 : 0.65}">
                <div class="sp-between" style="margin-bottom:10px">
                  <div class="row" style="gap:10px">
                    <span style="width:8px;height:8px;border-radius:50%;background:${active ? "var(--ok)" : "var(--text-muted)"};box-shadow:${active ? "0 0 0 4px color-mix(in srgb, var(--ok) 25%, transparent)" : "none"}"></span>
                    <strong>${schedule.name}</strong>
                    ${active
                      ? html`<span class="chip chip--accent">${actionLabel(schedule.device_type, active.action)}</span>`
                      : html`<span class="chip">${today ? t("schedule.next_block") : t("live.not_today")}</span>`}
                  </div>
                  <button class="btn btn--sm btn--ghost" @click=${() => this.card.selectSchedule(schedule.id, "editor")}>
                    ${t("device.open_schedule")} ${icon("chevron-right", 12)}
                  </button>
                </div>
                <chronos-timeline variant="linear" .deviceType=${schedule.device_type} .blocks=${schedule.blocks} .interactive=${false} height="compact" .showWeather=${false} .now=${today ? this.nowHour : null}></chronos-timeline>
              </div>
            `)}
          </div>
        </div>

        <!-- Weather map -->
        ${mapEnabled ? html`
          <div class="card">
            <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("live.map.title")}</h3><p class="card__sub">${t("live.map.subtitle")}</p></div></div>
            <chronos-weather-map .lat=${lat} .lon=${lon}
              .owmKey=${(settings as any)?.owm_api_key || ""} .dark=${isDark}></chronos-weather-map>
          </div>
        ` : nothing}

        <!-- Devices live -->
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("live.devices.title")}</h3><p class="card__sub">${t("live.devices.subtitle")}</p></div></div>
          <div class="col" style="gap:0">
            ${devices.map((d) => {
              const state = this.card.hass?.states?.[d.entity_id];
              const color = getDeviceColor(d, state, this.card._settings);
              const barPct = this._computeBarPercent(d, state);
              return html`
                <div class="live-device">
                  <div class="device-row__icon" style="width:36px;height:36px;background:${color.soft};color:${color.accent}">${deviceIcon(d.type, 17)}</div>
                  <div class="device-row__main">
                    <div class="device-row__name">${d.alias}</div>
                    <div class="device-row__meta">${d.area}</div>
                  </div>
                  <div class="live-device__bar"><div style="width:${barPct}%;background:${color.accent}"></div></div>
                  <span class="mono text-sm" style="width:64px;text-align:right;color:${color.live ? color.accent : "var(--text-muted)"};font-weight:600">${this._formatState(d, state)}</span>
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------- hero

  private _renderHero(
    weatherState: any,
    weatherEntity: string,
    condition: string,
    sensorMap: Record<string, string>,
    hasLocal: boolean,
    source: Source,
  ) {
    const wTemp = this._weatherVal(weatherState, "temperature");
    const lTemp = this._localVal("temperature");
    const feels = source === "local"
      ? this._localVal("feels_like") ?? this._weatherVal(weatherState, "feels_like")
      : this._weatherVal(weatherState, "feels_like");
    const tempUnit = weatherState?.attributes?.temperature_unit || "°C";

    const bigTemp =
      source === "local" ? lTemp :
      wTemp;

    const note =
      source === "local" ? t("live.source.note.local") :
      source === "compare" ? t("live.source.note.compare") :
      weatherEntity ? t("live.weather.subtitle", { entity: weatherEntity }) : t("live.no_weather");

    return html`
      <div class="lv-hero">
        ${hasLocal ? html`
          <div class="row" style="gap:6px;margin-bottom:12px">
            ${(["weather", "local", "compare"] as Source[]).map((s) => html`
              <button class="lv-src" data-on=${source === s ? "1" : "0"} @click=${() => { this._source = s; }}>
                ${t("live.source." + s)}
              </button>
            `)}
          </div>
        ` : nothing}
        <div class="row" style="gap:14px;align-items:flex-start">
          <div class="lv-hero__icon">${weatherIcon(condition, 30)}</div>
          <div style="flex:1">
            <div class="lv-temp">
              ${source === "compare" && wTemp !== null && lTemp !== null ? html`
                ${fmtNum(wTemp)}°<span class="lv-temp__alt">/ ${fmtNum(lTemp)}°</span>${this._delta(wTemp, lTemp, TEMP_WARN_TH, TEMP_BAD_TH)}
              ` : bigTemp !== null ? html`
                ${fmtNum(bigTemp)}<span style="font-size:20px;color:var(--text-muted)">${tempUnit}</span>
              ` : "—"}
            </div>
            <div class="lv-cond">
              ${this._conditionLabel(condition)}${feels !== null ? html` · ${t("live.feels_like", { v: fmtNum(feels) + "°" })}` : nothing}
            </div>
          </div>
        </div>
        <div class="lv-stats">
          ${HERO_STATS.map((def) => this._renderStat(weatherState, sensorMap, def, source))}
        </div>
        <div class="page-sub" style="margin-top:10px">${note}</div>
      </div>
    `;
  }

  private _renderStat(
    weatherState: any,
    sensorMap: Record<string, string>,
    def: { key: string; label: string; unitAttr: string; defUnit: string; warnTh: number; badTh: number },
    source: Source,
  ) {
    const w = this._weatherVal(weatherState, def.key);
    const l = this._localVal(def.key);
    if (w === null && l === null) return nothing;
    const unit = (def.unitAttr && weatherState?.attributes?.[def.unitAttr])
      || this._localUnit(sensorMap[def.key])
      || def.defUnit;

    if (source === "compare") {
      return html`
        <div class="lv-stat">
          <span class="lbl">${t(def.label)}</span>
          <b>${w !== null ? `${fmtNum(w)}${unit ? ` ${unit}` : ""}` : "—"}</b>
          <span class="cmp">
            ${t("live.source.local_short")} ${l !== null ? fmtNum(l) : "—"}
            ${w !== null && l !== null ? this._delta(w, l, def.warnTh, def.badTh) : nothing}
          </span>
        </div>
      `;
    }
    const v = source === "local" ? l : w;
    return html`
      <div class="lv-stat">
        <span class="lbl">${t(def.label)}</span>
        <b>${v !== null ? `${fmtNum(v)}${unit ? ` ${unit}` : ""}` : "—"}</b>
      </div>
    `;
  }

  /** Compare badge: local − weather, colored by |delta| thresholds. */
  private _delta(w: number, l: number, warnTh: number, badTh: number) {
    const d = Math.abs(w - l);
    const lvl = d >= badTh ? "bad" : d >= warnTh ? "warn" : "ok";
    const sign = l > w ? "+" : l < w ? "−" : "±";
    return html`<span class="lv-delta" data-lvl=${lvl}>${sign}${d.toFixed(1)}</span>`;
  }

  private _weatherVal(weatherState: any, key: string): number | null {
    const attrs = weatherState?.attributes;
    if (!attrs) return null;
    for (const alias of ATTR_ALIASES[key] || [key]) {
      const v = attrs[alias];
      if (typeof v === "number" && isFinite(v)) return v;
    }
    return null;
  }

  private _localVal(key: string): number | null {
    const map: Record<string, string> = (this.card._settings as any)?.weather_sensor_map || {};
    const id = map[key];
    if (!id) return null;
    const st = this.card.hass?.states?.[id];
    if (!st || st.state === "unknown" || st.state === "unavailable") return null;
    const v = parseFloat(st.state);
    return isNaN(v) ? null : v;
  }

  private _localUnit(sensorId?: string): string {
    if (!sensorId) return "";
    return this.card.hass?.states?.[sensorId]?.attributes?.unit_of_measurement || "";
  }

  // ------------------------------------------------------------- sun card

  private _renderSunCard() {
    const sun = this.card.hass?.states?.["sun.sun"];
    if (!sun) return html`<div></div>`;
    const now = Date.now();
    const nr = Date.parse(sun.attributes?.next_rising || "");
    const ns = Date.parse(sun.attributes?.next_setting || "");
    if (isNaN(nr) || isNaN(ns)) return html`<div></div>`;

    const day = sun.state === "above_horizon";
    // next_rising/next_setting are the FUTURE events. During the day the
    // rising already happened, so today's sunrise ≈ next_rising − 24h
    // (drifts by the day-over-day sunrise shift, ±2 min — fine for an arc).
    // At night the next event is always a rising, so [nr, ns] is exactly
    // the coming day's window: show it with the sun parked at the start.
    let sunrise: number, sunset: number, frac: number;
    if (day) {
      sunrise = nr - 86400000;
      sunset = ns;
      frac = Math.min(1, Math.max(0, (now - sunrise) / (sunset - sunrise)));
    } else {
      sunrise = nr;
      sunset = ns;
      frac = 0;
    }

    const sx = 100 - 80 * Math.cos(Math.PI * frac);
    const sy = 95 - 80 * Math.sin(Math.PI * frac);
    const daylight = fmtDur(sunset - sunrise);
    const countdown = day
      ? t("live.sun.to_sunset", { v: fmtDur(ns - now) })
      : t("live.sun.to_sunrise", { v: fmtDur(nr - now) });

    return html`
      <div class="card">
        <div class="card__header">
          <div style="flex:1">
            <h3 class="card__title">${t("live.sun.title")}</h3>
            <p class="card__sub">${t("editor.block.sunrise")} ${fmtClock(new Date(sunrise))} · ${t("editor.block.sunset")} ${fmtClock(new Date(sunset))}</p>
          </div>
          <span class="chip">${t("live.sun.daylight", { v: daylight })}</span>
        </div>
        <svg viewBox="0 0 200 112" style="width:100%;display:block" role="img">
          <path d="M20,95 A80,80 0 0 1 180,95" fill="none" stroke="var(--border)" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/>
          <line x1="8" y1="95" x2="192" y2="95" stroke="var(--border)" stroke-width="1"/>
          ${day ? html`
            <circle cx=${sx} cy=${sy} r="7" fill="var(--weather)" />
            <circle cx=${sx} cy=${sy} r="11" fill="var(--weather)" opacity="0.25"/>
          ` : html`
            <g transform="translate(92,32)" style="color:var(--text-muted)">${icon("moon", 16)}</g>
          `}
        </svg>
        <div class="row" style="justify-content:center;margin-top:2px">
          <span class="chip chip--weather">${icon(day ? "sun" : "moon", 11)} ${countdown}</span>
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------- hourly strip

  private _renderHourly(forecast: any[], windUnit: string) {
    const hours = forecast.slice(0, 24);
    const sel = Math.min(this._selHour, hours.length - 1);
    const temps = hours.map((w) => (typeof w.temperature === "number" ? w.temperature : null)).filter((v): v is number => v !== null);
    const tMin = temps.length ? Math.min(...temps) : 0;
    const tMax = temps.length ? Math.max(...temps) : 1;
    const cur = hours[sel];

    return html`
      <div class="card">
        <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("live.hourly.title")}</h3><p class="card__sub">${t("live.hourly.hint")}</p></div></div>
        <div class="lv-hours">
          ${hours.map((w, i) => {
            const h = new Date(w.datetime || "").getHours?.() ?? 0;
            const cond = w.condition || "cloud";
            const wind = typeof w.wind_speed === "number" ? w.wind_speed : null;
            const sev = severityFor(cond, wind !== null ? toKmh(wind, windUnit) : null);
            const c = SEVERITY_COLORS[sev];
            const temp = typeof w.temperature === "number" ? w.temperature : null;
            const barH = temp !== null && tMax > tMin ? 5 + 13 * ((temp - tMin) / (tMax - tMin)) : 5;
            const rain = typeof w.precipitation === "number" && w.precipitation > 0 ? w.precipitation : null;
            return html`
              <button class="lv-hour" data-sel=${i === sel ? "1" : "0"} @click=${() => { this._selHour = i; }}>
                <div class="h mono">${String(h).padStart(2, "0")}</div>
                <div class="ic" style="color:${c}">${weatherIcon(cond, 16)}</div>
                <div class="tp mono">${temp !== null ? Math.round(temp) + "°" : "—"}</div>
                <div class="bar" style="height:${barH.toFixed(0)}px;background:${c}"></div>
                <div class="rn mono">${rain !== null ? fmtNum(rain) : ""}</div>
              </button>
            `;
          })}
        </div>
        ${cur ? html`
          <div class="lv-detail">
            <span><b>${String(new Date(cur.datetime || "").getHours?.() ?? 0).padStart(2, "0")}:00</b> · ${this._conditionLabel(cur.condition || "")}</span>
            ${typeof cur.temperature === "number" ? html`<span>${icon("temp", 12)} <b>${fmtNum(cur.temperature)}°</b></span>` : nothing}
            ${typeof cur.precipitation === "number" ? html`<span>${icon("rain", 12)} <b>${fmtNum(cur.precipitation)} mm</b>${typeof cur.precipitation_probability === "number" ? html` · ${cur.precipitation_probability}% ${t("live.hourly.rain_prob")}` : nothing}</span>` : nothing}
            ${typeof cur.wind_speed === "number" ? html`<span>${icon("wind", 12)} <b>${Math.round(cur.wind_speed)} ${windUnit}</b></span>` : nothing}
            ${typeof cur.humidity === "number" ? html`<span>${icon("droplet", 12)} <b>${Math.round(cur.humidity)}%</b></span>` : nothing}
          </div>
        ` : nothing}
      </div>
    `;
  }

  // ------------------------------------------------------------- helpers

  /** Mirror of the backend's _is_in_date_range: year-agnostic month/day
   * range, wrapping across year-end when start > end. */
  private _inDateRange(s: any): boolean {
    const dr = s.date_range;
    if (!dr) return true;
    const sm = dr.start_month, sd = dr.start_day, em = dr.end_month, ed = dr.end_day;
    if (!(sm && sd && em && ed)) return true;
    const now = new Date();
    const cur = (now.getMonth() + 1) * 100 + now.getDate();
    const start = sm * 100 + sd;
    const end = em * 100 + ed;
    if (start <= end) return start <= cur && cur <= end;
    return cur >= start || cur <= end;
  }

  private _computeBarPercent(d: any, state: any): number {
    if (!state) return 0;
    const a = state.attributes || {};
    if (d.type === "light") {
      const b = a.brightness;
      if (typeof b === "number") return Math.round((b / 255) * 100);
      return state.state === "on" ? 100 : 0;
    }
    if (d.type === "fan") return typeof a.percentage === "number" ? a.percentage : 0;
    if (d.type === "blind") return typeof a.current_position === "number" ? a.current_position : 0;
    if (d.type === "thermostat" || d.type === "boiler") {
      const t = a.current_temperature ?? a.temperature;
      if (typeof t === "number") return Math.min(100, Math.max(0, ((t - 5) / 30) * 100));
    }
    return state.state === "on" || state.state === "open" ? 100 : 0;
  }

  private _formatState(d: any, state: any): string {
    if (!state) return "—";
    const a = state.attributes || {};
    if (d.type === "thermostat" || d.type === "boiler") {
      const t = a.current_temperature ?? a.temperature;
      if (typeof t === "number") return `${t.toFixed(1)}°`;
    }
    if (d.type === "fan" && typeof a.percentage === "number") return `${a.percentage}%`;
    if (d.type === "blind" && typeof a.current_position === "number") return `${a.current_position}%`;
    if (d.type === "light" && state.state === "on" && typeof a.brightness === "number") {
      return `${Math.round((a.brightness / 255) * 100)}%`;
    }
    return state.state;
  }

  private _conditionLabel(condition: string): string {
    const key = `live.condition.${condition}`;
    const out = t(key);
    return out === key ? condition : out;
  }
}
