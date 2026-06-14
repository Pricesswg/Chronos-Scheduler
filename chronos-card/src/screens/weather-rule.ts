import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon } from "../icons";
import { getActionsForType } from "../actions";
import { fmtHour, resolveBlockTime } from "../utils";
import { t, attrLabel, actionDefLabel } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import type { Block, RuleEffect, RuleTarget, WeatherRule } from "../types";
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

/** Effects whose parameters depend on the device type (action ids, value
 * specs). Multi-schedule targets must share the device type for these. */
const VALUE_EFFECTS: RuleEffect[] = ["force_action", "replace_value", "scale_value"];

@customElement("chronos-weather-rule")
export class ChronosWeatherRule extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  // Tracks which rule the builder is currently mirroring, so we can detect
  // when the user navigated in for editing a (possibly different) rule and
  // refresh the form state.
  private _hydratedFor: string = "";

  // Common. Targets: which schedules (and which block of each) this rule
  // applies to. At least one target at all times.
  @state() private _targets: RuleTarget[] = [];
  @state() private _effect: RuleEffect = "skip";

  /** Free-text filter applied to the sensor dropdown(s). Shared across clauses
   * because the user only types into one at a time anyway. */
  @state() private _sensorSearch = "";

  // IF condition (used by all except scale_*). Multi-clause AND composition
  // since v1.10: each clause is a single comparison; all must be true for the
  // rule to fire. Clause variables can be weather attribute keys (temperature,
  // sun.minutes_until_sunset, …) or arbitrary HA entity_ids that the backend
  // reads directly (sensor.battery_soc, binary_sensor.X, …).
  @state() private _clauses: { variable: string; op: string; value: string }[] = [
    { variable: "temperature", op: ">", value: "22" },
  ];

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
    this._hydrate();
    const schedule = this._contextSchedule();
    if (!schedule) return html`
      <div class="card" style="text-align:center;padding:40px;color:var(--text-muted)">
        <div style="font-weight:600;color:var(--text);font-size:14px">${t("overview.no_schedules")}</div>
        <div style="font-size:12.5px;margin-top:4px">${t("overview.no_schedules.cta")}</div>
        <button class="btn btn--primary" style="margin-top:16px" @click=${() => this.card.navigate("wizard")}>
          ${icon("plus", 14)} ${t("nav.new_schedule")}
        </button>
      </div>
    `;

    const deviceType = schedule.device_type;
    const typeActions = getActionsForType(deviceType);
    const weatherAttrs = this.card._weatherAttributes;
    const effectMeta = EFFECTS.find((e) => e.key === this._effect)!;
    const conflicts = this._findConflicts(schedule);

    return html`
      <div class="col" style="gap:22px;max-width:1100px">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${() => this.card.navigate("weatherRulesList")}>
            ${icon("chevron-left", 14)} ${t("nav.weather_rules")}
          </button>
          <h1 class="page-title" style="margin-top:6px">${this.card._editingRuleId ? t("wr.heading.edit") : t("wr.heading")}</h1>
          <p class="page-sub">${t("wr.subtitle")}</p>
        </div>

        ${this._renderTargetsCard(schedule)}

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

        ${effectMeta.needsIf ? this._renderIfSection(weatherAttrs) : this._renderScaleVarSection(weatherAttrs)}

        <div class="builder-actions">
          <span class="text-xs text-mute" style="margin-right:auto">${this.card._editingRuleId ? t("wr.heading.edit") : t("wr.heading")}</span>
          <button class="btn" @click=${() => this.card.navigate("weatherRulesList")}>${t("common.cancel")}</button>
          <button class="btn btn--primary" @click=${() => this._saveRule(schedule, typeActions)}>
            ${icon("check", 14)} ${t("common.save")}
          </button>
        </div>
      </div>
    `;
  }

  private _scheduleFor(id: string) {
    return this.card._schedules.find((s) => s.id === id);
  }

  /** The schedule providing editing context (actions, block lists for the
   * params panel): the first target's schedule. */
  private _contextSchedule() {
    for (const tg of this._targets) {
      const s = this._scheduleFor(tg.schedule_id);
      if (s) return s;
    }
    return this.card._schedules.find((s) => s.id === this.card._selectedId) || this.card._schedules[0];
  }

  private _isValueEffect(): boolean {
    return VALUE_EFFECTS.includes(this._effect);
  }

  /** Targets card: one row per (schedule, block) the rule applies to. For
   * device-specific effects, additional schedules must share the first
   * target's device type. */
  private _renderTargetsCard(schedule: any) {
    const valueEffect = this._isValueEffect();
    const firstType = schedule.device_type;
    return html`
      <div class="card">
        <div class="card__header">
          <div style="flex:1">
            <h3 class="card__title">${t("wr.targets.title")}</h3>
            <p class="card__sub">${t("wr.targets.subtitle")}</p>
          </div>
        </div>
        <div class="col" style="gap:8px">
          ${this._targets.map((tg, idx) => {
            const sched = this._scheduleFor(tg.schedule_id);
            const incompatible = !!(valueEffect && sched && sched.device_type !== firstType);
            return html`
              <div class="row" style="gap:8px;flex-wrap:wrap;align-items:center;padding:10px 12px;background:var(--bg-sunken);border-radius:var(--r-md);${incompatible ? "outline:1px solid var(--danger)" : ""}">
                <select class="select mono" style="flex:1;min-width:180px"
                  @change=${(e: Event) => this._patchTarget(idx, { schedule_id: (e.target as HTMLSelectElement).value, block_index: null })}>
                  ${this.card._schedules.map((s) => html`
                    <option value="${s.id}" ?selected=${tg.schedule_id === s.id}
                      ?disabled=${valueEffect && idx > 0 && s.device_type !== firstType}>
                      ${s.name}
                    </option>
                  `)}
                </select>
                <select class="select mono" style="flex:1;min-width:170px"
                  @change=${(e: Event) => {
                    const v = (e.target as HTMLSelectElement).value;
                    this._patchTarget(idx, { block_index: v === "" ? null : parseInt(v, 10) });
                  }}>
                  <option value="" ?selected=${tg.block_index === null || tg.block_index === undefined}>${t("wr.target.all_blocks")}</option>
                  ${(sched?.blocks || []).map((b: Block, i: number) => html`
                    <option value="${i}" ?selected=${tg.block_index === i}>
                      #${i + 1} · ${fmtHour(resolveBlockTime(b, "start"))} → ${fmtHour(resolveBlockTime(b, "end"))} · ${b.action?.id || "—"}
                    </option>
                  `)}
                </select>
                ${incompatible ? html`<span class="text-xs" style="color:var(--danger)">${t("wr.targets.incompatible")}</span>` : nothing}
                ${this._targets.length > 1 ? html`
                  <button class="btn btn--icon btn--ghost btn--sm" title="${t("common.remove")}"
                    @click=${() => { this._targets = this._targets.filter((_, i) => i !== idx); }}>
                    ${icon("close", 12)}
                  </button>
                ` : nothing}
              </div>
            `;
          })}
          <button class="btn btn--sm" style="align-self:flex-start" @click=${() => this._addTarget(schedule)}>
            ${icon("plus", 12)} ${t("wr.targets.add")}
          </button>
          <span class="field__hint">${t("wr.targets.hint")}</span>
        </div>
      </div>
    `;
  }

  private _patchTarget(idx: number, patch: Partial<{ schedule_id: string; block_index: number | null }>) {
    this._targets = this._targets.map((tg, i) => (i === idx ? { ...tg, ...patch } : tg));
  }

  private _addTarget(contextSchedule: any) {
    const valueEffect = this._isValueEffect();
    const targeted = new Set(this._targets.map((tg) => tg.schedule_id));
    const pool = this.card._schedules.filter(
      (s) => !valueEffect || s.device_type === contextSchedule.device_type,
    );
    const next = pool.find((s) => !targeted.has(s.id)) || pool[0];
    if (!next) return;
    this._targets = [...this._targets, { schedule_id: next.id, block_index: null }];
  }

  private _renderPreviewBanner(schedule: any) {
    const summary = this._buildThenText();
    const first = this._targets[0];
    const firstBlock = first && first.block_index !== null && first.block_index !== undefined
      ? ` #${first.block_index + 1}`
      : "";
    const extra = this._targets.length > 1 ? ` +${this._targets.length - 1}` : "";
    const tgt = `${schedule.name}${firstBlock}${extra}`;
    return html`
      <div class="card" style="padding:14px 18px;background:var(--bg-sunken)">
        <div class="rule-block" style="background:var(--surface);border:2px dashed var(--border);flex-wrap:wrap">
          <span class="rule-block__label rule-block__label--if">${tgt}</span>
          ${EFFECTS.find((e) => e.key === this._effect)?.needsIf ? html`
            <span class="rule-token mono text-xs">if</span>
            ${this._clauses.map((c, i) => html`
              ${i > 0 ? html`<span class="rule-token mono text-xs" style="opacity:0.6">AND</span>` : nothing}
              <span class="rule-token rule-token--weather">${this._clauseLabel(c)}</span>
            `)}
          ` : nothing}
          <span class="rule-block__label rule-block__label--then">${t("wr.effect." + this._effect)}</span>
          <span class="rule-token rule-token--accent">${summary}</span>
        </div>
      </div>
    `;
  }

  /** Compact label for a single clause used in the preview banner. */
  private _clauseLabel(c: { variable: string; op: string; value: string }): string {
    const wa = this.card._weatherAttributes.find((v) => v.key === c.variable);
    const label = wa ? attrLabel(c.variable) : this._sensorFriendlyName(c.variable);
    const unit = wa?.unit || "";
    return `${label} ${c.op} ${c.value}${unit}`;
  }

  private _sensorFriendlyName(entityId: string): string {
    const s = this.card._sensorEntities?.find((e: any) => e.entity_id === entityId);
    return s?.friendly_name || entityId;
  }

  /** Numeric sensor entities, derived from _sensorEntities. We keep the list
   * filtered to entities whose state parses as a finite number (or whose
   * device_class hints "numeric"). Pure boolean/enum sensors don't make sense
   * as IF threshold operands so we skip them. */
  private _numericSensors(): any[] {
    const all = this.card._sensorEntities || [];
    return all.filter((s: any) => {
      if (s.unit_of_measurement) return true;
      const f = parseFloat(s.state);
      return Number.isFinite(f);
    });
  }

  private _renderIfSection(weatherAttrs: any[]) {
    return html`
      <div class="grid-2">
        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("wr.if.title")}</h3><p class="card__sub">${t("wr.if.subtitle.and")}</p></div></div>
          <div class="col" style="gap:14px">
            ${this._clauses.map((c, idx) => this._renderClause(c, idx, weatherAttrs))}
            <button class="btn btn--sm" style="align-self:flex-start"
              @click=${() => { this._clauses = [...this._clauses, { variable: "temperature", op: ">", value: "22" }]; }}>
              ${icon("plus", 12)} ${t("wr.if.add_and")}
            </button>
          </div>
        </div>
        ${this._renderEffectCard()}
      </div>
    `;
  }

  private _renderClause(c: { variable: string; op: string; value: string }, idx: number, weatherAttrs: any[]) {
    const varDef = weatherAttrs.find((v) => v.key === c.variable);
    const sensors = this._numericSensors();
    const isSensorRef = !varDef && /^[\w]+\./.test(c.variable);
    return html`
      <div class="card card--ghost" style="padding:12px 14px">
        <div class="sp-between" style="margin-bottom:10px">
          <span class="text-xs text-mute mono">${idx === 0 ? t("wr.if.first") : t("wr.if.and")}</span>
          ${this._clauses.length > 1 ? html`
            <button class="btn btn--icon btn--ghost btn--sm" title="${t("common.remove")}"
              @click=${() => { this._clauses = this._clauses.filter((_, i) => i !== idx); }}>
              ${icon("close", 12)}
            </button>
          ` : nothing}
        </div>
        <div class="col" style="gap:10px">
          <div class="grid-2 wr-vars">
            ${weatherAttrs.map((v) => html`
              <button class="tile-pick" data-selected="${c.variable === v.key}"
                @click=${() => this._setClauseVariable(idx, v.key)} style="padding:10px">
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
          ${this._renderSensorSelect(c, idx, sensors, isSensorRef)}
          <div class="grid-2">
            <div class="field">
              <label class="field__label">${t("wr.op")}</label>
              <select class="select mono" @change=${(e: Event) => this._patchClause(idx, { op: (e.target as HTMLSelectElement).value })}>
                ${varDef?.type === "enum"
                  ? html`
                      <option value="==" ?selected=${c.op === "=="}>${t("wr.op.eq")} (==)</option>
                      <option value="!=" ?selected=${c.op === "!="}>${t("wr.op.neq")} (!=)</option>`
                  : html`
                      <option value=">" ?selected=${c.op === ">"}>&gt;</option>
                      <option value=">=" ?selected=${c.op === ">="}>&ge;</option>
                      <option value="<" ?selected=${c.op === "<"}>&lt;</option>
                      <option value="<=" ?selected=${c.op === "<="}>&le;</option>
                      <option value="==" ?selected=${c.op === "=="}>=</option>
                      <option value="!=" ?selected=${c.op === "!="}>≠</option>`}
              </select>
            </div>
            <div class="field">
              <label class="field__label">${t("wr.threshold")}</label>
              ${varDef?.type === "enum"
                ? html`<select class="select" @change=${(e: Event) => this._patchClause(idx, { value: (e.target as HTMLSelectElement).value })}>
                    ${(varDef.options || []).map((o: string) => html`<option value="${o}" ?selected=${c.value === o}>${o}</option>`)}
                  </select>`
                : html`<input class="input mono" .value=${c.value}
                    @input=${(e: InputEvent) => this._patchClause(idx, { value: (e.target as HTMLInputElement).value })}/>`}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderSensorSelect(c: { variable: string; op: string; value: string }, idx: number, sensors: any[], isSensorRef: boolean) {
    const q = this._sensorSearch.trim().toLowerCase();
    // Always include the currently selected sensor (if any) so it stays
    // visible after the user typed something else; everything else gets
    // filtered by the query.
    const visible = q
      ? sensors.filter((s: any) => {
          if (s.entity_id === c.variable) return true;
          const haystack = `${s.friendly_name || ""} ${s.entity_id || ""} ${s.unit_of_measurement || ""}`.toLowerCase();
          return haystack.includes(q);
        })
      : sensors;
    return html`
      <div class="field">
        <label class="field__label">${t("wr.if.sensor.label")}</label>
        <div class="row" style="gap:6px;align-items:center">
          <input class="input" type="search" .value=${this._sensorSearch}
            placeholder="${t("wr.if.sensor.search")}"
            @input=${(e: InputEvent) => { this._sensorSearch = (e.target as HTMLInputElement).value; }}
            style="flex:1"/>
          ${this._sensorSearch ? html`
            <button class="btn btn--icon btn--ghost btn--sm" title="${t("common.remove")}"
              @click=${() => { this._sensorSearch = ""; }}>
              ${icon("close", 12)}
            </button>
          ` : nothing}
        </div>
        <select class="select mono" style="margin-top:6px"
          @change=${(e: Event) => {
            const v = (e.target as HTMLSelectElement).value;
            if (v) this._setClauseVariable(idx, v);
          }}>
          <option value="" ?selected=${!isSensorRef}>${t("wr.if.sensor.none")}</option>
          ${visible.map((s: any) => html`
            <option value="${s.entity_id}" ?selected=${c.variable === s.entity_id}>
              ${s.friendly_name || s.entity_id}${s.unit_of_measurement ? ` (${s.unit_of_measurement})` : ""} — ${s.entity_id}
            </option>
          `)}
          ${q && !visible.length ? html`<option disabled>${t("wr.if.sensor.no_match")}</option>` : nothing}
        </select>
        <span class="field__hint">${t("wr.if.sensor.hint")}</span>
      </div>
    `;
  }

  private _setClauseVariable(idx: number, variable: string) {
    this._patchClause(idx, { variable });
    // If switching to/from an enum-typed weather attribute, normalise the op.
    const wa = this.card._weatherAttributes.find((v) => v.key === variable);
    if (wa?.type === "enum") {
      const cur = this._clauses[idx];
      if (cur.op !== "==" && cur.op !== "!=") this._patchClause(idx, { op: "==" });
    }
  }

  private _patchClause(idx: number, patch: Partial<{ variable: string; op: string; value: string }>) {
    this._clauses = this._clauses.map((c, i) => (i === idx ? { ...c, ...patch } : c));
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
        ${this._renderEffectParams(getActionsForType(this._contextSchedule()?.device_type || "thermostat"))}
      </div>
    `;
  }

  /** First target's (schedule, block) pair, used by replace_value and
   * scale_value to read the block's action definition. */
  private _firstTargetBlock(): { sched: any; block: Block | null } {
    const first = this._targets[0];
    const sched = first ? this._scheduleFor(first.schedule_id) : undefined;
    const block = sched && first && first.block_index !== null && first.block_index !== undefined
      ? sched.blocks[first.block_index] || null
      : null;
    return { sched, block };
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
              placeholder="${t("wr.delta.placeholder")}"/>
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
              ${typeActions.map((a) => {
                const dt = this._contextSchedule()?.device_type || "thermostat";
                return html`<option value="${a.id}" ?selected=${this._actionId === a.id}>${actionDefLabel(dt, a.id, a.label)}</option>`;
              })}
            </select>
          </div>
          ${def?.value ? this._renderValueField(def, this._actionValue, (v) => { this._actionValue = v; }) : nothing}
          ${this._renderFireMode()}
        </div>
      `;
    }
    if (e === "replace_value") {
      const { block } = this._firstTargetBlock();
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
      const { block } = this._firstTargetBlock();
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
    const first = this._targets[0];
    if (!first || first.block_index === null || first.block_index === undefined) return [];
    const target = first.block_index;
    const result: string[] = [];
    for (const r of this.card.rulesForSchedule(schedule.id)) {
      if (!r.active) continue;
      if (r.id && r.id === this.card._editingRuleId) continue;
      if (r.block_index === target || r.block_index === null || r.block_index === undefined) {
        const touchesDuration = (e: string) => e.startsWith("scale_") || e === "extend" || e === "shrink";
        if (r.effect === this._effect || (r.effect && touchesDuration(r.effect) && touchesDuration(this._effect))) {
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

  private async _saveRule(schedule: any, typeActions: any[]) {
    // Device-specific effects can't span device types: validate targets.
    if (this._isValueEffect()) {
      const firstType = schedule.device_type;
      const bad = this._targets.some((tg) => this._scheduleFor(tg.schedule_id)?.device_type !== firstType);
      if (bad) {
        alert(t("wr.targets.incompatible.alert"));
        return;
      }
    }
    if (!this._targets.length) return;
    const ifText = this._buildIfText();
    const thenText = this._buildThenText();
    const editingId = this.card._editingRuleId;
    const existing = editingId ? this.card._rules.find((r) => r.id === editingId) : undefined;
    // Preserve `active` flag when editing; default true on create.
    const rule: WeatherRule = {
      ...(editingId ? { id: editingId } : {}),
      active: existing?.active ?? true,
      if: ifText,
      then: thenText,
      effect: this._effect,
      targets: this._targets.map((tg) => ({
        schedule_id: tg.schedule_id,
        block_index: tg.block_index ?? null,
      })),
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
    await this.card.doSaveRule(rule);
    // The builder is a sub-page of the weather rules list: always return
    // there after saving, no matter where it was opened from. (Previously
    // it jumped to the first target's schedule editor, which landed the
    // user on an unrelated page when the rule targeted another schedule.)
    this.card.navigate("weatherRulesList");
  }

  /** Pre-fill the form fields. Edit mode mirrors the global rule pointed at
   * by card._editingRuleId; create mode resets to defaults with the
   * selected schedule as the initial target. */
  private _hydrate() {
    const ruleId = this.card._editingRuleId;
    const stamp = ruleId || `new:${this.card._selectedId}`;
    if (this._hydratedFor === stamp) return;
    this._hydratedFor = stamp;

    if (!ruleId) {
      // create mode — reset to defaults so re-entering from a list with a
      // different schedule doesn't carry stale state from a prior edit.
      const sid = this.card._selectedId || this.card._schedules[0]?.id || "";
      this._targets = sid ? [{ schedule_id: sid, block_index: null }] : [];
      this._effect = "skip";
      this._clauses = [{ variable: "temperature", op: ">", value: "22" }];
      this._deltaMin = 30;
      this._direction = "forward";
      this._actionId = "";
      this._actionValue = null;
      this._fireMode = "once_per_daytime";
      this._scaleVar = "temperature";
      this._scaleVarMin = 25;
      this._scaleVarMax = 35;
      this._scaleOutMin = 30;
      this._scaleOutMax = 120;
      return;
    }

    const r = this.card._rules.find((x) => x.id === ruleId);
    if (!r) return;
    this._effect = r.effect || "skip";
    this._targets = (r.targets || []).map((tg) => ({
      schedule_id: tg.schedule_id,
      block_index: tg.block_index ?? null,
    }));
    if (!this._targets.length) {
      const sid = this.card._selectedId || this.card._schedules[0]?.id || "";
      this._targets = sid ? [{ schedule_id: sid, block_index: null }] : [];
    }
    if (r.if) {
      const parsed = this._parseIfExpression(String(r.if));
      if (parsed.length) this._clauses = parsed;
    }
    if (r.delta_minutes !== undefined) this._deltaMin = r.delta_minutes;
    if (r.direction) this._direction = r.direction;
    if (r.action_id) this._actionId = r.action_id;
    this._actionValue = r.action_value !== undefined ? r.action_value : null;
    if (r.fire_mode) this._fireMode = r.fire_mode;
    if (r.scale_var) this._scaleVar = r.scale_var;
    if (r.scale_var_min !== undefined) this._scaleVarMin = r.scale_var_min;
    if (r.scale_var_max !== undefined) this._scaleVarMax = r.scale_var_max;
    if (r.scale_out_min !== undefined) this._scaleOutMin = r.scale_out_min;
    if (r.scale_out_max !== undefined) this._scaleOutMax = r.scale_out_max;
  }

  /** Parse an `if` string written by `_buildIfText` (or hand-rolled in YAML) and
   * return the structured clauses. Mirrors the backend `_split_and` + single-
   * comparison parser; we keep the value as a raw string (units stripped). */
  private _parseIfExpression(expr: string): { variable: string; op: string; value: string }[] {
    const out: { variable: string; op: string; value: string }[] = [];
    const parts = expr.split(/\s+AND\s+/i);
    for (const raw of parts) {
      const m = raw.trim().match(/^([\w.]+)\s*(>=|<=|!=|==|>|<)\s*(.*?)$/);
      if (!m) continue;
      const value = m[3].replace(/[^0-9.\-+a-zA-Z_]/g, "");
      out.push({ variable: m[1], op: m[2], value });
    }
    return out;
  }

  private _buildIfText(): string {
    if (!EFFECTS.find((e) => e.key === this._effect)?.needsIf) return "";
    return this._clauses
      .filter((c) => c.variable && c.op && c.value !== "")
      .map((c) => {
        const wa = this.card._weatherAttributes.find((v) => v.key === c.variable);
        const unit = wa?.unit || "";
        return `${c.variable} ${c.op} ${c.value}${unit}`;
      })
      .join(" AND ");
  }
}
