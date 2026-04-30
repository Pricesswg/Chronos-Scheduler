import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon } from "../icons";
import { KIND_COLORS } from "../actions";
import { getDays } from "../utils";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import "../timeline";

@customElement("chronos-week")
export class ChronosWeek extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  // null = mostra tutte; Set = solo questi schedule id
  @state() private _filter: Set<string> | null = null;

  render() {
    const { _schedules: schedules } = this.card;
    const enabledSchedules = schedules.filter((s) => s.enabled);
    const activeCount = enabledSchedules.length;
    const filterSet = this._filter;
    const visibleSchedules = filterSet
      ? enabledSchedules.filter((s) => filterSet.has(s.id))
      : enabledSchedules;
    const todayIdx = new Date().getDay();
    const adjustedToday = todayIdx === 0 ? 6 : todayIdx - 1;
    const days = getDays();

    return html`
      <div class="col" style="gap:22px">
        <div>
          <h1 class="page-title">${t("screen.week.title")}</h1>
          <p class="page-sub">${t("week.subtitle", { n: activeCount })}</p>
        </div>

        ${enabledSchedules.length ? html`
          <div class="card" style="padding:14px">
            <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">
              <div class="fw-600 text-sm">${t("common.search") /* "Filtra" key fallback */ === "Filtra" ? "Filtra" : "Filtra schedulazioni"}</div>
              <div class="row" style="gap:6px">
                <button class="btn btn--sm" @click=${() => { this._filter = null; }}>
                  ${t("editor.days.all")}
                </button>
                <button class="btn btn--sm" @click=${() => { this._filter = new Set(); }}>
                  ${t("common.none")}
                </button>
              </div>
            </div>
            <div class="row" style="gap:6px;flex-wrap:wrap">
              ${enabledSchedules.map((s) => {
                const on = !filterSet || filterSet.has(s.id);
                return html`
                  <button class="chip"
                    style="cursor:pointer;background:${on ? "var(--accent-soft)" : "var(--bg-sunken)"};color:${on ? "var(--accent-ink)" : "var(--text-muted)"};border:1px solid ${on ? "transparent" : "var(--border-soft)"}"
                    @click=${() => this._toggleFilter(s.id)}>
                    ${on ? icon("check", 11) : nothing} ${s.name}
                  </button>
                `;
              })}
            </div>
          </div>
        ` : nothing}

        <div class="card">
          <div class="weekgrid">
            <div class="weekgrid__row" style="margin-bottom:6px">
              <div></div>
              <div style="position:relative;height:18px;font-family:var(--font-mono);font-size:10px;color:var(--text-muted)">
                ${[0, 4, 8, 12, 16, 20, 24].map((h) => html`
                  <span style="position:absolute;left:${(h / 24) * 100}%;transform:translateX(-50%)">${String(h).padStart(2, "0")}</span>
                `)}
              </div>
            </div>
            ${days.map((d: string, dayIdx: number) => {
              const todays = visibleSchedules.filter((s) => s.days[dayIdx]);
              return html`
              <div class="weekgrid__row">
                <div class="weekgrid__day" style="color:${dayIdx === adjustedToday ? "var(--accent)" : ""}">
                  ${d}${dayIdx === adjustedToday ? html`<span style="display:block;font-size:9px;margin-top:2px">${t("week.today").toUpperCase()}</span>` : nothing}
                </div>
                <div style="position:relative">
                  <div class="col" style="gap:4px">
                    ${todays.map((s) => html`
                      <div class="row" style="gap:8px;align-items:center">
                        <span style="width:90px;font-size:11.5px;color:var(--text-muted);font-weight:500;cursor:pointer" class="truncate"
                          @click=${() => this.card.selectSchedule(s.id, "editor")}>${s.name}</span>
                        <div style="flex:1">
                          <chronos-timeline variant="linear" .deviceType=${s.device_type} .blocks=${s.blocks} .interactive=${false} height="mini" .showWeather=${false}
                            .now=${dayIdx === adjustedToday ? this.nowHour : null}></chronos-timeline>
                        </div>
                      </div>
                    `)}
                    ${!todays.length
                      ? html`<div class="text-xs text-mute" style="padding:8px 0;font-style:italic">—</div>`
                      : nothing}
                  </div>
                </div>
              </div>
            `;
            })}
          </div>
        </div>

        <div class="row" style="gap:14px;flex-wrap:wrap">
          ${Object.entries(KIND_COLORS).map(([k, c]) => {
            const labels: Record<string, string> = {
              on: t("schedule.active"),
              off: t("schedule.disabled"),
              set: t("common.value"),
              preset: "Preset",
              cmd: t("editor.block.action"),
            };
            return html`
              <div class="row" style="gap:6px">
                <span style="width:12px;height:8px;border-radius:2px;background:${c}"></span>
                <span class="text-xs">${labels[k]}</span>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  private _toggleFilter(id: string) {
    const cur = this._filter ?? new Set(this.card._schedules.filter((s) => s.enabled).map((s) => s.id));
    const next = new Set(cur);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    // Se stiamo selezionando tutti, torna a null per mostrare default-all
    const all = this.card._schedules.filter((s) => s.enabled);
    this._filter = next.size === all.length ? null : next;
  }
}
