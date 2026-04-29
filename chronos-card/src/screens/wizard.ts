import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { defaultAction } from "../actions";
import { DAYS, DEVICE_TYPES, computeRepeat } from "../utils";
import type { ChronosCard } from "../chronos-card";
import type { DeviceType, Schedule } from "../types";
import "../timeline";

@customElement("chronos-wizard")
export class ChronosWizard extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  @state() private _step = 0;
  @state() private _name = "Nuova schedulazione";
  @state() private _pickedDevices: string[] = [];
  @state() private _days = [1, 1, 1, 1, 1, 1, 1];
  @state() private _weatherEnabled = true;

  private _steps = [
    { key: "name", label: "Nome" },
    { key: "device", label: "Dispositivi" },
    { key: "time", label: "Fasce orarie" },
    { key: "days", label: "Ripetizione" },
    { key: "weather", label: "Meteo" },
    { key: "review", label: "Riepilogo" },
  ];

  render() {
    return html`
      <div class="col" style="gap:22px;max-width:900px;margin:0 auto">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${() => this.card.navigate("overview")}>
            ${icon("chevron-left", 14)} Annulla
          </button>
          <h1 class="page-title" style="margin-top:6px">Crea schedulazione</h1>
          <p class="page-sub">Procedura guidata · puoi modificare tutto in seguito</p>
        </div>

        <div class="wizard-stepper">
          ${this._steps.map((s, i) => html`
            <div class="wizard-step" data-state="${i === this._step ? "active" : i < this._step ? "done" : "idle"}">
              <span class="wizard-step__num">${i < this._step ? "✓" : i + 1}</span>
              <span>${s.label}</span>
            </div>
          `)}
        </div>

        <div class="card card--pad-lg">
          ${this._renderStepContent()}
        </div>

        <div class="row" style="justify-content:space-between">
          <button class="btn" ?disabled=${this._step === 0} @click=${() => { this._step = Math.max(0, this._step - 1); }}
            style="opacity:${this._step === 0 ? 0.4 : 1}">
            ${icon("chevron-left", 14)} Indietro
          </button>
          ${this._step < this._steps.length - 1
            ? html`<button class="btn btn--primary" @click=${() => { this._step++; }}>
                Avanti ${icon("chevron-right", 14)}
              </button>`
            : html`<button class="btn btn--primary" @click=${() => this._finish()}>
                ${icon("check", 14)} Crea schedulazione
              </button>`}
        </div>
      </div>
    `;
  }

  private _renderStepContent() {
    switch (this._step) {
      case 0:
        return html`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">Dai un nome alla schedulazione</h3>
            <p class="text-mute text-sm" style="margin:0">Sarà visibile nella panoramica e nelle notifiche.</p>
            <input class="input" .value=${this._name} @input=${(e: InputEvent) => { this._name = (e.target as HTMLInputElement).value; }}
              style="font-size:18px;padding:12px 14px"/>
            <div class="row" style="gap:6px;flex-wrap:wrap">
              <span class="text-xs text-mute">Suggerimenti:</span>
              ${["Riscaldamento Casa", "Irrigazione Giardino", "Tapparelle Sud", "Luci Serata"].map((n) => html`
                <button class="chip" @click=${() => { this._name = n; }} style="cursor:pointer">${n}</button>
              `)}
            </div>
          </div>
        `;
      case 1:
        return html`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">Quali dispositivi sono coinvolti?</h3>
            <p class="text-mute text-sm" style="margin:0">Verranno tutti controllati dalla stessa programmazione.</p>
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
              ${this.card._devices.map((d) => html`
                <button class="tile-pick" data-selected="${this._pickedDevices.includes(d.id)}"
                  @click=${() => this._togglePick(d.id)}>
                  <div class="row" style="gap:10px">
                    <div class="tile-pick__icon">${deviceIcon(d.type, 16)}</div>
                    <div style="min-width:0;flex:1">
                      <div class="tile-pick__name truncate">${d.alias}</div>
                      <div class="tile-pick__desc">${d.area} · ${DEVICE_TYPES[d.type]?.label || d.type}</div>
                    </div>
                    ${this._pickedDevices.includes(d.id) ? icon("check", 16) : nothing}
                  </div>
                </button>
              `)}
            </div>
          </div>
        `;
      case 2: {
        const deviceType = this._inferDeviceType();
        return html`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">Imposta una programmazione iniziale</h3>
            <p class="text-mute text-sm" style="margin:0">Useremo un preset come punto di partenza.</p>
            <chronos-timeline variant="linear" .deviceType=${deviceType} .interactive=${false}
              .blocks=${this._defaultBlocks(deviceType)}></chronos-timeline>
          </div>
        `;
      }
      case 3:
        return html`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">Quali giorni della settimana?</h3>
            <p class="text-mute text-sm" style="margin:0">La schedulazione si ripeterà automaticamente ogni settimana.</p>
            <div class="row" style="gap:4px">
              ${DAYS.map((d, i) => {
                const on = this._days[i];
                return html`
                  <button class="mono" @click=${() => {
                    const nd = [...this._days]; nd[i] = nd[i] ? 0 : 1; this._days = nd;
                  }} style="width:34px;height:30px;border-radius:8px;font-size:11px;font-weight:600;background:${on ? "var(--accent)" : "var(--bg-sunken)"};color:${on ? "white" : "var(--text-muted)"};border:1px solid ${on ? "transparent" : "var(--border-soft)"};cursor:pointer">
                    ${d}
                  </button>
                `;
              })}
            </div>
            <div class="row" style="gap:6px">
              <button class="btn btn--sm" @click=${() => { this._days = [1,1,1,1,1,1,1]; }}>Tutti i giorni</button>
              <button class="btn btn--sm" @click=${() => { this._days = [1,1,1,1,1,0,0]; }}>Lavorativi</button>
              <button class="btn btn--sm" @click=${() => { this._days = [0,0,0,0,0,1,1]; }}>Weekend</button>
            </div>
          </div>
        `;
      case 4:
        return html`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">Logica meteo</h3>
            <p class="text-mute text-sm" style="margin:0">Vuoi che il meteo locale modifichi automaticamente questa programmazione?</p>
            <div class="grid-2">
              <button class="tile-pick" data-selected="${this._weatherEnabled}" @click=${() => { this._weatherEnabled = true; }}>
                <div class="tile-pick__icon">${icon("cloud", 16)}</div>
                <div class="tile-pick__name">Sì, abilita</div>
                <div class="tile-pick__desc">Suggeriremo regole utili in base al tipo di dispositivo</div>
              </button>
              <button class="tile-pick" data-selected="${!this._weatherEnabled}" @click=${() => { this._weatherEnabled = false; }}>
                <div class="tile-pick__icon" style="background:var(--bg-sunken);color:var(--text-soft)">${icon("close", 16)}</div>
                <div class="tile-pick__name">No, solo orari</div>
                <div class="tile-pick__desc">Esecuzione fissa indipendente dal meteo</div>
              </button>
            </div>
          </div>
        `;
      case 5:
        return html`
          <div class="col" style="gap:12px">
            <h3 style="margin:0">Riepilogo</h3>
            <div class="card card--ghost" style="padding:14px">
              <div class="col" style="gap:10px">
                <div class="sp-between"><span class="text-mute text-sm">Nome</span><strong>${this._name}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">Dispositivi</span><strong>${this._pickedDevices.length} selezionati</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">Giorni</span><strong>${this._days.filter(Boolean).length}/7</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">Logica meteo</span><strong>${this._weatherEnabled ? "Abilitata" : "Disabilitata"}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">Fasce orarie</span><strong>3 (preset)</strong></div>
              </div>
            </div>
            <p class="text-xs text-mute" style="margin:0">Potrai modificare ogni dettaglio dall'editor dopo la creazione.</p>
          </div>
        `;
      default:
        return nothing;
    }
  }

  private _togglePick(id: string) {
    if (this._pickedDevices.includes(id)) {
      this._pickedDevices = this._pickedDevices.filter((x) => x !== id);
    } else {
      this._pickedDevices = [...this._pickedDevices, id];
    }
  }

  private _inferDeviceType(): DeviceType {
    if (!this._pickedDevices.length) return "thermostat";
    const first = this.card._devices.find((d) => d.id === this._pickedDevices[0]);
    return (first?.type as DeviceType) || "thermostat";
  }

  private _defaultBlocks(deviceType: DeviceType) {
    const da = defaultAction(deviceType);
    return [
      { start: 0, end: 7, action: { ...da } },
      { start: 7, end: 22, action: { ...da } },
      { start: 22, end: 24, action: { ...da } },
    ];
  }

  private async _finish() {
    const deviceType = this._inferDeviceType();
    const schedule: Schedule = {
      id: "",
      name: this._name,
      device_type: deviceType,
      device_ids: this._pickedDevices,
      days: this._days,
      enabled: true,
      blocks: this._defaultBlocks(deviceType),
      weather_rules: this._weatherEnabled
        ? [{ if: "temperature > 22°C", then: "Salta esecuzione", active: true }]
        : [],
    };
    await this.card.doAddSchedule(schedule);
  }
}
