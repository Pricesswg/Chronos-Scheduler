import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon, weatherIcon } from "../icons";
import { actionLabel } from "../actions";
import { fmtHour } from "../utils";
import type { ChronosCard } from "../chronos-card";
import "../timeline";

@customElement("chronos-live")
export class ChronosLive extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false }) card!: ChronosCard;
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
            <h1 class="page-title">Stato live</h1>
            <p class="page-sub">Cosa sta facendo ora il sistema</p>
          </div>
          <div class="row">
            <span class="chip chip--on"><span class="chip__dot"></span>In esecuzione</span>
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
            <div class="card__header"><div style="flex:1"><h3 class="card__title">Previsione 24h</h3><p class="card__sub">Forecast orario</p></div></div>
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
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Schedulazioni live</h3><p class="card__sub">${liveSchedules.filter((l) => l.active).length} fasce attive ora</p></div></div>
          <div class="col" style="gap:12px">
            ${liveSchedules.map(({ schedule, active }) => html`
              <div class="card card--ghost" style="padding:14px">
                <div class="sp-between" style="margin-bottom:10px">
                  <div class="row" style="gap:10px">
                    <span style="width:8px;height:8px;border-radius:50%;background:${active ? "var(--ok)" : "var(--text-muted)"};box-shadow:${active ? "0 0 0 4px color-mix(in srgb, var(--ok) 25%, transparent)" : "none"}"></span>
                    <strong>${schedule.name}</strong>
                    ${active
                      ? html`<span class="chip chip--accent">${actionLabel(schedule.device_type, active.action)}</span>`
                      : html`<span class="chip">In attesa</span>`}
                  </div>
                  <button class="btn btn--sm btn--ghost" @click=${() => this.card.selectSchedule(schedule.id, "editor")}>
                    Apri ${icon("chevron-right", 12)}
                  </button>
                </div>
                <chronos-timeline variant="linear" .deviceType=${schedule.device_type} .blocks=${schedule.blocks} .interactive=${false} height="compact" .showWeather=${false} .now=${this.nowHour}></chronos-timeline>
              </div>
            `)}
          </div>
        </div>

        <!-- Devices live -->
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Dispositivi · stato live</h3><p class="card__sub">Valori in tempo reale</p></div></div>
          <div class="col" style="gap:0">
            ${devices.map((d) => {
              const state = this.card.hass?.states?.[d.entity_id];
              const stateStr = state?.state || "—";
              return html`
                <div class="live-device">
                  <div class="device-row__icon" style="width:36px;height:36px">${deviceIcon(d.type, 17)}</div>
                  <div class="device-row__main">
                    <div class="device-row__name">${d.alias}</div>
                    <div class="device-row__meta">${d.area}</div>
                  </div>
                  <div class="live-device__bar"><div style="width:0%"></div></div>
                  <span class="mono text-sm" style="width:64px;text-align:right">${stateStr}</span>
                </div>
              `;
            })}
          </div>
        </div>
      </div>
    `;
  }

  private _conditionLabel(condition: string): string {
    const map: Record<string, string> = {
      sunny: "Soleggiato",
      rainy: "Pioggia",
      cloudy: "Nuvoloso",
      partlycloudy: "Parzialmente nuvoloso",
      snowy: "Neve",
      fog: "Nebbia",
      windy: "Ventoso",
    };
    return map[condition] || condition;
  }
}
