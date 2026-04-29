import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { actionColor } from "../actions";
import { fmtHour } from "../utils";
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
          <h1 class="page-title">Le tue schedulazioni</h1>
          <p class="page-sub">Programmazione oraria con override meteo · ${active} di ${total} attive · ${weatherRules} regole meteo live</p>
        </div>

        <div class="grid-3">
          <div class="kpi">
            <div class="kpi__label">Schedulazioni attive</div>
            <div class="kpi__value">${active}<span class="text-mute" style="font-size:16px;margin-left:6px">/${total}</span></div>
            <div class="kpi__delta">su ${devices.length} dispositivi connessi</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">Regole meteo</div>
            <div class="kpi__value">${weatherRules}</div>
            <div class="kpi__delta">override condizionali</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">Ora locale</div>
            <div class="kpi__value">${fmtHour(this.nowHour)}</div>
            <div class="kpi__delta">aggiornamento live</div>
          </div>
        </div>

        <div class="sp-between">
          <div class="row">
            <h2 style="margin:0;font-size:16px;font-weight:600;letter-spacing:-0.01em">Tutte le schedulazioni</h2>
            <span class="tag mono">${total}</span>
          </div>
          <div class="row">
            <button class="btn" @click=${() => this.card.navigate("week")}>${icon("calendar", 14)} Vista settimana</button>
            <button class="btn btn--primary" @click=${() => this.card.navigate("wizard")}>${icon("plus", 14)} Nuova schedulazione</button>
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
                    <div class="sched-card__sub">${this._computeRepeat(s.days)} · ${s.blocks.length} fasce</div>
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
                    ${devs.slice(0, 5).map((d: any) => html`
                      <div class="device-icon-pill" title="${d.alias}">${deviceIcon(d.type, 14)}</div>
                    `)}
                    ${devs.length > 5 ? html`<div class="device-icon-pill mono" style="font-size:10px">+${devs.length - 5}</div>` : nothing}
                  </div>
                  <div style="flex:1"></div>
                  ${activeRules > 0 ? html`<span class="chip chip--weather">${icon("cloud", 11)} ${activeRules} regole</span>` : nothing}
                  <span class="chip ${s.enabled ? "chip--on" : ""}"><span class="chip__dot"></span>${s.enabled ? "Attiva" : "Disattivata"}</span>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _computeRepeat(days: number[]): string {
    if (!days || !days.length) return "";
    const DAYS = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
    if (days.every(Boolean)) return "Ogni giorno";
    return days.map((d, i) => (d ? DAYS[i] : null)).filter(Boolean).join(" · ");
  }
}
