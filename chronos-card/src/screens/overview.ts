import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { getDeviceColor } from "../device-colors";
import { actionColor } from "../actions";
import { fmtHour, computeRepeat } from "../utils";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import type { ChronosDevice, Schedule } from "../types";
import { groupSchedules, loadCollapsed, saveCollapsed, type GroupBy } from "../grouping";
import "../timeline";

@customElement("chronos-overview")
export class ChronosOverview extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;
  @state() private _collapsed: Set<string> = loadCollapsed();

  render() {
    const { _schedules: schedules, _devices: devices } = this.card;
    const total = schedules.length;
    const active = schedules.filter((s) => s.enabled).length;
    const weatherRules = this.card._rules.filter((r) => r.active).length;
    const groupBy = (this.card._settings?.overview_group_by ?? "group") as GroupBy;
    const groups = groupSchedules(schedules, groupBy);
    // One bucket carries no information: render flat, as before groups existed.
    const headers = groups.length > 1;

    return html`
      <div class="col" style="gap:22px">
        <div>
          <h1 class="page-title">${t("screen.overview.title")}</h1>
          <p class="page-sub">${t("overview.subtitle", { n: active, tot: total })}</p>
        </div>

        <div class="grid-3">
          <div class="kpi">
            <div class="kpi__label">${t("overview.kpi.active")}</div>
            <div class="kpi__value">${active}<span class="text-mute" style="font-size:16px;margin-left:6px">/${total}</span></div>
            <div class="kpi__delta">${devices.length} ${t("overview.kpi.devices").toLowerCase()}</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${t("overview.kpi.weather_rules")}</div>
            <div class="kpi__value">${weatherRules}</div>
            <div class="kpi__delta">${t("device.state.live")}</div>
          </div>
          <div class="kpi">
            <div class="kpi__label">${t("overview.kpi.now")}</div>
            <div class="kpi__value">${fmtHour(this.nowHour)}</div>
            <div class="kpi__delta">${t("device.state.live")}</div>
          </div>
        </div>

        <div class="sp-between">
          <div class="row">
            <h2 style="margin:0;font-size:16px;font-weight:600;letter-spacing:-0.01em">${t("nav.overview")}</h2>
            <span class="tag mono">${total}</span>
          </div>
          <div class="row" style="flex-wrap:wrap;gap:8px">
            <div class="segmented" data-role="mode" title="${t("mode.hint")}">
              ${(["home", "away", "holiday"] as const).map((m) => html`
                <button data-active="${this.card.currentMode() === m}" data-mode="${m}" @click=${() => this.card.doSetMode(m)}>
                  ${t("mode." + m)}
                </button>
              `)}
            </div>
            <button class="btn" @click=${() => this.card.navigate("week")}>${icon("calendar", 14)} ${t("nav.week")}</button>
            <button class="btn" @click=${() => this.card.createSceneSchedule()} title="${t("overview.new_scene.hint")}">
              ${icon("sun", 14)} ${t("overview.new_scene")}
            </button>
            <button class="btn" @click=${() => this.card.createAutomationSchedule()} title="${t("overview.new_automation.hint")}">
              ${icon("wand", 14)} ${t("overview.new_automation")}
            </button>
            <button class="btn" @click=${() => this.card.createServiceSchedule()} title="${t("overview.new_service.hint")}">
              ${icon("terminal", 14)} ${t("overview.new_service")}
            </button>
            <button class="btn btn--primary" @click=${() => this.card.navigate("wizard")}>${icon("plus", 14)} ${t("nav.new_schedule")}</button>
          </div>
        </div>

        ${groups.map((g) => {
          const collapsed = headers && this._collapsed.has(g.key);
          return html`
            <div class="col" style="gap:12px" data-role="group" data-key="${g.key}">
              ${headers ? html`
                <button class="group-head" data-collapsed="${collapsed}" @click=${() => this._toggleGroup(g.key)}
                  title="${collapsed ? t("overview.group.expand") : t("overview.group.collapse")}">
                  ${icon(collapsed ? "chevron-right" : "chevron-down", 14)}
                  <span class="group-head__name">${g.label}</span>
                  <span class="tag mono">${g.items.filter((s) => s.enabled).length}/${g.items.length}</span>
                </button>` : nothing}
              ${collapsed ? nothing : html`<div class="grid-auto">${g.items.map((s) => this._renderCard(s, devices))}</div>`}
            </div>
          `;
        })}
      </div>
    `;
  }

  private _toggleGroup(key: string) {
    const next = new Set(this._collapsed);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    this._collapsed = next;
    saveCollapsed(next);
  }

  private _renderCard(s: Schedule, devices: ChronosDevice[]) {
    const devs = (s.device_ids || []).map((id) => devices.find((d) => d.id === id)).filter(Boolean);
    const activeRules = this.card.rulesForSchedule(s.id).filter((r) => r.active).length;
    const conflicts = this.card.deviceConflictWarnings(s);
    const paused = s.enabled && this.card.isPaused(s);
    const idle = s.enabled && !this.card.scheduleRunsInMode(s);
    return html`
      <div class="sched-card" data-selected="${s.id === this.card._selectedId}"
        @click=${() => this.card.selectSchedule(s.id, "editor")}>
        <div class="sched-card__header">
          <div style="flex:1;min-width:0">
            <h3 class="sched-card__title">${s.name}</h3>
            <div class="sched-card__sub">${computeRepeat(s.days)} · ${s.blocks.length}</div>
          </div>
          <button class="btn btn--icon btn--ghost btn--sm" data-action="pause" title="${paused ? t("pause.resume") : t("pause.button")}"
            @click=${(e: Event) => { e.stopPropagation(); if (paused) this.card.doPauseSchedule(s.id, null); else this.card.openPauseModal(s.id); }}>
            ${icon(paused ? "play" : "pause", 13)}
          </button>
          <label class="switch" @click=${(e: Event) => e.stopPropagation()}>
            <input type="checkbox" .checked=${s.enabled} @change=${(e: Event) => {
              const el = e.target as HTMLInputElement;
              this.card.doToggleSchedule(s.id, el.checked, el);
            }}/>
            <span class="switch__track"></span>
            <span class="switch__thumb"></span>
          </label>
        </div>

        <chronos-timeline
          variant="linear"
          .deviceType=${s.device_type}
          .blocks=${s.blocks}
          .now=${s.enabled ? this.nowHour : null}
          .interactive=${false}
          height="compact"
          .showWeather=${false}
          .ruleBlocks=${this.card.ruledBlockIndices(s.id, s.blocks.length)}
        ></chronos-timeline>

        <div class="sched-card__footer">
          <div class="sched-card__devices">
            ${devs.length === 0 && !["scene", "automation", "service"].includes(s.device_type)
              ? html`<span class="chip" style="background:color-mix(in srgb, var(--danger) 15%, transparent);color:var(--danger);border-color:color-mix(in srgb, var(--danger) 35%, transparent)" title="${t("overview.no_devices.tooltip")}">
                  ${icon("info", 11)} ${t("overview.no_devices")}
                </span>`
              : html`${devs.slice(0, 5).map((d: any) => {
                  const c = getDeviceColor(d, this.card.hass?.states?.[d.entity_id], this.card._settings);
                  return html`<div class="device-icon-pill" title="${d.alias}" style="background:${c.soft};color:${c.accent}">${deviceIcon(d.type, 14)}</div>`;
                })}
                ${devs.length > 5 ? html`<div class="device-icon-pill mono" style="font-size:10px">+${devs.length - 5}</div>` : nothing}`}
          </div>
          <div style="flex:1"></div>
          ${conflicts.length ? html`<span class="chip chip--conflict" title="${conflicts.join("\n")}">${icon("info", 11)} ${t("overview.conflicts", { n: conflicts.length })}</span>` : nothing}
          ${idle ? html`<span class="chip chip--idle" data-role="idle">${icon("moon", 11)} ${t("mode.inactive", { mode: t("mode." + this.card.currentMode()) })}</span>` : nothing}
          ${paused ? html`<span class="chip chip--paused">${icon("pause", 11)} ${t("pause.badge", { when: this.card.pausedLabel(s) })}</span>` : nothing}
          ${activeRules > 0 ? html`<span class="chip chip--weather">${icon("cloud", 11)} ${t("overview.rules_count", { n: activeRules })}</span>` : nothing}
          <span class="chip ${s.enabled ? "chip--on" : ""}"><span class="chip__dot"></span>${s.enabled ? t("schedule.active") : t("schedule.disabled")}</span>
        </div>
      </div>
    `;
  }

}
