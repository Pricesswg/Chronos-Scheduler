import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon, weatherIcon } from "../icons";
import { getDeviceColor } from "../device-colors";
import { actionLabel } from "../actions";
import { fmtHour } from "../utils";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import "../timeline";

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
    const condition = weatherState?.state || "cloud";
    const humidity = weatherState?.attributes?.humidity ?? "—";
    const windSpeed = weatherState?.attributes?.wind_speed ?? "—";

    const liveSchedules = schedules.filter((s) => s.enabled).map((s) => {
      const active = s.blocks.find((b) => this.nowHour >= b.start && this.nowHour < b.end);
      return { schedule: s, active };
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
            <div class="weather-hero__icon">${weatherIcon(condition, 32)}</div>
            <div>
              <div class="weather-hero__temp">${temp}°<span style="font-size:16px;color:var(--text-muted)">C</span></div>
              <div class="weather-hero__cond">${this._conditionLabel(condition)}</div>
            </div>
            <div class="col" style="gap:4px;align-items:flex-end">
              <span class="chip">${icon("droplet", 11)} ${humidity}%</span>
              <span class="chip">${icon("wind", 11)} ${windSpeed} km/h</span>
            </div>
          </div>

          <div class="card">
            <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("live.forecast.title")}</h3><p class="card__sub">${t("live.forecast.title")}</p></div></div>
            <div class="forecast-row">
              ${forecast.filter((_, i) => i % 2 === 0).slice(0, 12).map((w) => {
                const h = new Date(w.datetime || "").getHours?.() ?? 0;
                const cond = w.condition || "cloud";
                return html`
                  <div class="forecast-cell">
                    <div class="forecast-cell__hour">${String(h).padStart(2, "0")}</div>
                    <div class="forecast-cell__icon">${weatherIcon(cond, 20)}</div>
                    <div class="forecast-cell__temp">${w.temperature ?? "—"}°</div>
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
            ${liveSchedules.map(({ schedule, active }) => html`
              <div class="card card--ghost" style="padding:14px">
                <div class="sp-between" style="margin-bottom:10px">
                  <div class="row" style="gap:10px">
                    <span style="width:8px;height:8px;border-radius:50%;background:${active ? "var(--ok)" : "var(--text-muted)"};box-shadow:${active ? "0 0 0 4px color-mix(in srgb, var(--ok) 25%, transparent)" : "none"}"></span>
                    <strong>${schedule.name}</strong>
                    ${active
                      ? html`<span class="chip chip--accent">${actionLabel(schedule.device_type, active.action)}</span>`
                      : html`<span class="chip">${t("schedule.next_block")}</span>`}
                  </div>
                  <button class="btn btn--sm btn--ghost" @click=${() => this.card.selectSchedule(schedule.id, "editor")}>
                    ${t("device.open_schedule")} ${icon("chevron-right", 12)}
                  </button>
                </div>
                <chronos-timeline variant="linear" .deviceType=${schedule.device_type} .blocks=${schedule.blocks} .interactive=${false} height="compact" .showWeather=${false} .now=${this.nowHour}></chronos-timeline>
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
