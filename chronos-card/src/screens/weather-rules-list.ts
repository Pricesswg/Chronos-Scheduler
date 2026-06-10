import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import type { WeatherRule } from "../types";

/** Cross-schedule rule manager (v1.17+): rules are first-class objects in
 * the global store; each row shows the schedules the rule is attached to
 * as chips. Toggling `active` here affects every target schedule. */
@customElement("chronos-weather-rules-list")
export class ChronosWeatherRulesList extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  /** "" = all rules; otherwise only rules targeting this schedule id. */
  @state() private _filterSchedId = "";

  render() {
    const rules = this.card._rules;
    const totalActive = rules.filter((r) => r.active).length;
    const schedsWithRules = this.card._schedules.filter((s) =>
      rules.some((r) => (r.targets || []).some((tg) => tg.schedule_id === s.id)),
    );
    const filterValid = this._filterSchedId && schedsWithRules.some((s) => s.id === this._filterSchedId);
    const visible = filterValid
      ? rules.filter((r) => (r.targets || []).some((tg) => tg.schedule_id === this._filterSchedId))
      : rules;

    return html`
      <div class="col" style="gap:22px">
        <div class="sp-between" style="flex-wrap:wrap;row-gap:10px">
          <div>
            <h1 class="page-title">${t("nav.weather_rules")}</h1>
            <p class="page-sub">${rules.length} · ${totalActive} ${t("schedule.active").toLowerCase()}</p>
          </div>
          <div class="row" style="gap:8px;flex-wrap:wrap">
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

        ${!rules.length ? html`
          <div class="card" style="text-align:center;padding:40px 20px;color:var(--text-muted)">
            <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${icon("cloud", 22)}</div>
            <div style="font-weight:600;color:var(--text);font-size:14px">${t("editor.weather_rules.empty")}</div>
          </div>
        ` : html`
          <div class="card">
            <div class="col" style="gap:0">
              ${visible.map((r) => this._renderRule(r))}
            </div>
          </div>
        `}
      </div>
    `;
  }

  private _renderRule(r: WeatherRule) {
    const targets = r.targets || [];
    return html`
      <div class="rule-block" style="border-radius:0;border:0;border-bottom:1px solid var(--border-soft);padding:12px 10px;cursor:pointer"
        @click=${() => this.card.editWeatherRule(r.id!)}>
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

  private async _deleteRule(r: WeatherRule) {
    const n = (r.targets || []).length;
    const msg = n > 1
      ? t("wrl.delete.shared", { n })
      : `${t("common.remove")}: ${r.if || ""} → ${r.then}?`;
    if (!confirm(msg)) return;
    await this.card.doRemoveRule(r.id!);
  }
}
