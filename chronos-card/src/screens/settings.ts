import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon } from "../icons";
import type { ChronosCard } from "../chronos-card";

@customElement("chronos-settings-screen")
export class ChronosSettingsScreen extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false }) card!: ChronosCard;
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
          <div class="card__header"><div style="flex:1"><h3 class="card__title">Sorgente meteo</h3><p class="card__sub">Entità HA usata per valutare le regole meteo</p></div></div>
          <div class="col" style="gap:14px">
            <div class="field">
              <label class="field__label">Entità meteo principale</label>
              <select class="select mono" .value=${s.weather_entity || ""}
                @change=${(e: Event) => this._updateSetting("weather_entity", (e.target as HTMLSelectElement).value)}>
                <option value="">Nessuna</option>
                ${this.card._weatherEntities.map((w) => html`
                  <option value="${w.entity_id}">${w.entity_id} — ${w.friendly_name}</option>
                `)}
              </select>
            </div>
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
      </div>
    `;
  }

  private _updateSetting(key: string, value: any) {
    this.card.doUpdateSettings({ [key]: value } as any);
  }
}
