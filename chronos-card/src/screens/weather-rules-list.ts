import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import type { WeatherRule } from "../types";

type SortMode = "manual" | "schedule" | "alpha";

/** Cross-schedule rule manager (v1.17+): rules are first-class objects in
 * the global store; each row shows the schedules the rule is attached to
 * as chips. Toggling `active` here affects every target schedule.
 *
 * Rows can be sorted by linked schedule or alphabetically (by THEN/IF
 * text), or arranged manually. Manual order persists to the store via
 * drag-and-drop or the up/down buttons; it is only available with no
 * schedule filter active (reordering a filtered subset is ambiguous). */
@customElement("chronos-weather-rules-list")
export class ChronosWeatherRulesList extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  /** "" = all rules; otherwise only rules targeting this schedule id. */
  @state() private _filterSchedId = "";
  @state() private _sortMode: SortMode = "manual";
  /** Index (within the visible list) of the row being dragged, or -1. */
  @state() private _dragFrom = -1;
  @state() private _dragOver = -1;

  render() {
    const rules = this.card._rules;
    const totalActive = rules.filter((r) => r.active).length;
    const schedsWithRules = this.card._schedules.filter((s) =>
      rules.some((r) => (r.targets || []).some((tg) => tg.schedule_id === s.id)),
    );
    const filterValid = this._filterSchedId && schedsWithRules.some((s) => s.id === this._filterSchedId);

    let visible = filterValid
      ? rules.filter((r) => (r.targets || []).some((tg) => tg.schedule_id === this._filterSchedId))
      : [...rules];
    if (this._sortMode === "schedule") {
      visible.sort((a, b) => this._schedKey(a).localeCompare(this._schedKey(b)) || this._alphaKey(a).localeCompare(this._alphaKey(b)));
    } else if (this._sortMode === "alpha") {
      visible.sort((a, b) => this._alphaKey(a).localeCompare(this._alphaKey(b)));
    }
    // Manual order with a filter active can't be persisted unambiguously.
    const reorderEnabled = this._sortMode === "manual" && !filterValid;

    return html`
      <div class="col" style="gap:22px">
        <div class="sp-between" style="flex-wrap:wrap;row-gap:10px">
          <div>
            <h1 class="page-title">${t("nav.weather_rules")}</h1>
            <p class="page-sub">${rules.length} · ${totalActive} ${t("schedule.active").toLowerCase()}</p>
          </div>
          <div class="row" style="gap:8px;flex-wrap:wrap">
            <label class="row" style="gap:6px;align-items:center">
              <span class="text-mute" style="display:inline-flex">${icon("sort", 14)}</span>
              <select class="select" @change=${(e: Event) => { this._sortMode = (e.target as HTMLSelectElement).value as SortMode; }}>
                <option value="manual" ?selected=${this._sortMode === "manual"}>${t("wrl.sort.manual")}</option>
                <option value="schedule" ?selected=${this._sortMode === "schedule"}>${t("wrl.sort.schedule")}</option>
                <option value="alpha" ?selected=${this._sortMode === "alpha"}>${t("wrl.sort.alpha")}</option>
              </select>
            </label>
            ${schedsWithRules.length > 1 ? html`
              <select class="select" style="max-width:220px"
                @change=${(e: Event) => { this._filterSchedId = (e.target as HTMLSelectElement).value; }}>
                <option value="" ?selected=${!filterValid}>${t("wrl.filter.all")}</option>
                ${schedsWithRules.map((s) => html`
                  <option value="${s.id}" ?selected=${this._filterSchedId === s.id}>${s.name}</option>
                `)}
              </select>
            ` : nothing}
            <button class="btn btn--primary" @click=${() => this.card.navigate("weatherRule")}>
              ${icon("plus", 14)} ${t("editor.weather_rules.add")}
            </button>
          </div>
        </div>

        ${this._sortMode === "manual" && filterValid ? html`
          <div class="text-xs text-mute" style="margin:-8px 0 0">${icon("info", 11)} ${t("wrl.manual.filter_hint")}</div>
        ` : nothing}

        ${!rules.length ? html`
          <div class="card" style="text-align:center;padding:40px 20px;color:var(--text-muted)">
            <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${icon("cloud", 22)}</div>
            <div style="font-weight:600;color:var(--text);font-size:14px">${t("editor.weather_rules.empty")}</div>
          </div>
        ` : html`
          <div class="card">
            <div class="col" style="gap:0">
              ${visible.map((r, i) => this._renderRule(r, i, visible.length, reorderEnabled))}
            </div>
          </div>
        `}
      </div>
    `;
  }

  private _schedKey(r: WeatherRule): string {
    const first = (r.targets || [])[0];
    if (!first) return "￿"; // unassigned rules sort last
    const sched = this.card._schedules.find((s) => s.id === first.schedule_id);
    return (sched?.name || first.schedule_id).toLowerCase();
  }

  private _alphaKey(r: WeatherRule): string {
    return (r.then || r.if || "").toLowerCase();
  }

  private _renderRule(r: WeatherRule, idx: number, count: number, reorderEnabled: boolean) {
    const targets = r.targets || [];
    const dragging = this._dragFrom === idx;
    const dragOver = this._dragOver === idx && this._dragFrom !== idx;
    return html`
      <div class="rule-block ${dragOver ? "rule-block--dragover" : ""}"
        style="border-radius:0;border:0;border-bottom:1px solid var(--border-soft);padding:12px 10px;cursor:pointer;${dragging ? "opacity:0.4" : ""}"
        draggable=${reorderEnabled ? "true" : "false"}
        @dragstart=${reorderEnabled ? (e: DragEvent) => this._onDragStart(e, idx) : null}
        @dragover=${reorderEnabled ? (e: DragEvent) => this._onDragOver(e, idx) : null}
        @drop=${reorderEnabled ? (e: DragEvent) => this._onDrop(e, idx) : null}
        @dragend=${reorderEnabled ? () => { this._dragFrom = -1; this._dragOver = -1; } : null}
        @click=${() => this.card.editWeatherRule(r.id!)}>
        ${reorderEnabled ? html`
          <span class="rule-grip" title="${t("wrl.manual.drag")}" @click=${(e: Event) => e.stopPropagation()}
            style="cursor:grab;color:var(--text-muted);display:inline-flex;align-items:center">${icon("grip", 14)}</span>
          <div class="col" style="gap:0" @click=${(e: Event) => e.stopPropagation()}>
            <button class="btn btn--icon btn--ghost" style="height:16px;padding:0" title="${t("wrl.manual.up")}"
              ?disabled=${idx === 0} @click=${() => this._move(idx, -1)}>${icon("chevron-up", 12)}</button>
            <button class="btn btn--icon btn--ghost" style="height:16px;padding:0" title="${t("wrl.manual.down")}"
              ?disabled=${idx === count - 1} @click=${() => this._move(idx, 1)}>${icon("chevron-down", 12)}</button>
          </div>
        ` : nothing}
        ${targets.length ? targets.map((tg) => {
          const sched = this.card._schedules.find((s) => s.id === tg.schedule_id);
          const blockSuffix = tg.block_index !== null && tg.block_index !== undefined
            ? ` · #${tg.block_index + 1}`
            : "";
          return html`
            <span class="chip chip--accent" style="flex:0 0 auto;max-width:200px" title="${sched?.name || tg.schedule_id}${blockSuffix}">
              ${sched ? deviceIcon(sched.device_type, 11) : nothing}
              <span class="truncate" style="max-width:150px;display:inline-block;vertical-align:middle">${sched?.name || tg.schedule_id}</span>${blockSuffix}
            </span>
          `;
        }) : html`
          <span class="chip" style="flex:0 0 auto;background:color-mix(in srgb, var(--warn) 16%, transparent);color:var(--warn);border-color:color-mix(in srgb, var(--warn) 35%, transparent)">
            ${icon("info", 11)} ${t("wrl.unassigned")}
          </span>
        `}
        ${r.if ? html`
          <span class="rule-block__label rule-block__label--if">IF</span>
          <span class="rule-token rule-token--weather">${r.if}</span>
        ` : nothing}
        <span class="rule-block__label rule-block__label--then">${t("wr.effect." + (r.effect || "skip"))}</span>
        <span class="rule-token rule-token--accent">${r.then}</span>
        <div style="flex:1"></div>
        <label class="switch" @click=${(e: Event) => e.stopPropagation()}>
          <input type="checkbox" .checked=${r.active}
            @change=${(e: Event) => this.card.toggleRuleActive(r.id!, (e.target as HTMLInputElement).checked)}/>
          <span class="switch__track"></span>
          <span class="switch__thumb"></span>
        </label>
        <button class="btn btn--sm" @click=${(e: Event) => { e.stopPropagation(); this.card.editWeatherRule(r.id!); }}
          title="${t("common.edit")}">
          ${icon("edit", 12)} ${t("common.edit")}
        </button>
        <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
          @click=${(e: Event) => { e.stopPropagation(); this._deleteRule(r); }}
          title="${t("common.remove")}">
          ${icon("trash", 12)}
        </button>
      </div>
    `;
  }

  private _onDragStart(e: DragEvent, idx: number) {
    this._dragFrom = idx;
    if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
  }

  private _onDragOver(e: DragEvent, idx: number) {
    e.preventDefault(); // allow drop
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    if (this._dragOver !== idx) this._dragOver = idx;
  }

  private _onDrop(e: DragEvent, idx: number) {
    e.preventDefault();
    const from = this._dragFrom;
    this._dragFrom = -1;
    this._dragOver = -1;
    if (from < 0 || from === idx) return;
    this._reorder(from, idx);
  }

  private _move(idx: number, dir: -1 | 1) {
    const to = idx + dir;
    if (to < 0 || to >= this.card._rules.length) return;
    this._reorder(idx, to);
  }

  /** Reorder the GLOBAL rules array (manual mode has no filter, so the
   * visible list and the store array are the same sequence). */
  private _reorder(from: number, to: number) {
    const ids = this.card._rules.map((r) => r.id!);
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    this.card.reorderRules(ids);
  }

  private async _deleteRule(r: WeatherRule) {
    const n = (r.targets || []).length;
    const msg = n > 1
      ? t("wrl.delete.shared", { n })
      : `${t("common.remove")}: ${r.if || ""} → ${r.then}?`;
    if (!confirm(msg)) return;
    await this.card.doRemoveRule(r.id!);
  }
}
