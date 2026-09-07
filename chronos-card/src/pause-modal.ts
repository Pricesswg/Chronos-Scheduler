import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "./styles";
import { icon } from "./icons";
import { t } from "./i18n";
import { fmtWhen, localIso, pausedUntil } from "./utils";
import type { ChronosCard } from "./chronos-card";

/** "Pause until": skip today, a few hours, or a date and time. Shared by
 * the overview and the editor; the card hosts it and owns the API call. */
@customElement("chronos-pause-modal")
export class ChronosPauseModal extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property() scheduleId = "";
  @state() private _custom = "";
  @state() private _busy = false;

  private async _apply(untilIso: string | null) {
    if (this._busy) return;
    this._busy = true;
    try {
      await this.card.doPauseSchedule(this.scheduleId, untilIso);
    } finally {
      this._busy = false;
      this.card.closePauseModal();
    }
  }

  render() {
    const s = this.card._schedules.find((x) => x.id === this.scheduleId);
    if (!s) return nothing;
    const until = pausedUntil(s);
    const inHours = (n: number) => localIso(new Date(Date.now() + n * 3600e3));
    const midnight = () => { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(0, 0, 0, 0); return localIso(d); };
    return html`
      <div class="modal-overlay" @click=${() => this.card.closePauseModal()}>
        <div class="card" style="width:min(460px,100%)" @click=${(e: Event) => e.stopPropagation()}>
          <h3 style="margin:0 0 6px">${t("pause.title", { name: s.name })}</h3>
          <p class="text-mute text-sm" style="margin:0 0 14px">${t("pause.desc")}</p>
          ${until ? html`<div style="margin-bottom:12px"><span class="chip chip--paused">${icon("pause", 11)} ${t("pause.badge", { when: fmtWhen(until) })}</span></div>` : nothing}
          <div class="col" style="gap:8px">
            <button class="btn" data-preset="skip_today" @click=${() => this._apply(midnight())}>
              ${icon("calendar", 14)} ${t("pause.skip_today")}
              <span class="text-mute text-xs">· ${t("pause.skip_today.hint")}</span>
            </button>
            <div class="row" style="gap:8px">
              ${[2, 6].map((n) => html`
                <button class="btn" style="flex:1" data-preset="hours-${n}" @click=${() => this._apply(inHours(n))}>
                  ${icon("clock", 14)} ${t("pause.hours", { n })}
                </button>`)}
            </div>
            <div class="field" style="margin:0">
              <label class="field__label">${t("pause.custom")}</label>
              <div class="row" style="gap:8px">
                <input class="input mono" type="datetime-local" style="flex:1" .value=${this._custom}
                  @input=${(e: Event) => { this._custom = (e.target as HTMLInputElement).value; }}/>
                <button class="btn btn--primary" ?disabled=${!this._custom} @click=${() => this._apply(this._custom + ":00")}>
                  ${t("pause.apply")}
                </button>
              </div>
            </div>
          </div>
          <div class="row" style="justify-content:flex-end;gap:8px;margin-top:16px">
            ${until ? html`<button class="btn" data-preset="resume" @click=${() => this._apply(null)}>${icon("play", 14)} ${t("pause.resume")}</button>` : nothing}
            <button class="btn btn--ghost" @click=${() => this.card.closePauseModal()}>${t("pause.close")}</button>
          </div>
        </div>
      </div>
    `;
  }
}
