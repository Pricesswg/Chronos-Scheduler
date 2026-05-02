import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon } from "../icons";
import { getActionsForType } from "../actions";
import { fmtHour, resolveBlockTime } from "../utils";
import { t, attrLabel } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import type { Block, RuleEffect, WeatherRule } from "../types";
import "../timeline";

const EFFECTS: { key: RuleEffect; needsIf: boolean; needsBlock: boolean }[] = [
  { key: "skip", needsIf: true, needsBlock: true },
  { key: "shift", needsIf: true, needsBlock: true },
  { key: "extend", needsIf: true, needsBlock: true },
  { key: "shrink", needsIf: true, needsBlock: true },
  { key: "force_action", needsIf: true, needsBlock: true },
  { key: "replace_value", needsIf: true, needsBlock: true },
  { key: "scale_duration", needsIf: false, needsBlock: true },
  { key: "scale_value", needsIf: false, needsBlock: true },
];

@customElement("chronos-weather-rule")
export class ChronosWeatherRule extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  // Common
  @state() private _blockIndex: number | null = null; // null = all blocks
  @state() private _effect: RuleEffect = "skip";

  // IF condition (used by all except scale_*)
  @state() private _variable = "temperature";
  @state() private _op = ">";
  @state() private _value = "22";

  // Delta-based effects (shift/extend/shrink)
  @state() private _deltaMin = 30;
  @state() private _direction: "forward" | "backward" = "forward";

  // Force action
  @state() private _actionId = "";
  @state() private _actionValue: number | string | null = null;
  @state() private _fireMode: "every" | "once_per_day" | "once_per_daytime" | "once_per_nighttime" = "once_per_daytime";

  // Scale
  @state() private _scaleVar = "temperature";
  @state() private _scaleVarMin = 25;
  @state() private _scaleVarMax = 35;
  @state() private _scaleOutMin = 30;
  @state() private _scaleOutMax = 120;

  render() {
    const schedule = this.card._schedules.find((s) => s.id === this.card._selectedId) || this.card._schedules[0];
    if (!schedule) return nothing;

    const deviceType = schedule.device_type;
    const typeActions = getActionsForType(deviceType);
    const weatherAttrs = this.card._weatherAttributes;
    const varDef = weatherAttrs.find((v) => v.key === this._variable) || weatherAttrs[0];
    const effectMeta = EFFECTS.find((e) => e.key === this._effect)!;
    const targetBlock = this._blockIndex !== null && this._blockIndex >= 0 && this._blockIndex < schedule.blocks.length
      ? schedule.blocks[this._blockIndex]
      : null;
    const conflicts = this._findConflicts(schedule);

    return html`
      <div class="col" style="gap:22px;max-width:1100px">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${() => this.card.navigate("editor")}>
            ${icon("chevron-left", 14)} ${t("nav.editor")}
          </button>
          <h1 class="page-title" style="margin-top:6px">${t("wr.heading")}</h1>
          <p class="page-sub">${t("wr.subtitle")} · <strong>${schedule.name}</strong></p>
        </div>

        ${this._renderPreviewBanner(schedule)}

        ${conflicts.length ? html`
          <div class="card" style="background:#fef3c7;border-left:4px solid #f59e0b;color:#78350f">
            <div class="fw-600" style="margin-bottom:6px">${icon("info", 12)} ${t("wr.conflict.title")}</div>
            <div class="text-sm" style="line-height:1.5">${t("wr.conflict.body")}</div>
            <ul style="margin:8px 0 0;padding-left:18px;font-size:12.5px;font-family:var(--font-mono)">
              ${conflicts.map((c) => html`<li>${c}</li>`)}
            </ul>
          </div>
        ` : nothing}

        <div class="card">
          <div class="card__header">
            <div style="flex:1">
              <h3 class="card__title">${t("wr.target.title")}</h3>
              <p class="card__sub">${t("wr.target.subtitle")}</p>
            </div>
          </div>
          <div class="field">
            <label class="field__label">${t("wr.target.label")}</label>
            <select class="select mono" @change=${(e: Event) => {
              const v = (e.target as HTMLSelectElement).value;
              this._blockIndex = v === "" ? null : parseInt(v, 10);
            }}>
              <option value="" ?selected=${this._blockIndex === null}>${t("wr.target.all_blocks")}</option>
              ${schedule.blocks.map((b, i) => html`
                <option value="${i}" ?selected=${this._blockIndex === i}>
                  #${i + 1} · ${fmtHour(resolveBlockTime(b, "start"))} → ${fmtHour(resolveBlockTime(b, "end"))} · ${b.action?.id || "—"}
                </option>
              `)}
            </select>
          </div>
        </div>

        <div class="card">
          <div class="card__header">
            <div style="flex:1">
              <h3 class="card__title">${t("wr.effect.title")}</h3>
              <p class="card__sub">${t("wr.effect.subtitle")}</p>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:6px">
            ${EFFECTS.map((e) => html`
              <button class="tile-pick" data-selected="${this._effect === e.key}"
                @click=${() => { this._effect = e.key; this._initEffectDefaults(typeActions); }}>
                <div class="tile-pick__name">${t("wr.effect." + e.key)}</div>
                <div class="tile-pick__desc">${t("wr.effect." + e.key + ".desc")}</div>
              </button>
            `)}
          </div>
        </div>

        ${effectMeta.needsIf ? this._renderIfSection(weatherAttrs, varDef) : this._renderScaleVarSection(weatherAttrs)}

        <div class="row" style="justify-content:flex-end;gap:8px">
          <button class="btn" @click=${() => this.card.navigate("editor")}>${t("common.cancel")}</button>
          <button class="btn btn--primary" @click=${() => this._saveRule(schedule, varDef, typeActions)}>
            ${icon("check", 14)} ${t("common.save")}
          </button>
        </div>
      </div>
    `;
  }

  private _renderPreviewBanner(schedule: any) {
    const summary = this._buildThenText();
    const tgt = this._blockIndex !== null
      ? `${t("wr.target.label")} #${this._blockIndex + 1}`
      : t("wr.target.all_blocks");
    return html`
      <div class="card" style="padding:14px 18px;background:var(--bg-sunken)">
        <div class="rule-block" style="background:var(--surface);border:2px dashed var(--border)">
          <span class="rule-block__label rule-block__label--if">${tgt}</span>
          ${EFFECTS.find((e) => e.key === this._effect)?.needsIf ? html`
            <span class="rule-token mono text-xs">if</span>
            <span class="rule-token rule-token--weather">${attrLabel(this._variable)} ${this._op} ${this._value}${(this.card._weatherAttributes.find((v) => v.key === this._variable)?.unit) || ""}</span>
          ` : nothing}
          <span class="rule-block__label rule-block__label--then">${t("wr.effect." + this._effect)}</span>
          <span class="rule-token rule-token--accent">${summary}</span>
        </div>
      </div>
    `;
  }

  private _renderIfSection(weatherAttrs: any[], varDef: any) {
    return html`
      <div class="grid-2">
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("wr.if.title")}</h3><p class="card__sub">${t("wr.if.subtitle")}</p></div></div>
          <div class="col" style="gap:12px">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;max-height:380px;overflow-y:auto;padding-right:4px">
              ${weatherAttrs.map((v) => html`
                <button class="tile-pick" data-selected="${this._variable === v.key}" @click=${() => { this._variable = v.key; }} style="padding:10px">
                  <div class="row" style="gap:8px">
                    <div class="tile-pick__icon" style="width:28px;height:28px">${icon(v.icon, 14)}</div>
                    <div style="min-width:0;flex:1">
                      <div class="tile-pick__name" style="font-size:12.5px">${attrLabel(v.key, v.label)}</div>
                      <div class="tile-pick__desc mono" style="font-size:10.5px">${v.key}${v.unit ? ` · ${v.unit}` : ""}</div>
                    </div>
                  </div>
                </button>
              `)}
            </div>
            <div class="grid-2">
              <div class="field">
                <label class="field__label">${t("wr.op")}</label>
                <select class="select mono" @change=${(e: Event) => { this._op = (e.target as HTMLSelectElement).value; }}>
                  ${varDef?.type === "enum"
                    ? html`
                        <option value="==" ?selected=${this._op === "=="}>uguale a (==)</option>
                        <option value="!=" ?selected=${this._op === "!="}>diverso da (!=)</option>`
                    : html`
                        <option value=">" ?selected=${this._op === ">"}>&gt;</option>
                        <option value=">=" ?selected=${this._op === ">="}>&ge;</option>
                        <option value="<" ?selected=${this._op === "<"}>&lt;</option>
                        <option value="<=" ?selected=${this._op === "<="}>&le;</option>
                        <option value="==" ?selected=${this._op === "=="}>=</option>
                        <option value="!=" ?selected=${this._op === "!="}>≠</option>`}
                </select>
              </div>
              <div class="field">
                <label class="field__label">${t("wr.threshold")}</label>
                ${varDef?.type === "enum"
                  ? html`<select class="select" @change=${(e: Event) => { this._value = (e.target as HTMLSelectElement).value; }}>
                      ${(varDef.options || []).map((o: string) => html`<option value="${o}" ?selected=${this._value === o}>${o}</option>`)}
                    </select>`
                  : html`<input class="input mono" .value=${this._value} @input=${(e: InputEvent) => { this._value = (e.target as HTMLInputElement).value; }}/>`}
              </div>
            </div>
          </div>
        </div>
        ${this._renderEffectCard()}
      </div>
    `;
  }

  private _renderScaleVarSection(weatherAttrs: any[]) {
    const varDef = weatherAttrs.find((v) => v.key === this._scaleVar);
    return html`
      <div class="grid-2">
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("wr.scale.input.title")}</h3><p class="card__sub">${t("wr.scale.input.subtitle")}</p></div></div>
          <div class="col" style="gap:12px">
            <div class="field">
              <label class="field__label">${t("wr.scale.var")}</label>
              <select class="select mono" @change=${(e: Event) => { this._scaleVar = (e.target as HTMLSelectElement).value; }}>
                ${weatherAttrs.filter((v) => v.type === "number").map((v) => html`
                  <option value="${v.key}" ?selected=${this._scaleVar === v.key}>${attrLabel(v.key, v.label)}${v.unit ? ` (${v.unit})` : ""}</option>
                `)}
              </select>
            </div>
            <div class="grid-2">
              <div class="field">
                <label class="field__label">${t("wr.scale.var_min")} ${varDef?.unit ? html`<span class="text-mute">(${varDef.unit})</span>` : nothing}</label>
                <input type="number" class="input mono" step="0.5" .value=${String(this._scaleVarMin)}
                  @input=${(e: InputEvent) => { const x = parseFloat((e.target as HTMLInputElement).value); if (!isNaN(x)) this._scaleVarMin = x; }}/>
              </div>
              <div class="field">
                <label class="field__label">${t("wr.scale.var_max")} ${varDef?.unit ? html`<span class="text-mute">(${varDef.unit})</span>` : nothing}</label>
                <input type="number" class="input mono" step="0.5" .value=${String(this._scaleVarMax)}
                  @input=${(e: InputEvent) => { const x = parseFloat((e.target as HTMLInputElement).value); if (!isNaN(x)) this._scaleVarMax = x; }}/>
              </div>
            </div>
            <span class="field__hint">${t("wr.scale.input.hint")}</span>
          </div>
        </div>
        ${this._renderEffectCard()}
      </div>
    `;
  }

  private _renderEffectCard() {
    return html`
      <div class="card">
        <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("wr.effect_params.title")}</h3><p class="card__sub">${t("wr.effect." + this._effect + ".desc")}</p></div></div>
        ${this._renderEffectParams(getActionsForType(this.card._schedules.find((s) => s.id === this.card._selectedId)?.device_type || "thermostat"))}
      </div>
    `;
  }

  private _renderEffectParams(typeActions: any[]) {
    const e = this._effect;
    if (e === "skip") {
      return html`<p class="text-sm text-mute" style="margin:0">${t("wr.effect.skip.desc")}</p>`;
    }
    if (e === "shift") {
      return html`
        <div class="col" style="gap:10px">
          <div class="field">
            <label class="field__label">${t("wr.delta")} (${t("common.min")})</label>
            <input type="number" class="input mono" step="5" .value=${String(this._deltaMin)}
              @input=${(e2: InputEvent) => { const x = parseInt((e2.target as HTMLInputElement).value, 10); if (!isNaN(x)) this._deltaMin = x; }}
              placeholder="es. 30 / -30"/>
          </div>
          ${this._renderFireMode()}
        </div>
      `;
    }
    if (e === "extend" || e === "shrink") {
      return html`
        <div class="col" style="gap:10px">
          <div class="field">
            <label class="field__label">${t("wr.delta")} (${t("common.min")})</label>
            <input type="number" class="input mono" step="5" min="1" .value=${String(this._deltaMin)}
              @input=${(e2: InputEvent) => { const x = parseInt((e2.target as HTMLInputElement).value, 10); if (!isNaN(x)) this._deltaMin = x; }}/>
          </div>
          ${this._renderDirection()}
          ${this._renderFireMode()}
        </div>
      `;
    }
    if (e === "force_action") {
      const def = typeActions.find((a) => a.id === this._actionId);
      return html`
        <div class="col" style="gap:10px">
          <div class="field">
            <label class="field__label">${t("wr.action.force")}</label>
            <select class="select" @change=${(e2: Event) => this._setForceAction((e2.target as HTMLSelectElement).value, typeActions)}>
              <option value="" ?selected=${!this._actionId}>—</option>
              ${typeActions.map((a) => html`<option value="${a.id}" ?selected=${this._actionId === a.id}>${a.label}</option>`)}
            </select>
          </div>
          ${def?.value ? this._renderValueField(def, this._actionValue, (v) => { this._actionValue = v; }) : nothing}
          ${this._renderFireMode()}
        </div>
      `;
    }
    if (e === "replace_value") {
      const sched = this.card._schedules.find((s) => s.id === this.card._selectedId);
      const block = sched && this._blockIndex !== null ? sched.blocks[this._blockIndex] : null;
      if (!block) return html`<p class="text-sm text-mute" style="margin:0">${t("wr.replace_value.pick_block")}</p>`;
      const def = typeActions.find((a) => a.id === block.action?.id);
      if (!def?.value) return html`<p class="text-sm text-mute" style="margin:0">${t("wr.replace_value.no_value")}</p>`;
      return html`
        <div class="col" style="gap:10px">
          ${this._renderValueField(def, this._actionValue, (v) => { this._actionValue = v; })}
          ${this._renderFireMode()}
        </div>
      `;
    }
    if (e === "scale_duration") {
      return html`
        <div class="col" style="gap:10px">
          <div class="grid-2">
            <div class="field">
              <label class="field__label">${t("wr.scale.out_min")} (${t("common.min")})</label>
              <input type="number" class="input mono" step="5" min="1" .value=${String(this._scaleOutMin)}
                @input=${(e: InputEvent) => { const x = parseInt((e.target as HTMLInputElement).value, 10); if (!isNaN(x)) this._scaleOutMin = x; }}/>
            </div>
            <div class="field">
              <label class="field__label">${t("wr.scale.out_max")} (${t("common.min")})</label>
              <input type="number" class="input mono" step="5" min="1" .value=${String(this._scaleOutMax)}
                @input=${(e: InputEvent) => { const x = parseInt((e.target as HTMLInputElement).value, 10); if (!isNaN(x)) this._scaleOutMax = x; }}/>
            </div>
          </div>
          ${this._renderDirection()}
        </div>
      `;
    }
    if (e === "scale_value") {
      const sched = this.card._schedules.find((s) => s.id === this.card._selectedId);
      const block = sched && this._blockIndex !== null ? sched.blocks[this._blockIndex] : null;
      const def = block ? typeActions.find((a) => a.id === block.action?.id) : null;
      const unit = def?.value?.unit || "";
      return html`
        <div class="col" style="gap:10px">
          <div class="grid-2">
            <div class="field">
              <label class="field__label">${t("wr.scale.out_min")} ${unit ? html`<span class="text-mute">(${unit})</span>` : nothing}</label>
              <input type="number" class="input mono" step="${def?.value?.step || 1}" .value=${String(this._scaleOutMin)}
                @input=${(e: InputEvent) => { const x = parseFloat((e.target as HTMLInputElement).value); if (!isNaN(x)) this._scaleOutMin = x; }}/>
            </div>
            <div class="field">
              <label class="field__label">${t("wr.scale.out_max")} ${unit ? html`<span class="text-mute">(${unit})</span>` : nothing}</label>
              <input type="number" class="input mono" step="${def?.value?.step || 1}" .value=${String(this._scaleOutMax)}
                @input=${(e: InputEvent) => { const x = parseFloat((e.target as HTMLInputElement).value); if (!isNaN(x)) this._scaleOutMax = x; }}/>
            </div>
          </div>
        </div>
      `;
    }
    return nothing;
  }

  private _renderDirection() {
    return html`
      <div class="field">
        <label class="field__label">${t("wr.direction.label")}</label>
        <div class="segmented">
          <button data-active="${this._direction === "forward"}" @click=${() => { this._direction = "forward"; }}>${t("wr.direction.forward")}</button>
          <button data-active="${this._direction === "backward"}" @click=${() => { this._direction = "backward"; }}>${t("wr.direction.backward")}</button>
        </div>
        <span class="field__hint">${t("wr.direction.hint")}</span>
      </div>
    `;
  }

  private _renderFireMode() {
    return html`
      <div class="field">
        <label class="field__label">${t("wr.fire_mode.label")}</label>
        <select class="select" @change=${(e: Event) => { this._fireMode = (e.target as HTMLSelectElement).value as any; }}>
          <option value="every" ?selected=${this._fireMode === "every"}>${t("wr.fire_mode.every")}</option>
          <option value="once_per_day" ?selected=${this._fireMode === "once_per_day"}>${t("wr.fire_mode.once_per_day")}</option>
          <option value="once_per_daytime" ?selected=${this._fireMode === "once_per_daytime"}>${t("wr.fire_mode.once_per_daytime")}</option>
          <option value="once_per_nighttime" ?selected=${this._fireMode === "once_per_nighttime"}>${t("wr.fire_mode.once_per_nighttime")}</option>
        </select>
      </div>
    `;
  }

  private _renderValueField(def: any, current: number | string | null, onChange: (v: number | string) => void) {
    const v = def.value;
    const cur = current ?? v.default;
    return html`
      <div class="field">
        <label class="field__label">${v.label || t("common.value")} ${v.unit ? html`<span class="text-mute">(${v.unit})</span>` : nothing}</label>
        ${v.type === "number" ? html`
          <div class="row" style="gap:10px;align-items:center">
            <input type="range" min="${v.min}" max="${v.max}" step="${v.step}" .value=${String(cur)}
              @input=${(e: InputEvent) => onChange(parseFloat((e.target as HTMLInputElement).value))}
              style="flex:1"/>
            <input type="number" class="input mono" min="${v.min}" max="${v.max}" step="${v.step}" .value=${String(cur)}
              @input=${(e: InputEvent) => { const x = parseFloat((e.target as HTMLInputElement).value); if (!isNaN(x)) onChange(x); }}
              style="width:90px;text-align:right;font-weight:600"/>
            <span class="mono text-mute" style="min-width:30px">${v.unit || ""}</span>
          </div>
        ` : v.type === "enum" ? html`
          <select class="select" @change=${(e: Event) => onChange((e.target as HTMLSelectElement).value)}>
            ${(v.options || []).map((o: string) => html`<option value="${o}" ?selected=${String(cur) === o}>${o}</option>`)}
          </select>
        ` : nothing}
      </div>
    `;
  }

  private _setForceAction(actionId: string, typeActions: any[]) {
    this._actionId = actionId;
    const def = typeActions.find((a) => a.id === actionId);
    this._actionValue = def?.value ? def.value.default ?? null : null;
  }

  private _initEffectDefaults(typeActions: any[]) {
    if (this._effect === "force_action" && !this._actionId && typeActions.length) {
      this._setForceAction(typeActions[0].id, typeActions);
    }
  }

  private _findConflicts(schedule: any): string[] {
    if (this._blockIndex === null) return [];
    const target = this._blockIndex;
    const result: string[] = [];
    for (const r of (schedule.weather_rules || [])) {
      if (!r.active) continue;
      if (r.block_index === target || r.block_index === null || r.block_index === undefined) {
        if (r.effect === this._effect || (r.effect && (r.effect.startsWith("scale_") || r.effect.startsWith("duration") || ["extend","shrink"].includes(r.effect)) && (this._effect.startsWith("scale_") || ["extend","shrink"].includes(this._effect)))) {
          result.push(`${r.if || "(no condition)"} → ${t("wr.effect." + (r.effect || "skip"))}`);
        }
      }
    }
    return result;
  }

  private _buildThenText(): string {
    const e = this._effect;
    if (e === "skip") return t("wr.action.skip");
    if (e === "shift") return `${this._deltaMin > 0 ? "+" : ""}${this._deltaMin} ${t("common.min")}`;
    if (e === "extend") return `+${this._deltaMin} ${t("common.min")} ${t("wr.direction." + this._direction).toLowerCase()}`;
    if (e === "shrink") return `-${this._deltaMin} ${t("common.min")} ${t("wr.direction." + this._direction).toLowerCase()}`;
    if (e === "force_action") return `${t("wr.action.force")}: ${this._actionId}${this._actionValue !== null ? ` = ${this._actionValue}` : ""}`;
    if (e === "replace_value") return `${t("wr.effect.replace_value")} = ${this._actionValue}`;
    if (e === "scale_duration") return `${this._scaleOutMin}-${this._scaleOutMax} ${t("common.min")} ← ${this._scaleVar} ${this._scaleVarMin}-${this._scaleVarMax}`;
    if (e === "scale_value") return `${this._scaleOutMin}-${this._scaleOutMax} ← ${this._scaleVar} ${this._scaleVarMin}-${this._scaleVarMax}`;
    return "";
  }

  private async _saveRule(schedule: any, varDef: any, typeActions: any[]) {
    const ifText = this._buildIfText(varDef);
    const thenText = this._buildThenText();
    const rule: WeatherRule = {
      active: true,
      if: ifText,
      then: thenText,
      effect: this._effect,
      block_index: this._blockIndex,
    };
    if (this._effect === "shift" || this._effect === "extend" || this._effect === "shrink") {
      rule.delta_minutes = Math.abs(this._deltaMin);
      rule.direction = this._direction;
    }
    if (this._effect === "force_action") {
      rule.action_id = this._actionId;
      if (this._actionValue !== null) rule.action_value = this._actionValue;
      rule.fire_mode = this._fireMode;
    }
    if (this._effect === "replace_value") {
      if (this._actionValue !== null) rule.action_value = this._actionValue;
      rule.fire_mode = this._fireMode;
    }
    if (this._effect === "scale_duration" || this._effect === "scale_value") {
      rule.scale_var = this._scaleVar;
      rule.scale_var_min = this._scaleVarMin;
      rule.scale_var_max = this._scaleVarMax;
      rule.scale_out_min = this._scaleOutMin;
      rule.scale_out_max = this._scaleOutMax;
      if (this._effect === "scale_duration") rule.direction = this._direction;
    }
    const newRules = [...(schedule.weather_rules || []), rule];
    this.card.updateScheduleLocal(schedule.id, { weather_rules: newRules });
    this.card.navigate("editor");
  }

  private _buildIfText(varDef: any): string {
    if (!EFFECTS.find((e) => e.key === this._effect)?.needsIf) return "";
    return `${this._variable} ${this._op} ${this._value}${varDef?.unit || ""}`;
  }
}
