import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon, weatherIcon } from "../icons";
import { getDeviceColor } from "../device-colors";
import { actionLabel } from "../actions";
import { fmtHour, resolveBlockTime } from "../utils";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import "../timeline";

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

@customElement("chronos-live")
export class ChronosLive extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  render() {
    const { _schedules: schedules, _devices: devices, _forecast: forecast, _settings: settings } = this.card;
    const weatherEntity = settings?.weather_entity || "";
    const weatherState = weatherEntity ? this.card.hass?.states?.[weatherEntity] : null;

    const temp = weatherState?.attributes?.temperature ?? "—";
    const tempUnit = weatherState?.attributes?.temperature_unit || "°C";
    const condition = weatherState?.state || "cloud";
    const humidity = weatherState?.attributes?.humidity ?? "—";
    const windSpeed = weatherState?.attributes?.wind_speed ?? "—";
    const windUnit = weatherState?.attributes?.wind_speed_unit || "km/h";
    const heroColor = SEVERITY_COLORS[severityFor(
      condition,
      typeof windSpeed === "number" ? toKmh(windSpeed, windUnit) : null,
    )];

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

        <!-- Weather hero -->
        <div class="grid-2">
          <div class="weather-hero">
            <div class="weather-hero__icon" style="color:${heroColor};background:color-mix(in srgb, ${heroColor} 16%, var(--surface))">${weatherIcon(condition, 32)}</div>
            <div>
              <div class="weather-hero__temp">${temp}<span style="font-size:16px;color:var(--text-muted)">${tempUnit}</span></div>
              <div class="weather-hero__cond">${this._conditionLabel(condition)}</div>
            </div>
            <div class="col" style="gap:4px;align-items:flex-end">
              <span class="chip">${icon("droplet", 11)} ${humidity}%</span>
              <span class="chip">${icon("wind", 11)} ${windSpeed} ${windUnit}</span>
            </div>
          </div>

          <div class="card">
            <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("live.forecast.title")}</h3><p class="card__sub">${t("live.forecast.title")}</p></div></div>
            <div class="forecast-row">
              ${forecast.filter((_, i) => i % 2 === 0).slice(0, 12).map((w) => {
                const h = new Date(w.datetime || "").getHours?.() ?? 0;
                const cond = w.condition || "cloud";
                const wind = typeof w.wind_speed === "number" ? w.wind_speed : null;
                const sev = severityFor(cond, wind !== null ? toKmh(wind, windUnit) : null);
                const c = SEVERITY_COLORS[sev];
                return html`
                  <div class="forecast-cell"
                    style="background:color-mix(in srgb, ${c} 10%, var(--bg-sunken));border-color:color-mix(in srgb, ${c} 30%, transparent)"
                    title="${this._conditionLabel(cond)}${wind !== null ? ` · ${Math.round(wind)} ${windUnit}` : ""}">
                    <div class="forecast-cell__hour">${String(h).padStart(2, "0")}</div>
                    <div class="forecast-cell__icon" style="color:${c}">${weatherIcon(cond, 20)}</div>
                    <div class="forecast-cell__temp">${w.temperature ?? "—"}°</div>
                    ${wind !== null ? html`<div class="forecast-cell__wind">${icon("wind", 9)} ${Math.round(wind)}</div>` : nothing}
                  </div>
                `;
              })}
            </div>
          </div>
        </div>

        <!-- Live schedules -->
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

        <!-- Devices live -->
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("live.devices.title")}</h3><p class="card__sub">${t("live.devices.subtitle")}</p></div></div>
          <div class="col" style="gap:0">
            ${devices.map((d) => {
              const state = this.card.hass?.states?.[d.entity_id];
              const stateStr = state?.state || "—";
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
