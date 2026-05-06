import { LitElement, html, nothing, svg } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon } from "../icons";
import { t, actionDefLabel } from "../i18n";
import { fetchHistory, clearHistory, type HistoryEntry } from "../ws";
import type { ChronosCard } from "../chronos-card";

/** History screen: lists past dispatches (block executions and rule
 * triggers) emitted by the scheduler over a user-chosen time window.
 * Useful for debugging "why didn't this fire" or "did the SOC rule
 * trigger last night". Backed by an append-only ring buffer the scheduler
 * fills on every dispatch. */
@customElement("chronos-history-screen")
export class ChronosHistoryScreen extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  @state() private _entries: HistoryEntry[] = [];
  @state() private _loading = false;
  @state() private _from = this._defaultFromIso();
  @state() private _to = this._defaultToIso();
  @state() private _scheduleId = "";
  @state() private _outcome: "" | "ok" | "error" = "";
  @state() private _kind: "" | "block" | "rule" = "";
  @state() private _confirmClear = false;

  /** Default range: last 7 days, ending now. */
  private _defaultFromIso(): string {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 16); // yyyy-mm-ddThh:mm
  }
  private _defaultToIso(): string {
    return new Date().toISOString().slice(0, 16);
  }

  connectedCallback() {
    super.connectedCallback();
    void this._reload();
  }

  private async _reload() {
    if (!this.card?.hass) return;
    this._loading = true;
    try {
      const filters: any = {};
      // Convert local datetime-local input to UTC ISO for backend filtering.
      // Backend stores entries in UTC ISO (dt_util.utcnow().isoformat()).
      if (this._from) filters.from_ts = new Date(this._from).toISOString();
      if (this._to) filters.to_ts = new Date(this._to).toISOString();
      if (this._scheduleId) filters.schedule_id = this._scheduleId;
      if (this._outcome) filters.outcome = this._outcome;
      if (this._kind) filters.kind = this._kind;
      this._entries = await fetchHistory(this.card.hass, filters);
    } catch (e) {
      console.error("Chronos: history fetch failed", e);
      this._entries = [];
    } finally {
      this._loading = false;
    }
  }

  render() {
    const schedules = this.card._schedules;
    const total = this._entries.length;
    const errors = this._entries.filter((e) => e.outcome === "error").length;
    const oks = total - errors;

    return html`
      <div class="col" style="gap:18px;max-width:1200px">
        <div class="sp-between" style="align-items:flex-start;flex-wrap:wrap;row-gap:10px">
          <div>
            <h1 class="page-title">${t("history.title")}</h1>
            <p class="page-sub">${t("history.subtitle")}</p>
          </div>
          <div class="row" style="gap:8px;flex-wrap:wrap">
            <button class="btn" @click=${() => this._reload()}>${icon("repeat", 13)} ${t("common.refresh")}</button>
            <button class="btn" style="color:var(--danger)" @click=${() => { this._confirmClear = true; }}>
              ${icon("trash", 13)} ${t("history.clear")}
            </button>
          </div>
        </div>

        <div class="card">
          <div class="grid-auto" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px">
            <div class="field">
              <label class="field__label">${t("history.from")}</label>
              <input type="datetime-local" class="input mono" .value=${this._from}
                @change=${(e: Event) => { this._from = (e.target as HTMLInputElement).value; void this._reload(); }}/>
            </div>
            <div class="field">
              <label class="field__label">${t("history.to")}</label>
              <input type="datetime-local" class="input mono" .value=${this._to}
                @change=${(e: Event) => { this._to = (e.target as HTMLInputElement).value; void this._reload(); }}/>
            </div>
            <div class="field">
              <label class="field__label">${t("history.schedule")}</label>
              <select class="select mono"
                @change=${(e: Event) => { this._scheduleId = (e.target as HTMLSelectElement).value; void this._reload(); }}>
                <option value="" ?selected=${this._scheduleId === ""}>${t("history.all_schedules")}</option>
                ${schedules.map((s) => html`<option value="${s.id}" ?selected=${this._scheduleId === s.id}>${s.name}</option>`)}
              </select>
            </div>
            <div class="field">
              <label class="field__label">${t("history.kind")}</label>
              <select class="select mono"
                @change=${(e: Event) => { this._kind = (e.target as HTMLSelectElement).value as any; void this._reload(); }}>
                <option value="" ?selected=${this._kind === ""}>${t("history.kind.all")}</option>
                <option value="block" ?selected=${this._kind === "block"}>${t("history.kind.block")}</option>
                <option value="rule" ?selected=${this._kind === "rule"}>${t("history.kind.rule")}</option>
              </select>
            </div>
            <div class="field">
              <label class="field__label">${t("history.outcome")}</label>
              <select class="select mono"
                @change=${(e: Event) => { this._outcome = (e.target as HTMLSelectElement).value as any; void this._reload(); }}>
                <option value="" ?selected=${this._outcome === ""}>${t("history.outcome.all")}</option>
                <option value="ok" ?selected=${this._outcome === "ok"}>${t("history.outcome.ok")}</option>
                <option value="error" ?selected=${this._outcome === "error"}>${t("history.outcome.error")}</option>
              </select>
            </div>
          </div>
        </div>

        <div class="grid-3">
          <div class="kpi">
            <div class="kpi__label">${t("history.kpi.total")}</div>
            <div class="kpi__value">${total}</div>
            <div class="kpi__delta">${t("history.kpi.in_range")}</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${t("history.kpi.ok")}</div>
            <div class="kpi__value" style="color:var(--ok)">${oks}</div>
            <div class="kpi__delta">${total ? Math.round((oks / total) * 100) : 0}%</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${t("history.kpi.errors")}</div>
            <div class="kpi__value" style="color:${errors > 0 ? "var(--danger)" : "var(--text-muted)"}">${errors}</div>
            <div class="kpi__delta">${total ? Math.round((errors / total) * 100) : 0}%</div>
          </div>
        </div>

        ${this._renderChart()}

        <div class="card">
          <div class="card__header">
            <div style="flex:1">
              <h3 class="card__title">${t("history.events")}</h3>
              <p class="card__sub">${t("history.events.sub", { n: total })}</p>
            </div>
          </div>
          ${this._loading
            ? html`<div class="text-mute" style="padding:30px;text-align:center">${t("common.loading")}</div>`
            : !total
              ? html`<div class="text-mute" style="padding:30px;text-align:center">${t("history.empty")}</div>`
              : html`<div class="col" style="gap:4px">
                  ${this._entries.slice(0, 200).map((e) => this._renderRow(e))}
                  ${this._entries.length > 200 ? html`<div class="text-xs text-mute" style="padding:8px;text-align:center">${t("history.truncated", { n: 200, total })}</div>` : nothing}
                </div>`}
        </div>

        ${this._confirmClear ? this._renderClearModal() : nothing}
      </div>
    `;
  }

  /** Mini bar chart of events per day across the selected range. Uses
   * SVG, no chart library. Heights normalised to the busiest day. */
  private _renderChart() {
    if (!this._entries.length) return nothing;
    const buckets: Record<string, { ok: number; err: number }> = {};
    for (const e of this._entries) {
      const day = (e.ts || "").slice(0, 10); // YYYY-MM-DD
      if (!day) continue;
      const b = buckets[day] || { ok: 0, err: 0 };
      if (e.outcome === "error") b.err++;
      else b.ok++;
      buckets[day] = b;
    }
    const days = Object.keys(buckets).sort();
    if (!days.length) return nothing;
    const max = Math.max(...days.map((d) => buckets[d].ok + buckets[d].err));
    const W = 600, H = 120, padX = 30, padY = 10;
    const colW = (W - padX * 2) / Math.max(1, days.length);
    return html`
      <div class="card">
        <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("history.chart.title")}</h3><p class="card__sub">${t("history.chart.sub")}</p></div></div>
        <svg viewBox="0 0 ${W} ${H + 18}" style="width:100%;height:auto;display:block">
          ${days.map((d, i) => {
            const b = buckets[d];
            const total = b.ok + b.err;
            const h = max > 0 ? ((H - padY * 2) * total) / max : 0;
            const errH = max > 0 ? ((H - padY * 2) * b.err) / max : 0;
            const x = padX + i * colW + 2;
            const okY = H - padY - h;
            const errY = H - padY - errH;
            const w = Math.max(2, colW - 4);
            return svg`
              <g>
                <rect x="${x}" y="${okY}" width="${w}" height="${h - errH}" fill="var(--ok)" rx="2"/>
                <rect x="${x}" y="${errY}" width="${w}" height="${errH}" fill="var(--danger)" rx="2"/>
                <text x="${x + w / 2}" y="${H + 12}" text-anchor="middle" font-size="9" fill="var(--text-muted)" font-family="var(--font-mono)">${d.slice(5)}</text>
              </g>
            `;
          })}
        </svg>
      </div>
    `;
  }

  private _renderRow(e: HistoryEntry) {
    const ts = new Date(e.ts);
    const tsStr = isNaN(ts.getTime()) ? e.ts : ts.toLocaleString();
    const isErr = e.outcome === "error";
    const actionLbl = actionDefLabel(e.device_type, e.action_id, e.action_id);
    const valStr = e.value === undefined || e.value === null || e.value === ""
      ? ""
      : (typeof e.value === "object" ? JSON.stringify(e.value) : String(e.value));
    return html`
      <div class="row" style="gap:10px;padding:8px 12px;border-radius:6px;background:${isErr ? "color-mix(in srgb, var(--danger) 8%, transparent)" : "var(--bg-sunken)"};border:1px solid ${isErr ? "color-mix(in srgb, var(--danger) 30%, transparent)" : "var(--border-soft)"}">
        <span class="mono text-xs text-mute" style="min-width:140px;flex-shrink:0">${tsStr}</span>
        <span class="chip" style="flex-shrink:0;background:${e.kind === "rule" ? "color-mix(in srgb, var(--accent) 12%, transparent)" : "var(--bg)"};color:${e.kind === "rule" ? "var(--accent-ink)" : "var(--text)"}">
          ${e.kind === "rule" ? icon("cloud", 11) : icon("clock", 11)} ${t("history.kind." + e.kind)}
        </span>
        <span class="text-sm fw-600" style="min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${e.schedule_name}">${e.schedule_name || e.schedule_id}</span>
        <span class="text-xs text-mute mono" style="min-width:0;flex:2;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${e.entity_id || ""}">
          ${actionLbl}${valStr ? ` · ${valStr}` : ""}${e.entity_id ? ` → ${e.entity_id}` : ""}
        </span>
        <span class="chip" style="flex-shrink:0;background:${isErr ? "var(--danger)" : "var(--ok)"};color:white;border-color:transparent">
          ${isErr ? t("history.outcome.error") : t("history.outcome.ok")}
        </span>
        ${e.error ? html`<span class="text-xs" style="color:var(--danger);max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${e.error}">${e.error}</span>` : nothing}
      </div>
    `;
  }

  private _renderClearModal() {
    return html`
      <div class="modal-overlay" @click=${() => { this._confirmClear = false; }}>
        <div class="card" style="width:min(420px,100%);padding:22px" @click=${(ev: Event) => ev.stopPropagation()}>
          <h3 style="margin:0 0 8px">${t("history.clear")}?</h3>
          <p class="text-sm text-mute" style="margin:0 0 16px">${t("history.clear.warn")}</p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${() => { this._confirmClear = false; }}>${t("common.cancel")}</button>
            <button class="btn btn--primary" style="background:var(--danger)"
              @click=${async () => {
                this._confirmClear = false;
                if (!this.card?.hass) return;
                try { await clearHistory(this.card.hass); } catch (e) { console.error(e); }
                await this._reload();
              }}>${icon("trash", 12)} ${t("common.confirm")}</button>
          </div>
        </div>
      </div>
    `;
  }
}
