import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { getActionsForType, getActionDef, actionLabel, actionColor, KIND_COLORS, defaultAction } from "../actions";
import { fmtHour, DAYS, DEVICE_TYPES, computeRepeat } from "../utils";
import type { ChronosCard } from "../chronos-card";
import type { Block, Schedule } from "../types";
import "../timeline";

@customElement("chronos-editor")
export class ChronosEditor extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  @state() private _selectedBlockIdx = 0;

  render() {
    const schedule = this.card._schedules.find((s) => s.id === this.card._selectedId) || this.card._schedules[0];
    if (!schedule) return html`<div class="text-mute" style="padding:40px;text-align:center">Nessuna schedulazione selezionata</div>`;

    const block = schedule.blocks[this._selectedBlockIdx];
    const devices = (schedule.device_ids || []).map((id) => this.card._devices.find((d) => d.id === id)).filter(Boolean);
    const deviceType = schedule.device_type;
    const typeDef = DEVICE_TYPES[deviceType] || { label: deviceType };
    const availableActions = getActionsForType(deviceType);
    const currentActionDef = block?.action ? getActionDef(deviceType, block.action.id) : null;
    const isDirty = this.card.isDirty;

    return html`
      <div class="col" style="gap:18px">
        <div class="sp-between">
          <div>
            <button class="btn btn--ghost btn--sm" @click=${() => this.card.navigate("overview")} style="margin-bottom:6px">
              ${icon("chevron-left", 14)} Torna alla panoramica
            </button>
            <input class="input" .value=${schedule.name}
              @input=${(e: InputEvent) => this.card.updateScheduleLocal(schedule.id, { name: (e.target as HTMLInputElement).value })}
              style="font-size:22px;font-weight:700;letter-spacing:-0.02em;border:1px solid transparent;background:transparent;padding:4px 8px;margin-left:-8px;width:460px"/>
            <div class="row" style="margin-top:6px;gap:10px;flex-wrap:wrap">
              <span class="chip ${schedule.enabled ? "chip--on" : ""}"><span class="chip__dot"></span>${schedule.enabled ? "In esecuzione" : "Disattivata"}</span>
              <span class="chip">${icon("repeat", 11)} ${computeRepeat(schedule.days)}</span>
              <span class="chip chip--accent">${deviceIcon(deviceType, 11)} ${typeDef.label}</span>
              <span class="chip">${icon("device", 11)} ${devices.length} dispositivi</span>
              ${(schedule.weather_rules || []).filter((r) => r.active).length > 0
                ? html`<span class="chip chip--weather">${icon("cloud", 11)} ${(schedule.weather_rules || []).filter((r) => r.active).length} regole meteo</span>`
                : nothing}
            </div>
          </div>
          <div class="row" style="gap:10px">
            <label class="switch">
              <input type="checkbox" .checked=${schedule.enabled} @change=${(e: Event) => this.card.doToggleSchedule(schedule.id, (e.target as HTMLInputElement).checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
            <button class="btn" @click=${() => this.card.doRemoveSchedule(schedule.id)}>${icon("trash", 14)}</button>
            <button class="btn btn--primary" ?disabled=${!isDirty}
              style="opacity:${isDirty ? 1 : 0.5};cursor:${isDirty ? "pointer" : "not-allowed"}"
              @click=${() => this.card.saveCurrentSchedule()}>
              ${icon("check", 14)} ${isDirty ? "Salva modifiche" : "Salvato"}
            </button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 340px;gap:18px">
          <div class="col" style="gap:16px">
            <!-- Timeline card -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1;min-width:0">
                  <h3 class="card__title">Programmazione 24h</h3>
                  <p class="card__sub">Trascina i bordi per ridimensionare · click sulla traccia vuota per aggiungere</p>
                </div>
                <div class="segmented">
                  ${(["linear", "radial", "list"] as const).map((v) => html`
                    <button data-active="${this.card._timelineVariant === v}" @click=${() => this.card.setTimelineVariant(v)}>
                      ${{ linear: "Lineare", radial: "Radiale", list: "Lista" }[v]}
                    </button>
                  `)}
                </div>
              </div>
              <chronos-timeline
                .variant=${this.card._timelineVariant}
                .deviceType=${deviceType}
                .blocks=${schedule.blocks}
                .selectedIdx=${this._selectedBlockIdx}
                .now=${schedule.enabled ? this.nowHour : null}
                .interactive=${true}
                .forecast=${this.card._forecast}
                @block-select=${(e: CustomEvent) => { this._selectedBlockIdx = e.detail.index; }}
                @blocks-changed=${(e: CustomEvent) => { this.card.updateBlocksLocal(schedule.id, e.detail.blocks); }}
              ></chronos-timeline>
              <div class="row" style="margin-top:14px;justify-content:space-between;flex-wrap:wrap;gap:10px">
                <div class="row" style="gap:14px;flex-wrap:wrap">
                  ${availableActions.map((a) => html`
                    <div class="row" style="gap:6px">
                      <span style="width:10px;height:10px;border-radius:3px;background:${KIND_COLORS[a.kind]};display:inline-block"></span>
                      <span class="text-xs">${a.label}</span>
                    </div>
                  `)}
                </div>
                <button class="btn btn--sm" @click=${() => {
                  const newBlocks = [...schedule.blocks, { start: 12, end: 13, action: defaultAction(deviceType) }];
                  this.card.updateBlocksLocal(schedule.id, newBlocks);
                }}>
                  ${icon("plus", 12)} Aggiungi fascia
                </button>
              </div>
            </div>

            <!-- Days -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">Ripetizione settimanale</h3><p class="card__sub">Quali giorni applicare questa programmazione</p></div>
              </div>
              <div class="row" style="gap:16px;flex-wrap:wrap">
                <div class="row" style="gap:4px">
                  ${DAYS.map((d, i) => {
                    const on = schedule.days[i];
                    return html`
                      <button class="mono" @click=${() => {
                        const newDays = [...schedule.days];
                        newDays[i] = newDays[i] ? 0 : 1;
                        this.card.updateScheduleLocal(schedule.id, { days: newDays });
                      }} style="width:34px;height:30px;border-radius:8px;font-size:11px;font-weight:600;letter-spacing:0.02em;background:${on ? "var(--accent)" : "var(--bg-sunken)"};color:${on ? "white" : "var(--text-muted)"};border:1px solid ${on ? "transparent" : "var(--border-soft)"};cursor:pointer">
                        ${d}
                      </button>
                    `;
                  })}
                </div>
                <div class="row" style="gap:6px">
                  <button class="btn btn--sm btn--ghost" @click=${() => this.card.updateScheduleLocal(schedule.id, { days: [1,1,1,1,1,1,1] })}>Tutti</button>
                  <button class="btn btn--sm btn--ghost" @click=${() => this.card.updateScheduleLocal(schedule.id, { days: [1,1,1,1,1,0,0] })}>Lavorativi</button>
                  <button class="btn btn--sm btn--ghost" @click=${() => this.card.updateScheduleLocal(schedule.id, { days: [0,0,0,0,0,1,1] })}>Weekend</button>
                </div>
              </div>
            </div>

            <!-- Weather rules -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">Regole meteo</h3><p class="card__sub">Override condizionali che modificano l'esecuzione</p></div>
                <button class="btn btn--sm" @click=${() => this.card.navigate("weatherRule")}>${icon("plus", 12)} Nuova regola</button>
              </div>
              ${!(schedule.weather_rules || []).length
                ? html`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
                    <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${icon("cloud", 22)}</div>
                    <div style="font-weight:600;color:var(--text);font-size:14px">Nessuna regola meteo</div>
                    <div style="font-size:12.5px;margin-top:4px">Aggiungine una per modulare il comportamento in base alle condizioni esterne.</div>
                  </div>`
                : html`<div class="col" style="gap:8px">
                    ${(schedule.weather_rules || []).map((r, i) => html`
                      <div class="rule-block">
                        <span class="rule-block__label rule-block__label--if">SE</span>
                        <span class="rule-token rule-token--weather">${r.if}</span>
                        <span class="rule-block__label rule-block__label--then">ALLORA</span>
                        <span class="rule-token rule-token--accent">${r.then}</span>
                        <div style="flex:1"></div>
                        <label class="switch">
                          <input type="checkbox" .checked=${r.active} @change=${(e: Event) => {
                            const newRules = [...(schedule.weather_rules || [])];
                            newRules[i] = { ...newRules[i], active: (e.target as HTMLInputElement).checked };
                            this.card.updateScheduleLocal(schedule.id, { weather_rules: newRules });
                          }}/>
                          <span class="switch__track"></span>
                          <span class="switch__thumb"></span>
                        </label>
                      </div>
                    `)}
                  </div>`}
            </div>
          </div>

          <!-- Right column -->
          <div class="col" style="gap:16px">
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">Fascia selezionata</h3><p class="card__sub">${block ? `${fmtHour(block.start)} → ${fmtHour(block.end)}` : ""}</p></div>
              </div>
              ${block ? html`
                <div class="col" style="gap:12px">
                  <div class="grid-2">
                    <div class="field"><label class="field__label">Da</label><input class="input mono" .value=${fmtHour(block.start)} readonly/></div>
                    <div class="field"><label class="field__label">A</label><input class="input mono" .value=${fmtHour(block.end)} readonly/></div>
                  </div>
                  <div class="field">
                    <label class="field__label">Azione su ${typeDef.label?.toLowerCase()}</label>
                    <div class="row" style="gap:6px;flex-wrap:wrap">
                      ${availableActions.map((a) => {
                        const active = block.action?.id === a.id;
                        return html`<button class="btn btn--sm" @click=${() => this._setBlockAction(schedule.id, a.id, a.value?.default)}
                          style="background:${active ? KIND_COLORS[a.kind] : "var(--surface)"};color:${active ? "white" : "var(--text)"};border-color:${active ? "transparent" : "var(--border)"}">
                          ${a.label}</button>`;
                      })}
                    </div>
                    <span class="field__hint mono" style="margin-top:4px">${currentActionDef?.service || ""}</span>
                  </div>
                  ${currentActionDef?.value ? html`
                    <div class="field">
                      <label class="field__label">${currentActionDef.value.label || "Valore"} ${currentActionDef.value.unit ? html`<span class="text-mute">(${currentActionDef.value.unit})</span>` : nothing}</label>
                      ${currentActionDef.value.type === "number" ? html`
                        <div class="row" style="gap:10px;align-items:center">
                          <input type="range" min="${currentActionDef.value.min}" max="${currentActionDef.value.max}" step="${currentActionDef.value.step}"
                            .value=${String(block.action?.value ?? currentActionDef.value.default)}
                            @input=${(e: InputEvent) => this._setBlockValue(schedule.id, parseFloat((e.target as HTMLInputElement).value))}
                            style="flex:1"/>
                          <span class="mono" style="min-width:60px;text-align:right;font-weight:600">${block.action?.value ?? currentActionDef.value.default}${currentActionDef.value.unit}</span>
                        </div>
                      ` : currentActionDef.value.type === "enum" ? html`
                        <select class="input"
                          @change=${(e: Event) => this._setBlockValue(schedule.id, (e.target as HTMLSelectElement).value)}>
                          ${(currentActionDef.value.options || []).map((o) => {
                            const cur = String(block.action?.value ?? currentActionDef.value!.default);
                            return html`<option value="${o}" ?selected=${cur === o}>${o}</option>`;
                          })}
                        </select>
                      ` : nothing}
                    </div>
                  ` : nothing}
                  <button class="btn btn--ghost" style="color:var(--danger)" @click=${() => this._removeBlock(schedule.id)}>
                    ${icon("trash", 14)} Elimina fascia
                  </button>
                </div>
              ` : nothing}
            </div>

            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">Dispositivi influenzati</h3><p class="card__sub">${devices.length} selezionati</p></div>
              </div>
              <div class="col" style="gap:2px">
                ${devices.map((d: any) => html`
                  <div class="device-row">
                    <div class="device-row__icon">${deviceIcon(d.type, 17)}</div>
                    <div class="device-row__main">
                      <div class="device-row__name">${d.alias}</div>
                      <div class="device-row__meta">${d.area} · ${d.entity_id}</div>
                    </div>
                  </div>
                `)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _setBlockAction(schedId: string, actionId: string, defaultValue?: any) {
    const schedule = this.card._schedules.find((s) => s.id === schedId);
    if (!schedule) return;
    const newBlocks = [...schedule.blocks];
    newBlocks[this._selectedBlockIdx] = {
      ...newBlocks[this._selectedBlockIdx],
      action: { id: actionId, value: defaultValue },
    };
    this.card.updateBlocksLocal(schedId, newBlocks);
  }

  private _setBlockValue(schedId: string, value: any) {
    const schedule = this.card._schedules.find((s) => s.id === schedId);
    if (!schedule) return;
    const newBlocks = [...schedule.blocks];
    const block = newBlocks[this._selectedBlockIdx];
    newBlocks[this._selectedBlockIdx] = {
      ...block,
      action: { ...block.action, value },
    };
    this.card.updateBlocksLocal(schedId, newBlocks);
  }

  private _removeBlock(schedId: string) {
    const schedule = this.card._schedules.find((s) => s.id === schedId);
    if (!schedule || schedule.blocks.length <= 1) return;
    const newBlocks = schedule.blocks.filter((_, i) => i !== this._selectedBlockIdx);
    this._selectedBlockIdx = Math.max(0, this._selectedBlockIdx - 1);
    this.card.updateBlocksLocal(schedId, newBlocks);
  }
}
