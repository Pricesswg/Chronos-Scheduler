import { LitElement, html, svg, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { DEVICE_TYPES, computeRepeat } from "../utils";
import { getDeviceColor } from "../device-colors";
import { t, deviceTypeLabel } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import "../timeline";

@customElement("chronos-device-screen")
export class ChronosDeviceScreen extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  render() {
    const device = this.card._devices.find((d) => d.id === this.card._deviceDetailId) || this.card._devices[0];
    if (!device) return html`<div style="text-align:center;padding:40px;color:var(--text-muted)">
      <div style="font-weight:600;font-size:14px">${t("device.no_device.title")}</div>
      <div style="font-size:12.5px;margin-top:4px">${t("device.no_device.hint")}</div>
    </div>`;

    const def = DEVICE_TYPES[device.type] || { label: device.type, domain: "", capabilities: [] };
    const linkedSchedules = this.card._schedules.filter((s) => s.device_ids.includes(device.id));
    const state = this.card.hass?.states?.[device.entity_id];
    const stateStr = state?.state || "—";

    return html`
      <div class="col" style="gap:18px">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${() => this.card.navigate("overview")}>
            ${icon("chevron-left", 14)} ${t("common.back")}
          </button>
        </div>

        <div class="row" style="gap:16px">
          <div style="width:60px;height:60px;border-radius:16px;background:${getDeviceColor(device, state, this.card._settings).soft};color:${getDeviceColor(device, state, this.card._settings).accent};display:grid;place-items:center">
            ${deviceIcon(device.type, 28)}
          </div>
          <div style="flex:1">
            <h1 class="page-title" style="margin-bottom:2px">${device.alias}</h1>
            <p class="page-sub mono" style="margin-bottom:0">${device.entity_id} · ${device.area}</p>
          </div>
          <select class="select" style="width:240px"
            @change=${(e: Event) => this.card.selectDevice((e.target as HTMLSelectElement).value)}>
            ${this.card._devices.map((d) => html`<option value="${d.id}" ?selected=${d.id === device.id}>${d.alias}</option>`)}
          </select>
        </div>

        <div class="grid-3">
          <div class="kpi"><div class="kpi__label">${t("device.state")}</div><div class="kpi__value">${stateStr}</div><div class="kpi__delta">${t("device.state.live")}</div></div>
          <div class="kpi"><div class="kpi__label">${t("device.type")}</div><div class="kpi__value" style="font-size:20px">${deviceTypeLabel(device.type, def.label)}</div><div class="kpi__delta mono">${def.domain}</div></div>
          <div class="kpi"><div class="kpi__label">${t("device.linked_schedules")}</div><div class="kpi__value">${linkedSchedules.length}</div><div class="kpi__delta">${t("device.linked_schedules.active", { n: linkedSchedules.filter((s) => s.enabled).length })}</div></div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("device.capabilities")}</h3><p class="card__sub">${t("device.capabilities.subtitle")}</p></div></div>
          <div class="row" style="gap:6px;flex-wrap:wrap">
            ${(def.capabilities || []).map((c) => html`<span class="rule-token mono">${def.domain}.${c}</span>`)}
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("device.schedules_using.title")}</h3><p class="card__sub">${t("device.schedules_using.subtitle", { n: linkedSchedules.length })}</p></div></div>
          ${!linkedSchedules.length
            ? html`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
                <div style="font-weight:600;color:var(--text);font-size:14px">${t("device.no_schedules")}</div>
                <div style="font-size:12.5px;margin-top:4px">${t("device.no_schedules.hint")}</div>
              </div>`
            : html`<div class="col" style="gap:10px">
                ${linkedSchedules.map((s) => html`
                  <div class="card card--ghost" style="padding:14px">
                    <div class="sp-between" style="margin-bottom:8px">
                      <div>
                        <div class="fw-600">${s.name}</div>
                        <div class="text-xs text-mute mono">${computeRepeat(s.days)}</div>
                      </div>
                      <button class="btn btn--sm" @click=${() => this.card.selectSchedule(s.id, "editor")}>${t("device.open_schedule")} ${icon("chevron-right", 12)}</button>
                    </div>
                    <chronos-timeline variant="linear" .deviceType=${s.device_type} .blocks=${s.blocks} .interactive=${false} height="compact" .showWeather=${false} .now=${s.enabled ? this.nowHour : null}></chronos-timeline>
                  </div>
                `)}
              </div>`}
        </div>
      </div>
    `;
  }

}
