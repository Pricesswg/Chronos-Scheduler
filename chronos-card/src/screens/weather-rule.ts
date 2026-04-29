import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon } from "../icons";
import { getActionsForType } from "../actions";
import { DEVICE_TYPES } from "../utils";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";
import "../timeline";

function getRuleActions() {
  return [
    { key: "skip", label: t("wr.action.skip"), desc: t("wr.action.skip.desc") },
    { key: "shift", label: t("wr.action.shift"), desc: t("wr.action.shift.desc") },
    { key: "force", label: t("wr.action.force"), desc: t("wr.action.force.desc") },
    { key: "duration", label: t("wr.action.duration"), desc: t("wr.action.duration.desc") },
  ];
}

@customElement("chronos-weather-rule")
export class ChronosWeatherRule extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  @state() private _variable = "temperature";
  @state() private _op = ">";
  @state() private _value = "22";
  @state() private _action = "skip";
  @state() private _actionValue = "";

  render() {
    const schedule = this.card._schedules.find((s) => s.id === this.card._selectedId) || this.card._schedules[0];
    if (!schedule) return nothing;

    const deviceType = schedule.device_type;
    const typeActions = getActionsForType(deviceType);
    const weatherAttrs = this.card._weatherAttributes;
    const varDef = weatherAttrs.find((v) => v.key === this._variable) || weatherAttrs[0];
    const weatherEntity = this.card._settings?.weather_entity || "";

    const ifText = `${this._variable} ${this._op} ${this._value}${varDef?.unit || ""}`;
    const forcedDef = typeActions.find((a) => a.id === this._actionValue);
    const thenText =
      this._action === "skip" ? t("wr.action.skip")
        : this._action === "shift" ? `${this._actionValue}${varDef?.unit || ""}`
          : this._action === "force" ? `${t("wr.action.force")}: ${forcedDef?.label || "—"}`
            : `${this._actionValue || "+30"} ${t("common.min")}`;

    return html`
      <div class="col" style="gap:22px;max-width:1100px">
        <div>
          <button class="btn btn--ghost btn--sm" @click=${() => this.card.navigate("editor")}>
            ${icon("chevron-left", 14)} ${t("nav.editor")}
          </button>
          <h1 class="page-title" style="margin-top:6px">${t("wr.heading")}</h1>
          <p class="page-sub">${t("wr.subtitle")} · <strong>${schedule.name}</strong></p>
        </div>

        <div class="card" style="padding:22px">
          <div class="rule-block" style="background:var(--surface);border:2px dashed var(--border)">
            <span class="rule-block__label rule-block__label--if">IF</span>
            <span class="rule-token mono text-xs">${weatherEntity || "—"}.</span>
            <span class="rule-token rule-token--weather">${icon(varDef?.icon || "cloud", 11)} ${varDef?.label || this._variable}</span>
            <span class="rule-token mono">${this._op}</span>
            <span class="rule-token rule-token--weather mono">${this._value}${varDef?.unit || ""}</span>
            <span class="rule-block__label rule-block__label--then">THEN</span>
            <span class="rule-token rule-token--accent">${thenText}</span>
          </div>
        </div>

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
                        <div class="tile-pick__name" style="font-size:12.5px">${v.label}</div>
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
                          <option value=">" ?selected=${this._op === ">"}>maggiore di (&gt;)</option>
                          <option value=">=" ?selected=${this._op === ">="}>maggiore o uguale</option>
                          <option value="<" ?selected=${this._op === "<"}>minore di (&lt;)</option>
                          <option value="<=" ?selected=${this._op === "<="}>minore o uguale</option>
                          <option value="==" ?selected=${this._op === "=="}>uguale a (==)</option>
                          <option value="!=" ?selected=${this._op === "!="}>diverso da (!=)</option>`}
                  </select>
                </div>
                <div class="field">
                  <label class="field__label">${t("wr.threshold")}</label>
                  ${varDef?.type === "enum"
                    ? html`<select class="select" @change=${(e: Event) => { this._value = (e.target as HTMLSelectElement).value; }}>
                        ${(varDef.options || []).map((o) => html`<option value="${o}" ?selected=${this._value === o}>${o}</option>`)}
                      </select>`
                    : html`<input class="input mono" .value=${this._value} @input=${(e: InputEvent) => { this._value = (e.target as HTMLInputElement).value; }}/>`}
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("wr.then.title")}</h3><p class="card__sub">${t("wr.then.subtitle")}</p></div></div>
            <div class="col" style="gap:12px">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
                ${getRuleActions().map((a) => html`
                  <button class="tile-pick" data-selected="${this._action === a.key}" @click=${() => { this._action = a.key; }}>
                    <div class="tile-pick__name">${a.label}</div>
                    <div class="tile-pick__desc">${a.desc}</div>
                  </button>
                `)}
              </div>
              ${this._action !== "skip" ? html`
                <div class="field">
                  <label class="field__label">${this._action === "force" ? t("wr.action.force") : t("common.value")}</label>
                  ${this._action === "force"
                    ? html`<select class="select" @change=${(e: Event) => { this._actionValue = (e.target as HTMLSelectElement).value; }}>
                        ${typeActions.map((a) => html`<option value="${a.id}" ?selected=${this._actionValue === a.id}>${a.label}</option>`)}
                      </select>`
                    : html`<input class="input mono" .value=${this._actionValue} @input=${(e: InputEvent) => { this._actionValue = (e.target as HTMLInputElement).value; }}
                        placeholder="${this._action === "shift" ? "-1, +2, …" : "+30, -15, …"}"/>`}
                </div>
              ` : nothing}
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card__header"><div style="flex:1"><h3 class="card__title">${t("wr.preview")}</h3><p class="card__sub">${t("wr.preview.subtitle")}</p></div></div>
          <chronos-timeline variant="linear" .deviceType=${schedule.device_type} .blocks=${schedule.blocks} .interactive=${false} .now=${this.nowHour} .forecast=${this.card._forecast}></chronos-timeline>
        </div>

        <div class="row" style="justify-content:flex-end;gap:8px">
          <button class="btn" @click=${() => this.card.navigate("editor")}>${t("common.cancel")}</button>
          <button class="btn btn--primary" @click=${() => {
            const schedule2 = this.card._schedules.find((s) => s.id === this.card._selectedId);
            if (!schedule2) return;
            const newRules = [...(schedule2.weather_rules || []), { if: ifText, then: thenText, active: true }];
            this.card.updateScheduleLocal(schedule2.id, { weather_rules: newRules });
            this.card.navigate("editor");
          }}>${icon("check", 14)} ${t("common.save")}</button>
        </div>
      </div>
    `;
  }
}
