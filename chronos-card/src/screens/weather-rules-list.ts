import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { fmtHour, resolveBlockTime } from "../utils";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import type { Schedule, WeatherRule } from "../types";

@customElement("chronos-weather-rules-list")
export class ChronosWeatherRulesList extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  /** "" = show every schedule's rules; otherwise a schedule id. */
  @state() private _filterSchedId = "";

  render() {
    const withRules = this.card._schedules.filter((s) => (s.weather_rules || []).length);
    const totalRules = withRules.reduce((n, s) => n + (s.weather_rules || []).length, 0);
    const totalActive = withRules.reduce(
      (n, s) => n + (s.weather_rules || []).filter((r) => r.active).length, 0,
    );
    // Reset a stale filter if the filtered schedule lost its rules.
    const filterValid = this._filterSchedId && withRules.some((s) => s.id === this._filterSchedId);
    const groups = filterValid
      ? withRules.filter((s) => s.id === this._filterSchedId)
      : withRules;

    return html`
      <div class="col" style="gap:22px">
        <div class="sp-between" style="flex-wrap:wrap;row-gap:10px">
          <div>
            <h1 class="page-title">${t("nav.weather_rules")}</h1>
            <p class="page-sub">${totalRules} · ${totalActive} ${t("schedule.active").toLowerCase()}</p>
          </div>
          <div class="row" style="gap:8px;flex-wrap:wrap">
            ${withRules.length > 1 ? html`
              <select class="select" style="max-width:220px"
                @change=${(e: Event) => { this._filterSchedId = (e.target as HTMLSelectElement).value; }}>
                <option value="" ?selected=${!filterValid}>${t("wrl.filter.all")}</option>
                ${withRules.map((s) => html`
                  <option value="${s.id}" ?selected=${this._filterSchedId === s.id}>${s.name}</option>
                `)}
              </select>
            ` : nothing}
            <button class="btn btn--primary" @click=${() => this.card.navigate("weatherRule")}>
              ${icon("plus", 14)} ${t("editor.weather_rules.add")}
            </button>
          </div>
        </div>

        ${!totalRules ? html`
          <div class="card" style="text-align:center;padding:40px 20px;color:var(--text-muted)">
            <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${icon("cloud", 22)}</div>
            <div style="font-weight:600;color:var(--text);font-size:14px">${t("editor.weather_rules.empty")}</div>
          </div>
        ` : groups.map((s) => this._renderGroup(s))}
      </div>
    `;
  }

  /** One card per schedule: header identifies the schedule the rules are
   * attached to (name, device type, enabled state), rows are its rules. */
  private _renderGroup(s: Schedule) {
    const rules = s.weather_rules || [];
    const activeCount = rules.filter((r) => r.active).length;
    return html`
      <div class="card">
        <div class="card__header" style="cursor:pointer" title="${t("device.open_schedule")}"
          @click=${() => this.card.selectSchedule(s.id, "editor")}>
          <div class="row" style="gap:10px;flex:1;min-width:0">
            <div class="device-row__icon" style="width:34px;height:34px;flex:0 0 auto">${deviceIcon(s.device_type, 16)}</div>
            <div style="min-width:0;flex:1">
              <h3 class="card__title truncate">${s.name}</h3>
              <p class="card__sub">${t("wrl.group.sub", { n: rules.length, active: activeCount })}</p>
            </div>
            <span class="chip ${s.enabled ? "chip--on" : ""}" style="flex:0 0 auto">
              <span class="chip__dot"></span>${s.enabled ? t("schedule.active") : t("schedule.disabled")}
            </span>
            ${icon("chevron-right", 14)}
          </div>
        </div>
        <div class="col" style="gap:0">
          ${rules.map((r, idx) => this._renderRule(s, r, idx))}
        </div>
      </div>
    `;
  }

  private _renderRule(s: Schedule, r: WeatherRule, idx: number) {
    const targetLabel = (r.block_index === null || r.block_index === undefined)
      ? t("wr.target.all_blocks")
      : (() => {
          const b = s.blocks[r.block_index!];
          if (!b) return `#${r.block_index! + 1}`;
          return `#${r.block_index! + 1} ${fmtHour(resolveBlockTime(b, "start"))}-${fmtHour(resolveBlockTime(b, "end"))}`;
        })();
    return html`
      <div class="rule-block" style="border-radius:0;border:0;border-bottom:1px solid var(--border-soft);padding:12px 10px;cursor:pointer"
        @click=${() => this.card.editWeatherRule(s.id, idx)}>
        <span class="chip" style="flex:0 0 auto" title="${t("wr.target.label")}">
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
          <input type="checkbox" .checked=${r.active} @change=${(e: Event) => this._toggleRule(s.id, idx, (e.target as HTMLInputElement).checked)}/>
          <span class="switch__track"></span>
          <span class="switch__thumb"></span>
        </label>
        <button class="btn btn--sm" @click=${(e: Event) => { e.stopPropagation(); this.card.editWeatherRule(s.id, idx); }}
          title="${t("common.edit")}">
          ${icon("edit", 12)} ${t("common.edit")}
        </button>
        <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
          @click=${(e: Event) => { e.stopPropagation(); this._deleteRule(s.id, idx); }}
          title="${t("common.remove")}">
          ${icon("trash", 12)}
        </button>
      </div>
    `;
  }

  private async _toggleRule(schedId: string, idx: number, active: boolean) {
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const rules = [...(sched.weather_rules || [])];
    rules[idx] = { ...rules[idx], active };
    this.card.updateScheduleLocal(schedId, { weather_rules: rules });
    await this.card.saveScheduleById(schedId);
  }

  private async _deleteRule(schedId: string, idx: number) {
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const r = sched.weather_rules?.[idx];
    if (!r) return;
    if (!confirm(`${t("common.remove")}: ${r.if} → ${r.then}?`)) return;
    const rules = (sched.weather_rules || []).filter((_, i) => i !== idx);
    this.card.updateScheduleLocal(schedId, { weather_rules: rules });
    await this.card.saveScheduleById(schedId);
  }
}
