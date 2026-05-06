import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { getActionsForType, getActionDef, actionLabel, actionColor, KIND_COLORS, defaultAction } from "../actions";
import { fmtHour, getDays, DEVICE_TYPES, computeRepeat, resolveBlockTime } from "../utils";
import { t, actionDefLabel, actionValueLabel, actionExtraLabel } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import type { Block, Schedule } from "../types";
import "../timeline";

@customElement("chronos-editor")
export class ChronosEditor extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  @state() private _selectedBlockIdx = 0;
  @state() private _selectedRuleIdx: number = -1;
  @state() private _confirmDelete = false;
  /** Free-text filter applied to the entity multi-select chip grid. Kept on
   * the editor instance so the search box doesn't lose focus across re-renders. */
  @state() private _entitySearch = "";

  render() {
    const schedule = this.card._schedules.find((s) => s.id === this.card._selectedId) || this.card._schedules[0];
    if (!schedule) return html`<div class="text-mute" style="padding:40px;text-align:center">${t("overview.no_schedules")}</div>`;

    const block = schedule.blocks[this._selectedBlockIdx];
    const devices = (schedule.device_ids || []).map((id) => this.card._devices.find((d) => d.id === id)).filter(Boolean);
    const deviceType = schedule.device_type;
    const typeDef = DEVICE_TYPES[deviceType] || { label: deviceType };
    const availableActions = getActionsForType(deviceType);
    const currentActionDef = block?.action ? getActionDef(deviceType, block.action.id) : null;
    const isDirty = this.card.isDirty;

    return html`
      <div class="col" style="gap:18px">
        <div class="sp-between" style="align-items:flex-start;flex-wrap:wrap;row-gap:10px">
          <div style="min-width:0;flex:1 1 280px">
            <button class="btn btn--ghost btn--sm" @click=${() => this.card.navigate("overview")} style="margin-bottom:6px">
              ${icon("chevron-left", 14)} ${t("nav.overview")}
            </button>
            <input class="input" .value=${schedule.name}
              @input=${(e: InputEvent) => this.card.updateScheduleLocal(schedule.id, { name: (e.target as HTMLInputElement).value })}
              style="font-size:22px;font-weight:700;letter-spacing:-0.02em;border:1px solid transparent;background:transparent;padding:4px 8px;margin-left:-8px;width:100%;max-width:460px"/>
            <div class="row" style="margin-top:6px;gap:10px;flex-wrap:wrap">
              <span class="chip ${schedule.enabled ? "chip--on" : ""}"><span class="chip__dot"></span>${schedule.enabled ? t("schedule.active") : t("schedule.disabled")}</span>
              <span class="chip">${icon("repeat", 11)} ${computeRepeat(schedule.days)}</span>
              <span class="chip chip--accent">${deviceIcon(deviceType, 11)} ${typeDef.label}</span>
              ${deviceType !== "scene" && deviceType !== "automation" ? html`<span class="chip">${icon("device", 11)} ${devices.length}</span>` : nothing}
              ${(schedule.weather_rules || []).filter((r) => r.active).length > 0
                ? html`<span class="chip chip--weather">${icon("cloud", 11)} ${t("overview.rules_count", { n: (schedule.weather_rules || []).filter((r) => r.active).length })}</span>`
                : nothing}
            </div>
          </div>
          <div class="row" style="gap:10px;flex-shrink:0;flex-wrap:wrap">
            <label class="switch">
              <input type="checkbox" .checked=${schedule.enabled} @change=${(e: Event) => this.card.doToggleSchedule(schedule.id, (e.target as HTMLInputElement).checked)}/>
              <span class="switch__track"></span>
              <span class="switch__thumb"></span>
            </label>
            <button class="btn" style="color:var(--danger)" @click=${() => { this._confirmDelete = true; }} title="${t("common.delete")}">${icon("trash", 14)}</button>
            <button class="btn"
              style="background:${isDirty ? "var(--warn)" : "var(--ok)"};color:white;border-color:transparent;cursor:${isDirty ? "pointer" : "default"};font-weight:600;white-space:nowrap"
              @click=${() => { if (isDirty) this.card.saveCurrentSchedule(); }}>
              ${icon("check", 14)} ${isDirty ? t("editor.dirty.unsaved") : t("editor.dirty.saved")}
            </button>
          </div>
        </div>

        <div class="editor-cols">
          <div class="col" style="gap:16px">
            <!-- Timeline card -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1;min-width:0">
                  <h3 class="card__title">${t("wizard.step.time")}</h3>
                  <p class="card__sub">${t("editor.add_block_hint")}</p>
                </div>
                <div class="segmented">
                  ${(["linear", "radial", "list"] as const).map((v) => html`
                    <button data-active="${this.card._timelineVariant === v}" @click=${() => this.card.setTimelineVariant(v)}>
                      ${t("timeline." + v)}
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
                .previewRule=${this._selectedRuleIdx >= 0 ? schedule.weather_rules?.[this._selectedRuleIdx] : null}
                @block-select=${(e: CustomEvent) => { this._selectedBlockIdx = e.detail.index; }}
                @blocks-changed=${(e: CustomEvent) => { this.card.updateBlocksLocal(schedule.id, e.detail.blocks); }}
              ></chronos-timeline>
              <div class="row" style="margin-top:14px;justify-content:space-between;flex-wrap:wrap;gap:10px">
                <div class="row" style="gap:14px;flex-wrap:wrap">
                  ${availableActions.map((a) => html`
                    <div class="row" style="gap:6px">
                      <span style="width:10px;height:10px;border-radius:3px;background:${KIND_COLORS[a.kind]};display:inline-block"></span>
                      <span class="text-xs">${actionDefLabel(deviceType, a.id, a.label)}</span>
                    </div>
                  `)}
                </div>
                <button class="btn btn--sm" @click=${() => {
                  const newBlocks = [...schedule.blocks, { start: 12, end: 13, action: defaultAction(deviceType) }];
                  this.card.updateBlocksLocal(schedule.id, newBlocks);
                }}>
                  ${icon("plus", 12)} ${t("common.add")}
                </button>
              </div>
            </div>

            <!-- Days -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">${t("editor.days.repeat")}</h3><p class="card__sub">${t("wizard.days.hint")}</p></div>
              </div>
              <div class="row" style="gap:16px;flex-wrap:wrap">
                <div class="row" style="gap:4px">
                  ${getDays().map((d: string, i: number) => {
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
                  <button class="btn btn--sm btn--ghost" @click=${() => this.card.updateScheduleLocal(schedule.id, { days: [1,1,1,1,1,1,1] })}>${t("editor.days.all")}</button>
                  <button class="btn btn--sm btn--ghost" @click=${() => this.card.updateScheduleLocal(schedule.id, { days: [1,1,1,1,1,0,0] })}>${t("editor.days.weekdays")}</button>
                  <button class="btn btn--sm btn--ghost" @click=${() => this.card.updateScheduleLocal(schedule.id, { days: [0,0,0,0,0,1,1] })}>${t("editor.days.weekend")}</button>
                </div>
              </div>
              ${this._renderDateRange(schedule)}
            </div>

            <!-- Weather rules -->
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">${t("editor.weather_rules.title")}</h3><p class="card__sub">${t("nav.weather_rules")}</p></div>
                <button class="btn btn--sm" @click=${() => this.card.navigate("weatherRule")}>${icon("plus", 12)} ${t("editor.weather_rules.add")}</button>
              </div>
              ${!(schedule.weather_rules || []).length
                ? html`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
                    <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${icon("cloud", 22)}</div>
                    <div style="font-weight:600;color:var(--text);font-size:14px">${t("editor.weather_rules.empty")}</div>
                  </div>`
                : html`<div class="col" style="gap:8px">
                    ${(schedule.weather_rules || []).map((r, i) => {
                      const targetLabel = (r.block_index === null || r.block_index === undefined)
                        ? t("wr.target.all_blocks")
                        : (() => {
                            const b = schedule.blocks[r.block_index!];
                            if (!b) return `#${r.block_index! + 1}`;
                            return `#${r.block_index! + 1} ${fmtHour(resolveBlockTime(b, "start"))}-${fmtHour(resolveBlockTime(b, "end"))}`;
                          })();
                      const isSelected = this._selectedRuleIdx === i;
                      return html`
                      <div class="rule-block" data-selected="${isSelected}"
                        style="cursor:pointer;${isSelected ? "border:2px solid var(--accent);background:var(--accent-soft)" : ""}"
                        @click=${() => { this._selectedRuleIdx = isSelected ? -1 : i; }}>
                        <span class="chip chip--accent" style="flex:0 0 auto" title="${t("wr.target.label")}">
                          ${icon("clock", 11)} ${targetLabel}
                        </span>
                        ${r.if ? html`
                          <span class="rule-block__label rule-block__label--if">IF</span>
                          <span class="rule-token rule-token--weather">${r.if}</span>
                        ` : nothing}
                        <span class="rule-block__label rule-block__label--then">${t("wr.effect." + (r.effect || "skip"))}</span>
                        <span class="rule-token rule-token--accent">${r.then}</span>
                        <div style="flex:1"></div>
                        <label class="switch" @click=${(e: Event) => e.stopPropagation()}>
                          <input type="checkbox" .checked=${r.active} @change=${(e: Event) => {
                            const newRules = [...(schedule.weather_rules || [])];
                            newRules[i] = { ...newRules[i], active: (e.target as HTMLInputElement).checked };
                            this.card.updateScheduleLocal(schedule.id, { weather_rules: newRules });
                          }}/>
                          <span class="switch__track"></span>
                          <span class="switch__thumb"></span>
                        </label>
                        <button class="btn btn--icon btn--ghost btn--sm"
                          @click=${(e: Event) => { e.stopPropagation(); this.card.editWeatherRule(schedule.id, i); }}
                          title="${t("common.edit") !== "common.edit" ? t("common.edit") : "Modifica"}">
                          ${icon("edit", 12)}
                        </button>
                        <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
                          @click=${(e: Event) => {
                            e.stopPropagation();
                            if (!confirm(`${t("common.remove")}: ${r.if || ""} → ${r.then}?`)) return;
                            const newRules = (schedule.weather_rules || []).filter((_, j) => j !== i);
                            this.card.updateScheduleLocal(schedule.id, { weather_rules: newRules });
                            if (this._selectedRuleIdx === i) this._selectedRuleIdx = -1;
                          }}
                          title="${t("common.remove")}">
                          ${icon("trash", 12)}
                        </button>
                      </div>
                      `;
                    })}
                  </div>`}
            </div>
          </div>

          <!-- Right column -->
          <div class="col" style="gap:16px">
            <div class="card">
              <div class="card__header">
                <div style="flex:1"><h3 class="card__title">${t("wizard.time.selected")}</h3><p class="card__sub">${block ? `${fmtHour(block.start)} → ${fmtHour(block.end)}` : ""}</p></div>
              </div>
              ${block ? html`
                <div class="col" style="gap:12px">
                  ${this._renderTimeEdge(schedule.id, block, "start")}
                  ${this._renderTimeEdge(schedule.id, block, "end")}
                  ${this._renderWrapWarning(block)}
                  <div class="field">
                    <label class="field__label">${t("editor.block.action")}</label>
                    <div class="row" style="gap:6px;flex-wrap:wrap">
                      ${availableActions.map((a) => {
                        const active = block.action?.id === a.id;
                        return html`<button class="btn btn--sm" @click=${() => this._setBlockAction(schedule.id, a.id, a.value?.default)}
                          style="background:${active ? KIND_COLORS[a.kind] : "var(--surface)"};color:${active ? "white" : "var(--text)"};border-color:${active ? "transparent" : "var(--border)"}">
                          ${actionDefLabel(deviceType, a.id, a.label)}</button>`;
                      })}
                    </div>
                    <span class="field__hint mono" style="margin-top:4px">${currentActionDef?.service || ""}</span>
                  </div>
                  ${currentActionDef?.value ? html`
                    <div class="field">
                      <label class="field__label">${actionValueLabel(deviceType, block.action.id, currentActionDef.value.label) || t("common.value")} ${currentActionDef.value.unit ? html`<span class="text-mute">(${currentActionDef.value.unit})</span>` : nothing}</label>
                      ${currentActionDef.value.type === "number" ? html`
                        <div class="row" style="gap:10px;align-items:center">
                          <input type="range" min="${currentActionDef.value.min}" max="${currentActionDef.value.max}" step="${currentActionDef.value.step}"
                            .value=${String(block.action?.value ?? currentActionDef.value.default)}
                            @input=${(e: InputEvent) => this._setBlockValue(schedule.id, parseFloat((e.target as HTMLInputElement).value))}
                            style="flex:1"/>
                          <input type="number" class="input mono"
                            min="${currentActionDef.value.min}" max="${currentActionDef.value.max}" step="${currentActionDef.value.step}"
                            .value=${String(block.action?.value ?? currentActionDef.value.default)}
                            @input=${(e: InputEvent) => {
                              const v = parseFloat((e.target as HTMLInputElement).value);
                              if (!isNaN(v)) this._setBlockValue(schedule.id, v);
                            }}
                            style="width:90px;text-align:right;font-weight:600"/>
                          <span class="mono text-mute" style="min-width:30px">${currentActionDef.value.unit || ""}</span>
                        </div>
                      ` : currentActionDef.value.type === "enum" ? html`
                        <select class="input"
                          @change=${(e: Event) => this._setBlockValue(schedule.id, (e.target as HTMLSelectElement).value)}>
                          ${(currentActionDef.value.options || []).map((o) => {
                            const cur = String(block.action?.value ?? currentActionDef.value!.default);
                            return html`<option value="${o}" ?selected=${cur === o}>${o}</option>`;
                          })}
                        </select>
                      ` : currentActionDef.value.type === "entity" ? this._renderEntityPicker(schedule.id, block, currentActionDef.value) : nothing}
                    </div>
                  ` : nothing}
                  ${currentActionDef?.extras?.length ? this._renderExtras(schedule.id, block, currentActionDef) : nothing}
                  ${this._renderBlockDeviceSubset(schedule, block)}
                  <button class="btn btn--ghost" style="color:var(--danger)" @click=${() => this._removeBlock(schedule.id)}>
                    ${icon("trash", 14)} ${t("editor.block.delete")}
                  </button>
                </div>
              ` : nothing}
            </div>

            ${deviceType === "scene" || deviceType === "automation" ? html`
              <div class="card">
                <div class="card__header">
                  <div style="flex:1">
                    <h3 class="card__title">${deviceType === "automation" ? t("editor.automation.section") : t("editor.scene.section")}</h3>
                    <p class="card__sub">${deviceType === "automation" ? t("editor.automation.section.hint") : t("editor.scene.section.hint")}</p>
                  </div>
                </div>
                <p class="text-xs text-mute" style="margin:0">${deviceType === "automation" ? t("editor.automation.no_devices") : t("editor.scene.no_devices")}</p>
              </div>
            ` : html`
              <div class="card">
                <div class="card__header">
                  <div style="flex:1"><h3 class="card__title">${t("editor.devices_section")}</h3><p class="card__sub">${t("editor.devices_count", { n: devices.length })}</p></div>
                </div>
                ${this._renderDevicePicker(schedule, deviceType)}
                <div class="col" style="gap:2px;margin-top:10px">
                  ${devices.map((d: any) => html`
                    <div class="device-row">
                      <div class="device-row__icon">${deviceIcon(d.type, 17)}</div>
                      <div class="device-row__main">
                        <div class="device-row__name">${d.alias}</div>
                        <div class="device-row__meta">${d.area} · ${d.entity_id}</div>
                      </div>
                      <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
                        @click=${() => this._removeDeviceFromSchedule(schedule.id, d.id)}
                        title="${t("common.remove")}">
                        ${icon("trash", 12)}
                      </button>
                    </div>
                  `)}
                  ${!devices.length ? html`
                    <p class="text-xs text-mute" style="text-align:center;padding:14px 0;font-style:italic">${t("editor.devices_empty")}</p>
                  ` : nothing}
                </div>
              </div>
            `}
          </div>
        </div>
        ${this._confirmDelete ? this._renderDeleteModal(schedule) : nothing}
      </div>
    `;
  }

  private _renderTimeEdge(schedId: string, block: Block, edge: "start" | "end") {
    const anchor = (block as any)[`${edge}_anchor`] as "sunrise" | "sunset" | undefined;
    const offset = ((block as any)[`${edge}_offset`] as number | undefined) ?? 0;
    const mode: "fixed" | "sunrise" | "sunset" = anchor ?? "fixed";
    const resolved = resolveBlockTime(block, edge);
    const label = edge === "start" ? t("editor.block.from") : t("editor.block.to");
    return html`
      <div class="field">
        <label class="field__label">${label}</label>
        <div class="row" style="gap:8px;flex-wrap:wrap;align-items:center">
          <select class="select mono" style="width:130px"
            @change=${(e: Event) => this._setEdgeMode(schedId, edge, (e.target as HTMLSelectElement).value as any)}>
            <option value="fixed" ?selected=${mode === "fixed"}>${t("editor.block.fixed")}</option>
            <option value="sunrise" ?selected=${mode === "sunrise"}>${t("editor.block.sunrise")}</option>
            <option value="sunset" ?selected=${mode === "sunset"}>${t("editor.block.sunset")}</option>
          </select>
          ${mode === "fixed" ? html`
            <input type="time" class="input mono" style="width:120px"
              .value=${this._toHHMM(resolved)}
              @change=${(e: Event) => this._setEdgeFixed(schedId, edge, (e.target as HTMLInputElement).value)}/>
          ` : html`
            <input type="number" class="input mono" style="width:90px" step="5" min="-180" max="180"
              .value=${String(offset)}
              @change=${(e: Event) => this._setEdgeOffset(schedId, edge, parseInt((e.target as HTMLInputElement).value, 10))}/>
            <span class="text-xs text-mute">min</span>
            <span class="text-xs text-mute" style="font-style:italic">→ ${t("editor.block.today")} ${fmtHour(resolved)}</span>
          `}
        </div>
      </div>
    `;
  }

  private _toHHMM(hour: number): string {
    const safe = Number.isFinite(hour) ? Math.max(0, Math.min(23.999, hour)) : 0;
    let hh = Math.floor(safe);
    let mm = Math.round((safe - hh) * 60);
    if (mm >= 60) { mm = 0; hh = Math.min(23, hh + 1); }
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  }

  /** After mutating the selected block and pushing through updateBlocksLocal,
   * the schedule's blocks array is sorted by `start`, which can move the
   * selected block to a different index. We track its identity by reference
   * (the spread copy `b` is the same object inserted into newBlocks) and
   * realign `_selectedBlockIdx` to where it landed. Without this realignment,
   * the next interaction targets the wrong block, which on time-edits causes
   * cascading edits across blocks and Lit re-render storms. */
  private _commitBlocks(schedId: string, newBlocks: any[], editedRef: any) {
    this.card.updateBlocksLocal(schedId, newBlocks);
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const idx = sched.blocks.indexOf(editedRef);
    if (idx >= 0) this._selectedBlockIdx = idx;
  }

  /** Block crosses midnight when its resolved end is at or before its resolved
   * start, or when the user combined sunset-start with sunrise-end (which on
   * average always wraps). The backend matches blocks with `start <= h < end`,
   * so a wrapped block never fires. */
  private _blockWrapsMidnight(block: Block): boolean {
    const sa = (block as any).start_anchor;
    const ea = (block as any).end_anchor;
    if (sa === "sunset" && ea === "sunrise") return true;
    const rs = resolveBlockTime(block, "start");
    const re = resolveBlockTime(block, "end");
    return re <= rs;
  }

  private _renderWrapWarning(block: Block) {
    if (!this._blockWrapsMidnight(block)) return nothing;
    return html`
      <div style="border:1px solid var(--warn);background:var(--warn-soft,#fff7ed);color:#92400e;padding:10px 12px;border-radius:8px;font-size:12.5px;line-height:1.4">
        <strong>${t("editor.block.wrap_warn.title")}</strong>
        <div style="margin-top:4px">${t("editor.block.wrap_warn.body")}</div>
      </div>
    `;
  }

  private _setEdgeMode(schedId: string, edge: "start" | "end", mode: "fixed" | "sunrise" | "sunset") {
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const newBlocks = [...sched.blocks];
    const b: any = { ...newBlocks[this._selectedBlockIdx] };
    if (mode === "fixed") {
      const resolved = resolveBlockTime(b, edge);
      b[edge] = resolved;
      delete b[`${edge}_anchor`];
      delete b[`${edge}_offset`];
    } else {
      b[`${edge}_anchor`] = mode;
      if (b[`${edge}_offset`] === undefined) b[`${edge}_offset`] = 0;
    }
    newBlocks[this._selectedBlockIdx] = b;
    this._commitBlocks(schedId, newBlocks, b);
  }

  private _setEdgeFixed(schedId: string, edge: "start" | "end", hhmm: string) {
    if (!hhmm) return;
    const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
    if (isNaN(h) || isNaN(m)) return;
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const newBlocks = [...sched.blocks];
    const b: any = { ...newBlocks[this._selectedBlockIdx] };
    b[edge] = h + m / 60;
    delete b[`${edge}_anchor`];
    delete b[`${edge}_offset`];
    newBlocks[this._selectedBlockIdx] = b;
    this._commitBlocks(schedId, newBlocks, b);
  }

  private _setEdgeOffset(schedId: string, edge: "start" | "end", offset: number) {
    if (isNaN(offset)) return;
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const newBlocks = [...sched.blocks];
    const b: any = { ...newBlocks[this._selectedBlockIdx] };
    b[`${edge}_offset`] = offset;
    newBlocks[this._selectedBlockIdx] = b;
    this._commitBlocks(schedId, newBlocks, b);
  }

  /** Per-block device subset: lets the user restrict THIS block to a subset
   * of the schedule's devices (the rest are not touched at this block's
   * transition). Only shown for schedules with at least 2 devices. When all
   * devices are selected, we store an empty array (semantic = "all"). */
  private _renderBlockDeviceSubset(schedule: any, block: Block) {
    if (schedule.device_type === "scene" || schedule.device_type === "automation") return nothing;
    const allIds: string[] = schedule.device_ids || [];
    if (allIds.length < 2) return nothing;
    const stored: string[] = (block as any).device_ids || [];
    const allSelected = stored.length === 0 || stored.length === allIds.length;
    const selected = new Set<string>(allSelected ? allIds : stored);
    const devs = allIds
      .map((id: string) => this.card._devices.find((d) => d.id === id))
      .filter(Boolean) as any[];
    return html`
      <div class="field" style="border-top:1px dashed var(--border-soft);padding-top:10px;margin-top:6px">
        <label class="field__label">${t("editor.block.targets")}</label>
        <div class="row" style="gap:6px;flex-wrap:wrap">
          <button class="btn btn--sm" @click=${() => this._setBlockDeviceSubset(schedule.id, [])}
            style="background:${allSelected ? "var(--accent)" : "var(--bg-sunken)"};color:${allSelected ? "white" : "var(--text)"};border-color:${allSelected ? "transparent" : "var(--border-soft)"}">
            ${allSelected ? icon("check", 11) : nothing} ${t("editor.block.targets.all")}
          </button>
          ${devs.map((d) => {
            const on = !allSelected && selected.has(d.id);
            return html`
              <button class="btn btn--sm" @click=${() => this._toggleBlockDeviceTarget(schedule.id, d.id)}
                style="background:${on ? "var(--accent)" : "var(--bg-sunken)"};color:${on ? "white" : "var(--text)"};border-color:${on ? "transparent" : "var(--border-soft)"}">
                ${on ? icon("check", 11) : nothing} ${deviceIcon(d.type, 11)} ${d.alias}
              </button>
            `;
          })}
        </div>
        <span class="field__hint" style="margin-top:4px">${t("editor.block.targets.hint")}</span>
      </div>
    `;
  }

  private _setBlockDeviceSubset(schedId: string, ids: string[]) {
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const newBlocks = [...sched.blocks];
    const block: any = { ...newBlocks[this._selectedBlockIdx] };
    if (!ids.length) delete block.device_ids;
    else block.device_ids = ids;
    newBlocks[this._selectedBlockIdx] = block;
    this._commitBlocks(schedId, newBlocks, block);
  }

  private _toggleBlockDeviceTarget(schedId: string, deviceId: string) {
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const block: any = sched.blocks[this._selectedBlockIdx];
    if (!block) return;
    const allIds: string[] = sched.device_ids || [];
    const stored: string[] = block.device_ids || [];
    // First click on a chip while in "all" mode initializes the subset to
    // everything except the clicked one (matches the user's mental model).
    let next: string[];
    if (!stored.length) {
      next = allIds.filter((x) => x !== deviceId);
    } else if (stored.includes(deviceId)) {
      next = stored.filter((x) => x !== deviceId);
    } else {
      next = [...stored, deviceId];
    }
    // Storing all of them = same as empty. Normalise.
    if (next.length === allIds.length) next = [];
    this._setBlockDeviceSubset(schedId, next);
  }

  /** Picker for actions whose value is one or more HA entity_ids (scenes,
   * automations). When `spec.multi` is true the picker becomes a chip-toggle
   * grid; otherwise it falls back to a single-select dropdown. The stored
   * value is `string` (single mode), `string[]` (multi mode), or `undefined`. */
  private _renderEntityPicker(schedId: string, block: Block, spec: any) {
    const pool: any[] = spec.domain === "automation"
      ? this.card._automationEntities
      : this.card._sceneEntities;
    const cur = block.action?.value;
    const selected: string[] = Array.isArray(cur)
      ? cur
      : (typeof cur === "string" && cur ? [cur] : []);
    const placeholder = spec.domain === "automation"
      ? t("editor.automation.pick_placeholder")
      : t("editor.scene.pick_placeholder");
    const warnText = spec.domain === "automation"
      ? t("editor.automation.pick_warn")
      : t("editor.scene.pick_warn");

    if (!spec.multi) {
      return html`
        <select class="input"
          @change=${(e: Event) => this._setBlockValue(schedId, (e.target as HTMLSelectElement).value)}>
          <option value="" ?selected=${!cur}>${placeholder}</option>
          ${pool.map((s: any) => html`
            <option value="${s.entity_id}" ?selected=${cur === s.entity_id}>
              ${s.friendly_name || s.entity_id}
            </option>
          `)}
        </select>
        ${!cur ? html`<span class="field__hint" style="color:var(--warn);margin-top:4px">${warnText}</span>` : nothing}
      `;
    }

    // Filter the pool by the search query (matches friendly_name or entity_id).
    // Already-selected entities are kept visible regardless of the query so the
    // user can always deselect them without resetting the search.
    const q = this._entitySearch.trim().toLowerCase();
    const visible = q
      ? pool.filter((s: any) => {
          if (selected.includes(s.entity_id)) return true;
          const haystack = `${s.friendly_name || ""} ${s.entity_id || ""}`.toLowerCase();
          return haystack.includes(q);
        })
      : pool;

    return html`
      <div class="col" style="gap:8px">
        ${pool.length > 6 ? html`
          <input class="input" type="search" .value=${this._entitySearch}
            placeholder="${t("editor.entity.search")}"
            @input=${(e: InputEvent) => { this._entitySearch = (e.target as HTMLInputElement).value; }}/>
        ` : nothing}
        <div class="row" style="gap:6px;flex-wrap:wrap">
          ${visible.length ? visible.map((s: any) => {
            const id = s.entity_id;
            const on = selected.includes(id);
            return html`
              <button class="btn btn--sm"
                @click=${() => this._toggleEntitySelection(schedId, id)}
                style="background:${on ? "var(--accent)" : "var(--bg-sunken)"};color:${on ? "white" : "var(--text)"};border-color:${on ? "transparent" : "var(--border-soft)"}">
                ${on ? icon("check", 11) : nothing} ${s.friendly_name || id}
              </button>
            `;
          }) : html`<span class="text-xs text-mute">${pool.length ? t("editor.entity.no_match") : t("editor.entity.empty")}</span>`}
        </div>
        ${selected.length === 0 ? html`<span class="field__hint" style="color:var(--warn)">${warnText}</span>` : html`<span class="field__hint">${t("editor.entity.count", { n: selected.length })}</span>`}
      </div>
    `;
  }

  private _toggleEntitySelection(schedId: string, entityId: string) {
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const block = sched.blocks[this._selectedBlockIdx];
    if (!block) return;
    const cur = block.action?.value;
    const list: string[] = Array.isArray(cur)
      ? [...cur]
      : (typeof cur === "string" && cur ? [cur] : []);
    const idx = list.indexOf(entityId);
    if (idx >= 0) list.splice(idx, 1);
    else list.push(entityId);
    this._setBlockValue(schedId, list);
  }

  private _renderExtras(schedId: string, block: Block, def: any) {
    const extras = block.action?.extras || {};
    return html`
      <div class="field" style="border-top:1px dashed var(--border-soft);padding-top:10px;margin-top:6px">
        <label class="field__label">${t("editor.block.extras")}</label>
        <div class="col" style="gap:8px">
          ${(def.extras || []).map((spec: any) => {
            const cur = extras[spec.key];
            return html`
              <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">
                <span class="text-xs text-mute" style="min-width:130px">${actionExtraLabel(spec.key, spec.label)}${spec.unit ? ` (${spec.unit})` : ""}</span>
                ${spec.type === "color" ? html`
                  <input type="color"
                    .value=${this._rgbToHex(cur)}
                    @input=${(e: InputEvent) => this._setBlockExtra(schedId, spec.key, this._hexToRgb((e.target as HTMLInputElement).value))}
                    style="width:48px;height:32px;padding:0;border:1px solid var(--border-soft);border-radius:6px;cursor:pointer"/>
                ` : spec.type === "number" ? html`
                  <input type="number" class="input mono"
                    min="${spec.min}" max="${spec.max}" step="${spec.step}"
                    .value=${cur !== undefined && cur !== null ? String(cur) : ""}
                    @input=${(e: InputEvent) => {
                      const v = (e.target as HTMLInputElement).value;
                      const x = v === "" ? undefined : parseFloat(v);
                      this._setBlockExtra(schedId, spec.key, isNaN(x as number) ? undefined : x);
                    }}
                    placeholder="—"
                    style="flex:1;min-width:100px"/>
                ` : nothing}
                ${cur !== undefined && cur !== null && cur !== "" ? html`
                  <button class="btn btn--icon btn--ghost btn--sm" title="${t("common.remove")}"
                    @click=${() => this._setBlockExtra(schedId, spec.key, undefined)}>
                    ${icon("close", 12)}
                  </button>
                ` : nothing}
              </div>
            `;
          })}
        </div>
        <span class="field__hint">${t("editor.block.extras.hint")}</span>
      </div>
    `;
  }

  private _setBlockExtra(schedId: string, key: string, value: any) {
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const newBlocks = [...sched.blocks];
    const block = newBlocks[this._selectedBlockIdx];
    if (!block) return;
    const action = { ...(block.action || { id: "" }) };
    const extras = { ...(action.extras || {}) };
    if (value === undefined) delete extras[key];
    else extras[key] = value;
    action.extras = Object.keys(extras).length ? extras : undefined;
    newBlocks[this._selectedBlockIdx] = { ...block, action };
    this.card.updateBlocksLocal(schedId, newBlocks);
  }

  private _rgbToHex(rgb: any): string {
    if (!Array.isArray(rgb) || rgb.length < 3) return "#ffffff";
    const [r, g, b] = rgb;
    return "#" + [r, g, b].map((x) => Math.max(0, Math.min(255, x | 0)).toString(16).padStart(2, "0")).join("");
  }

  private _hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace("#", "");
    const r = parseInt(h.length === 3 ? h[0] + h[0] : h.slice(0, 2), 16);
    const g = parseInt(h.length === 3 ? h[1] + h[1] : h.slice(2, 4), 16);
    const b = parseInt(h.length === 3 ? h[2] + h[2] : h.slice(4, 6), 16);
    return [r, g, b];
  }

  private _renderDateRange(schedule: any) {
    const dr = schedule.date_range;
    const enabled = !!dr;
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return html`
      <div style="margin-top:14px;border-top:1px dashed var(--border-soft);padding-top:14px">
        <div class="row" style="gap:12px;align-items:center">
          <label class="switch">
            <input type="checkbox" .checked=${enabled}
              @change=${(e: Event) => {
                const on = (e.target as HTMLInputElement).checked;
                const next = on
                  ? { start_month: 1, start_day: 1, end_month: 12, end_day: 31 }
                  : null;
                this.card.updateScheduleLocal(schedule.id, { date_range: next });
              }}/>
            <span class="switch__track"></span>
            <span class="switch__thumb"></span>
          </label>
          <span class="text-sm fw-600">${t("editor.date_range.toggle")}</span>
        </div>
        <span class="field__hint" style="display:block;margin-top:4px">${t("editor.date_range.hint")}</span>
        ${enabled ? html`
          <div class="row" style="gap:10px;flex-wrap:wrap;margin-top:10px;align-items:center">
            <span class="text-xs text-mute" style="min-width:30px">${t("editor.date_range.from")}</span>
            <select class="select mono" style="width:140px"
              @change=${(e: Event) => this._updateDateRange(schedule.id, "start_month", parseInt((e.target as HTMLSelectElement).value, 10))}>
              ${months.map((m) => html`<option value="${m}" ?selected=${dr.start_month === m}>${this._monthLabel(m)}</option>`)}
            </select>
            <select class="select mono" style="width:80px"
              @change=${(e: Event) => this._updateDateRange(schedule.id, "start_day", parseInt((e.target as HTMLSelectElement).value, 10))}>
              ${days.map((d) => html`<option value="${d}" ?selected=${dr.start_day === d}>${d}</option>`)}
            </select>
            <span class="text-xs text-mute" style="min-width:30px">${t("editor.date_range.to")}</span>
            <select class="select mono" style="width:140px"
              @change=${(e: Event) => this._updateDateRange(schedule.id, "end_month", parseInt((e.target as HTMLSelectElement).value, 10))}>
              ${months.map((m) => html`<option value="${m}" ?selected=${dr.end_month === m}>${this._monthLabel(m)}</option>`)}
            </select>
            <select class="select mono" style="width:80px"
              @change=${(e: Event) => this._updateDateRange(schedule.id, "end_day", parseInt((e.target as HTMLSelectElement).value, 10))}>
              ${days.map((d) => html`<option value="${d}" ?selected=${dr.end_day === d}>${d}</option>`)}
            </select>
          </div>
          ${dr.start_month * 100 + dr.start_day > dr.end_month * 100 + dr.end_day ? html`
            <span class="field__hint" style="display:block;margin-top:6px;color:var(--warn)">${t("editor.date_range.wraps")}</span>
          ` : nothing}
        ` : nothing}
      </div>
    `;
  }

  private _updateDateRange(schedId: string, key: string, value: number) {
    if (isNaN(value)) return;
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const cur = sched.date_range || { start_month: 1, start_day: 1, end_month: 12, end_day: 31 };
    this.card.updateScheduleLocal(schedId, { date_range: { ...cur, [key]: value } });
  }

  private _monthLabel(m: number): string {
    const k = `month.${m}`;
    const v = t(k);
    return v === k ? String(m) : v;
  }

  /** Picker that lists devices of the same type not yet on this schedule.
   * Empty when no eligible candidates exist. */
  private _renderDevicePicker(schedule: any, deviceType: string) {
    const inSched = new Set(schedule.device_ids || []);
    const candidates = this.card._devices.filter(
      (d) => d.type === deviceType && !inSched.has(d.id)
    );
    if (!candidates.length) {
      return html`<p class="text-xs text-mute" style="margin:0">${t("editor.devices_no_more", { type: deviceType })}</p>`;
    }
    return html`
      <div class="row" style="gap:8px;align-items:center">
        <select class="select mono" style="flex:1" id="add-device-${schedule.id}">
          ${candidates.map((d) => html`<option value="${d.id}">${d.alias} · ${d.entity_id}</option>`)}
        </select>
        <button class="btn btn--sm btn--primary"
          @click=${(e: Event) => {
            const sel = (e.target as HTMLElement).closest(".row")?.querySelector("select") as HTMLSelectElement | null;
            if (sel?.value) this._addDeviceToSchedule(schedule.id, sel.value);
          }}>
          ${icon("plus", 12)} ${t("common.add")}
        </button>
      </div>
    `;
  }

  private _addDeviceToSchedule(schedId: string, deviceId: string) {
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const ids = sched.device_ids || [];
    if (ids.includes(deviceId)) return;
    this.card.updateScheduleLocal(schedId, { device_ids: [...ids, deviceId] });
  }

  private _removeDeviceFromSchedule(schedId: string, deviceId: string) {
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const ids = (sched.device_ids || []).filter((id) => id !== deviceId);
    this.card.updateScheduleLocal(schedId, { device_ids: ids });
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

  private _renderDeleteModal(schedule: Schedule) {
    return html`
      <div class="modal-overlay" @click=${() => { this._confirmDelete = false; }}>
        <div class="card" style="width:min(440px,100%);padding:22px" @click=${(e: Event) => e.stopPropagation()}>
          <h3 style="margin:0 0 8px">${t("common.delete")}?</h3>
          <p class="text-sm" style="margin:0 0 16px;color:var(--text-soft)">
            <strong>${schedule.name}</strong>
            <span class="text-xs text-mute" style="display:block;margin-top:4px">
              ${t("editor.delete.summary", {
                blocks: schedule.blocks.length,
                devices: (schedule.device_ids || []).length,
                rules: (schedule.weather_rules || []).length,
              })}
            </span>
          </p>
          <p class="text-xs text-mute" style="margin:0 0 16px">
            ${t("editor.delete.warn")}
          </p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${() => { this._confirmDelete = false; }}>${t("common.cancel")}</button>
            <button class="btn btn--primary" style="background:#ef4444"
              @click=${async () => {
                this._confirmDelete = false;
                await this.card.doRemoveSchedule(schedule.id);
              }}>
              ${icon("trash", 12)} ${t("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _removeBlock(schedId: string) {
    const schedule = this.card._schedules.find((s) => s.id === schedId);
    if (!schedule || schedule.blocks.length <= 1) return;
    const newBlocks = schedule.blocks.filter((_, i) => i !== this._selectedBlockIdx);
    this._selectedBlockIdx = Math.max(0, this._selectedBlockIdx - 1);
    this.card.updateBlocksLocal(schedId, newBlocks);
  }
}
