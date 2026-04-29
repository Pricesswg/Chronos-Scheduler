import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { defaultAction, getActionsForType, getActionDef, actionColor } from "../actions";
import { getDays, DEVICE_TYPES, computeRepeat } from "../utils";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import type { Block, DeviceType, Schedule } from "../types";
import "../timeline";

type Variant = "linear" | "radial" | "list";

@customElement("chronos-wizard")
export class ChronosWizard extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  @state() private _step = 0;
  @state() private _name = "";
  @state() private _pickedDevices: string[] = [];
  @state() private _days = [1, 1, 1, 1, 1, 1, 1];
  @state() private _weatherEnabled = true;
  @state() private _blocks: Block[] = [];
  @state() private _blocksDeviceType: DeviceType | "" = "";
  @state() private _selectedBlockIdx = -1;
  @state() private _variant: Variant = "linear";

  private get _steps() {
    return [
      { key: "name", label: t("wizard.step.name") },
      { key: "device", label: t("wizard.step.devices") },
      { key: "time", label: t("wizard.step.time") },
      { key: "days", label: t("wizard.step.days") },
      { key: "weather", label: t("wizard.step.weather") },
      { key: "review", label: t("wizard.step.review") },
    ];
  }

  render() {
    return html`
      <div class="col" style="gap:22px;max-width:900px;margin:0 auto">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${() => this.card.navigate("overview")}>
            ${icon("chevron-left", 14)} ${t("common.cancel")}
          </button>
          <h1 class="page-title" style="margin-top:6px">${t("wizard.title")}</h1>
          <p class="page-sub">${t("wizard.subtitle")}</p>
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
            ${icon("chevron-left", 14)} ${t("common.back")}
          </button>
          ${this._step < this._steps.length - 1
            ? html`<button class="btn btn--primary" @click=${() => { this._step++; }}>
                ${t("common.next")} ${icon("chevron-right", 14)}
              </button>`
            : html`<button class="btn btn--primary" @click=${() => this._finish()}>
                ${icon("check", 14)} ${t("wizard.create")}
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
            <h3 style="margin:0">${t("wizard.name.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${t("wizard.name.hint")}</p>
            <input class="input" .value=${this._name} @input=${(e: InputEvent) => { this._name = (e.target as HTMLInputElement).value; }}
              placeholder="${t("nav.new_schedule")}"
              style="font-size:18px;padding:12px 14px"/>
          </div>
        `;
      case 1:
        return html`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${t("wizard.devices.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${t("wizard.devices.hint")}</p>
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
        this._ensureBlocksFor(deviceType);
        const block = this._selectedBlockIdx >= 0 ? this._blocks[this._selectedBlockIdx] : undefined;
        const def = block?.action ? getActionDef(deviceType, block.action.id) : undefined;
        const actions = getActionsForType(deviceType);

        return html`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${t("wizard.time.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${t("editor.add_block_hint")}</p>

            <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">
              <span class="text-xs text-mute">${t("editor.timeline_variant")}:</span>
              <div class="segmented">
                ${(["linear", "radial", "list"] as Variant[]).map((v) => html`
                  <button data-active="${this._variant === v}" @click=${() => { this._variant = v; }}>
                    ${t("timeline." + v)}
                  </button>
                `)}
              </div>
              <div style="flex:1"></div>
              <button class="btn btn--sm" @click=${() => this._resetBlocks(deviceType)}>
                ${icon("repeat", 12)} ${t("wizard.time.reset_preset")}
              </button>
            </div>

            <chronos-timeline
              variant="${this._variant}"
              .deviceType=${deviceType}
              .interactive=${true}
              .blocks=${this._blocks}
              .selectedIdx=${this._selectedBlockIdx}
              @blocks-changed=${(e: CustomEvent) => { this._blocks = e.detail.blocks; }}
              @block-select=${(e: CustomEvent) => { this._selectedBlockIdx = e.detail.index; }}
            ></chronos-timeline>

            ${block ? html`
              <div class="card card--ghost" style="padding:14px">
                <div class="sp-between" style="margin-bottom:10px">
                  <div>
                    <div class="text-xs text-mute mono">${t("wizard.time.selected")}</div>
                    <div class="fw-600 mono">${this._fmtBlockRange(block)}</div>
                  </div>
                  <button class="btn btn--sm" style="color:var(--danger)" @click=${() => this._removeSelected()}>
                    ${icon("trash", 12)} ${t("editor.block.delete")}
                  </button>
                </div>
                <div class="field">
                  <label class="field__label">${t("editor.block.action")}</label>
                  <div class="row" style="gap:6px;flex-wrap:wrap">
                    ${actions.map((a) => html`
                      <button class="chip" data-active="${block.action?.id === a.id}"
                        style="background:${block.action?.id === a.id ? actionColor(deviceType, { id: a.id }) : "var(--bg-sunken)"};color:${block.action?.id === a.id ? "white" : "var(--text-soft)"};border:1px solid ${block.action?.id === a.id ? "transparent" : "var(--border-soft)"};cursor:pointer"
                        @click=${() => this._setAction(a.id)}>${a.label}</button>
                    `)}
                  </div>
                </div>
                ${def?.value ? html`
                  <div class="field" style="margin-top:10px">
                    <label class="field__label">${def.value.label || t("common.value")} ${def.value.unit ? html`<span class="text-mute">(${def.value.unit})</span>` : nothing}</label>
                    ${def.value.type === "number" ? html`
                      <div class="row" style="gap:10px;align-items:center">
                        <input type="range" min="${def.value.min}" max="${def.value.max}" step="${def.value.step}"
                          .value=${String(block.action?.value ?? def.value.default)}
                          @input=${(e: InputEvent) => this._setActionValue(parseFloat((e.target as HTMLInputElement).value))}
                          style="flex:1"/>
                        <span class="mono" style="min-width:60px;text-align:right;font-weight:600">${block.action?.value ?? def.value.default}${def.value.unit || ""}</span>
                      </div>
                    ` : def.value.type === "enum" ? html`
                      <select class="input" @change=${(e: Event) => this._setActionValue((e.target as HTMLSelectElement).value)}>
                        ${(def.value.options || []).map((o) => {
                          const cur = String(block.action?.value ?? def.value!.default);
                          return html`<option value="${o}" ?selected=${cur === o}>${o}</option>`;
                        })}
                      </select>
                    ` : nothing}
                  </div>
                ` : nothing}
              </div>
            ` : html`
              <p class="text-xs text-mute" style="margin:0">${t("editor.block.no_selection")}</p>
            `}

            <p class="text-xs text-mute" style="margin:0">${t("editor.coverage", { n: this._blocks.length, h: this._totalCoverage() })}</p>
          </div>
        `;
      }
      case 3:
        return html`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${t("wizard.days.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${t("wizard.days.hint")}</p>
            <div class="row" style="gap:4px">
              ${getDays().map((d: string, i: number) => {
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
              <button class="btn btn--sm" @click=${() => { this._days = [1,1,1,1,1,1,1]; }}>${t("editor.days.all")}</button>
              <button class="btn btn--sm" @click=${() => { this._days = [1,1,1,1,1,0,0]; }}>${t("editor.days.weekdays")}</button>
              <button class="btn btn--sm" @click=${() => { this._days = [0,0,0,0,0,1,1]; }}>${t("editor.days.weekend")}</button>
            </div>
          </div>
        `;
      case 4:
        return html`
          <div class="col" style="gap:14px">
            <h3 style="margin:0">${t("wizard.weather.heading")}</h3>
            <p class="text-mute text-sm" style="margin:0">${t("wizard.weather.hint")}</p>
            <div class="grid-2">
              <button class="tile-pick" data-selected="${this._weatherEnabled}" @click=${() => { this._weatherEnabled = true; }}>
                <div class="tile-pick__icon">${icon("cloud", 16)}</div>
                <div class="tile-pick__name">${t("wizard.weather.yes")}</div>
                <div class="tile-pick__desc">${t("wizard.weather.yes.desc")}</div>
              </button>
              <button class="tile-pick" data-selected="${!this._weatherEnabled}" @click=${() => { this._weatherEnabled = false; }}>
                <div class="tile-pick__icon" style="background:var(--bg-sunken);color:var(--text-soft)">${icon("close", 16)}</div>
                <div class="tile-pick__name">${t("wizard.weather.no")}</div>
                <div class="tile-pick__desc">${t("wizard.weather.no.desc")}</div>
              </button>
            </div>
          </div>
        `;
      case 5:
        return html`
          <div class="col" style="gap:12px">
            <h3 style="margin:0">${t("wizard.review.heading")}</h3>
            <div class="card card--ghost" style="padding:14px">
              <div class="col" style="gap:10px">
                <div class="sp-between"><span class="text-mute text-sm">${t("editor.field.name")}</span><strong>${this._name || t("nav.new_schedule")}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${t("nav.devices")}</span><strong>${t("wizard.review.devices", { n: this._pickedDevices.length })}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${t("editor.days.repeat")}</span><strong>${this._days.filter(Boolean).length}/7</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${t("wizard.weather.heading")}</span><strong>${this._weatherEnabled ? t("wizard.review.weather_on") : t("wizard.review.weather_off")}</strong></div>
                <div class="sp-between"><span class="text-mute text-sm">${t("wizard.step.time")}</span><strong>${this._blocks.length}</strong></div>
              </div>
            </div>
            <p class="text-xs text-mute" style="margin:0">${t("wizard.review.note")}</p>
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

  private _defaultBlocks(deviceType: DeviceType): Block[] {
    const da = defaultAction(deviceType);
    return [
      { start: 0, end: 7, action: { ...da } },
      { start: 7, end: 22, action: { ...da } },
      { start: 22, end: 24, action: { ...da } },
    ];
  }

  private _ensureBlocksFor(deviceType: DeviceType) {
    if (this._blocksDeviceType !== deviceType) {
      this._blocks = this._defaultBlocks(deviceType);
      this._blocksDeviceType = deviceType;
      this._selectedBlockIdx = -1;
    }
  }

  private _resetBlocks(deviceType: DeviceType) {
    this._blocks = this._defaultBlocks(deviceType);
    this._selectedBlockIdx = -1;
  }

  private _removeSelected() {
    if (this._selectedBlockIdx < 0) return;
    this._blocks = this._blocks.filter((_, i) => i !== this._selectedBlockIdx);
    this._selectedBlockIdx = -1;
  }

  private _setAction(actionId: string) {
    if (this._selectedBlockIdx < 0) return;
    const def = getActionDef(this._inferDeviceType(), actionId);
    const newBlocks = [...this._blocks];
    newBlocks[this._selectedBlockIdx] = {
      ...newBlocks[this._selectedBlockIdx],
      action: { id: actionId, value: def?.value ? def.value.default : undefined },
    };
    this._blocks = newBlocks;
  }

  private _setActionValue(value: number | string) {
    if (this._selectedBlockIdx < 0) return;
    const newBlocks = [...this._blocks];
    const cur = newBlocks[this._selectedBlockIdx];
    newBlocks[this._selectedBlockIdx] = {
      ...cur,
      action: { ...(cur.action || { id: "" }), value } as any,
    };
    this._blocks = newBlocks;
  }

  private _fmtBlockRange(b: Block): string {
    const fmt = (h: number) => {
      const hh = Math.floor(h);
      const mm = Math.round((h - hh) * 60);
      return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    };
    return `${fmt(b.start)} → ${fmt(b.end)}`;
  }

  private _totalCoverage(): string {
    const sum = this._blocks.reduce((acc, b) => acc + (b.end - b.start), 0);
    return sum.toFixed(1).replace(/\.0$/, "");
  }

  private async _finish() {
    const deviceType = this._inferDeviceType();
    this._ensureBlocksFor(deviceType);
    const schedule: Schedule = {
      id: "",
      name: this._name,
      device_type: deviceType,
      device_ids: this._pickedDevices,
      days: this._days,
      enabled: true,
      blocks: [...this._blocks].sort((a, b) => a.start - b.start),
      weather_rules: this._weatherEnabled
        ? [{ if: "temperature > 22°C", then: "Salta esecuzione", active: true }]
        : [],
    };
    await this.card.doAddSchedule(schedule);
  }
}
