import { LitElement, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon } from "../icons";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";

@customElement("chronos-weather-rules-list")
export class ChronosWeatherRulesList extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  render() {
    const schedules = this.card._schedules;
    type Item = {
      schedId: string;
      schedName: string;
      idx: number;
      ifText: string;
      thenText: string;
      active: boolean;
    };
    const allRules: Item[] = [];
    schedules.forEach((s) => {
      (s.weather_rules || []).forEach((r, idx) => {
        allRules.push({
          schedId: s.id,
          schedName: s.name,
          idx,
          ifText: r.if || "—",
          thenText: r.then,
          active: r.active,
        });
      });
    });

    const totalActive = allRules.filter((r) => r.active).length;

    return html`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">${t("nav.weather_rules")}</h1>
            <p class="page-sub">${allRules.length} · ${totalActive} ${t("schedule.active").toLowerCase()}</p>
          </div>
          <button class="btn btn--primary" @click=${() => this.card.navigate("weatherRule")}>
            ${icon("plus", 14)} ${t("editor.weather_rules.add")}
          </button>
        </div>

        ${!allRules.length ? html`
          <div class="card" style="text-align:center;padding:40px 20px;color:var(--text-muted)">
            <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${icon("cloud", 22)}</div>
            <div style="font-weight:600;color:var(--text);font-size:14px">${t("editor.weather_rules.empty")}</div>
          </div>
        ` : html`
          <div class="card">
            <div class="col" style="gap:0">
              ${allRules.map((r) => html`
                <div class="rule-block" style="border-radius:0;border:0;border-bottom:1px solid var(--border-soft);padding:14px 12px;cursor:pointer"
                  @click=${() => this.card.selectSchedule(r.schedId, "editor")}>
                  <span class="chip chip--accent" style="flex:0 0 auto;max-width:180px" title="${r.schedName}">
                    <span class="truncate" style="max-width:160px;display:inline-block;vertical-align:middle">${r.schedName}</span>
                  </span>
                  <span class="rule-block__label rule-block__label--if">IF</span>
                  <span class="rule-token rule-token--weather">${r.ifText}</span>
                  <span class="rule-block__label rule-block__label--then">THEN</span>
                  <span class="rule-token rule-token--accent">${r.thenText}</span>
                  <div style="flex:1"></div>
                  <label class="switch" @click=${(e: Event) => e.stopPropagation()}>
                    <input type="checkbox" .checked=${r.active} @change=${(e: Event) => this._toggleRule(r.schedId, r.idx, (e.target as HTMLInputElement).checked)}/>
                    <span class="switch__track"></span>
                    <span class="switch__thumb"></span>
                  </label>
                  <button class="btn btn--sm" @click=${(e: Event) => { e.stopPropagation(); this.card.editWeatherRule(r.schedId, r.idx); }}
                    title="${t("common.edit")}">
                    ${icon("edit", 12)} ${t("common.edit")}
                  </button>
                  <button class="btn btn--icon btn--ghost btn--sm" style="color:var(--danger)"
                    @click=${(e: Event) => { e.stopPropagation(); this._deleteRule(r.schedId, r.idx); }}
                    title="${t("common.remove")}">
                    ${icon("trash", 12)}
                  </button>
                </div>
              `)}
            </div>
          </div>
        `}
      </div>
    `;
  }

  private async _toggleRule(schedId: string, idx: number, active: boolean) {
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const rules = [...(sched.weather_rules || [])];
    rules[idx] = { ...rules[idx], active };
    this.card.updateScheduleLocal(schedId, { weather_rules: rules });
    this.card._selectedId = schedId;
    await this.card.saveCurrentSchedule();
  }

  private async _deleteRule(schedId: string, idx: number) {
    const sched = this.card._schedules.find((s) => s.id === schedId);
    if (!sched) return;
    const r = sched.weather_rules?.[idx];
    if (!r) return;
    if (!confirm(`${t("common.remove")}: ${r.if} → ${r.then}?`)) return;
    const rules = (sched.weather_rules || []).filter((_, i) => i !== idx);
    this.card.updateScheduleLocal(schedId, { weather_rules: rules });
    this.card._selectedId = schedId;
    await this.card.saveCurrentSchedule();
  }
}
