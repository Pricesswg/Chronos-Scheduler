import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon } from "../icons";
import { KIND_COLORS } from "../actions";
import { DAYS } from "../utils";
import type { ChronosCard } from "../chronos-card";
import "../timeline";

@customElement("chronos-week")
export class ChronosWeek extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  render() {
    const { _schedules: schedules } = this.card;
    const todayIdx = new Date().getDay();
    const adjustedToday = todayIdx === 0 ? 6 : todayIdx - 1;

    return html`
      <div class="col" style="gap:22px">
        <div>
          <h1 class="page-title">Vista settimanale</h1>
          <p class="page-sub">Tutte le schedulazioni distribuite sui giorni della settimana</p>
        </div>

        <div class="row" style="justify-content:space-between">
          <div class="row">
            <button class="btn btn--icon btn--ghost">${icon("chevron-left", 14)}</button>
            <strong class="mono">Settimana corrente</strong>
            <button class="btn btn--icon btn--ghost">${icon("chevron-right", 14)}</button>
          </div>
          <div class="segmented">
            <button data-active="false">Giorno</button>
            <button data-active="true">Settimana</button>
            <button data-active="false">Mese</button>
          </div>
        </div>

        <div class="card">
          <div class="weekgrid">
            <div class="weekgrid__row" style="margin-bottom:6px">
              <div></div>
              <div style="position:relative;height:18px;font-family:var(--font-mono);font-size:10px;color:var(--text-muted)">
                ${[0, 4, 8, 12, 16, 20, 24].map((h) => html`
                  <span style="position:absolute;left:${(h / 24) * 100}%;transform:translateX(-50%)">${String(h).padStart(2, "0")}</span>
                `)}
              </div>
            </div>
            ${DAYS.map((d, dayIdx) => html`
              <div class="weekgrid__row">
                <div class="weekgrid__day" style="color:${dayIdx === adjustedToday ? "var(--accent)" : ""}">
                  ${d}${dayIdx === adjustedToday ? html`<span style="display:block;font-size:9px;margin-top:2px">OGGI</span>` : nothing}
                </div>
                <div style="position:relative">
                  <div class="col" style="gap:4px">
                    ${schedules.filter((s) => s.enabled && s.days[dayIdx]).map((s) => html`
                      <div class="row" style="gap:8px;align-items:center">
                        <span style="width:90px;font-size:11.5px;color:var(--text-muted);font-weight:500" class="truncate">${s.name}</span>
                        <div style="flex:1">
                          <chronos-timeline variant="linear" .deviceType=${s.device_type} .blocks=${s.blocks} .interactive=${false} height="mini" .showWeather=${false}
                            .now=${dayIdx === adjustedToday ? this.nowHour : null}></chronos-timeline>
                        </div>
                      </div>
                    `)}
                    ${!schedules.filter((s) => s.enabled && s.days[dayIdx]).length
                      ? html`<div class="text-xs text-mute" style="padding:8px 0;font-style:italic">Nessuna schedulazione attiva</div>`
                      : nothing}
                  </div>
                </div>
              </div>
            `)}
          </div>
        </div>

        <div class="row" style="gap:14px;flex-wrap:wrap">
          ${Object.entries(KIND_COLORS).map(([k, c]) => html`
            <div class="row" style="gap:6px">
              <span style="width:12px;height:8px;border-radius:2px;background:${c}"></span>
              <span class="text-xs">${{ on: "Attiva", off: "Spenta", set: "Imposta valore", preset: "Preset", cmd: "Comando" }[k]}</span>
            </div>
          `)}
        </div>
      </div>
    `;
  }
}
