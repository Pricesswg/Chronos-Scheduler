import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { getDeviceColor } from "../device-colors";
import { actionColor } from "../actions";
import { fmtHour, computeRepeat } from "../utils";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import "../timeline";

@customElement("chronos-overview")
export class ChronosOverview extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  render() {
    const { _schedules: schedules, _devices: devices } = this.card;
    const total = schedules.length;
    const active = schedules.filter((s) => s.enabled).length;
    const weatherRules = schedules.reduce(
      (n, s) => n + (s.weather_rules || []).filter((r) => r.active).length,
      0
    );

    return html`
      <div class="col" style="gap:22px">
        <div>
          <h1 class="page-title">${t("screen.overview.title")}</h1>
          <p class="page-sub">${t("overview.subtitle", { n: active, tot: total })}</p>
        </div>

        <div class="grid-3">
          <div class="kpi">
            <div class="kpi__label">${t("overview.kpi.active")}</div>
            <div class="kpi__value">${active}<span class="text-mute" style="font-size:16px;margin-left:6px">/${total}</span></div>
            <div class="kpi__delta">${devices.length} ${t("overview.kpi.devices").toLowerCase()}</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${t("overview.kpi.weather_rules")}</div>
            <div class="kpi__value">${weatherRules}</div>
            <div class="kpi__delta">${t("device.state.live")}</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${t("overview.kpi.now")}</div>
            <div class="kpi__value">${fmtHour(this.nowHour)}</div>
            <div class="kpi__delta">${t("device.state.live")}</div>
          </div>
        </div>

        <div class="sp-between">
          <div class="row">
            <h2 style="margin:0;font-size:16px;font-weight:600;letter-spacing:-0.01em">${t("nav.overview")}</h2>
            <span class="tag mono">${total}</span>
          </div>
          <div class="row">
            <button class="btn" @click=${() => this.card.navigate("week")}>${icon("calendar", 14)} ${t("nav.week")}</button>
            <button class="btn btn--primary" @click=${() => this.card.navigate("wizard")}>${icon("plus", 14)} ${t("nav.new_schedule")}</button>
          </div>
        </div>

        <div class="grid-auto">
          ${schedules.map((s) => {
            const devs = (s.device_ids || []).map((id) => devices.find((d) => d.id === id)).filter(Boolean);
            const activeRules = (s.weather_rules || []).filter((r) => r.active).length;
            return html`
              <div class="sched-card" data-selected="${s.id === this.card._selectedId}"
                @click=${() => this.card.selectSchedule(s.id, "editor")}>
                <div class="sched-card__header">
                  <div style="flex:1;min-width:0">
                    <h3 class="sched-card__title">${s.name}</h3>
                    <div class="sched-card__sub">${computeRepeat(s.days)} · ${s.blocks.length}</div>
                  </div>
                  <label class="switch" @click=${(e: Event) => e.stopPropagation()}>
                    <input type="checkbox" .checked=${s.enabled} @change=${(e: Event) => {
                      this.card.doToggleSchedule(s.id, (e.target as HTMLInputElement).checked);
                    }}/>
                    <span class="switch__track"></span>
                    <span class="switch__thumb"></span>
                  </label>
                </div>

                <chronos-timeline
                  variant="linear"
                  .deviceType=${s.device_type}
                  .blocks=${s.blocks}
                  .now=${s.enabled ? this.nowHour : null}
                  .interactive=${false}
                  height="compact"
                  .showWeather=${false}
                ></chronos-timeline>

                <div class="sched-card__footer">
                  <div class="sched-card__devices">
                    ${devs.slice(0, 5).map((d: any) => {
                      const c = getDeviceColor(d, this.card.hass?.states?.[d.entity_id], this.card._settings);
                      return html`<div class="device-icon-pill" title="${d.alias}" style="background:${c.soft};color:${c.accent}">${deviceIcon(d.type, 14)}</div>`;
                    })}
                    ${devs.length > 5 ? html`<div class="device-icon-pill mono" style="font-size:10px">+${devs.length - 5}</div>` : nothing}
                  </div>
                  <div style="flex:1"></div>
                  ${activeRules > 0 ? html`<span class="chip chip--weather">${icon("cloud", 11)} ${t("overview.rules_count", { n: activeRules })}</span>` : nothing}
                  <span class="chip ${s.enabled ? "chip--on" : ""}"><span class="chip__dot"></span>${s.enabled ? t("schedule.active") : t("schedule.disabled")}</span>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}
