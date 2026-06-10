import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "./styles";
import { icon, deviceIcon } from "./icons";
import { getDays } from "./utils";
import { duplicateSchedule } from "./transfer";
import { t } from "./i18n";
import type { ChronosCard } from "./chronos-card";

/** Card-level modal that duplicates a schedule, letting the user adjust
 * name, devices and days BEFORE the copy is created. Opened via
 * card.openDuplicateModal(scheduleId) from the editor or the wizard. */
@customElement("chronos-duplicate-modal")
export class ChronosDuplicateModal extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false }) card!: ChronosCard;
  @property() sourceId = "";

  @state() private _name = "";
  @state() private _deviceIds: string[] = [];
  @state() private _days: number[] = [1, 1, 1, 1, 1, 1, 1];
  @state() private _includeRules = true;
  private _hydratedFor = "";

  render() {
    const src = this.card._schedules.find((s) => s.id === this.sourceId);
    if (!src) return nothing;
    this._hydrate(src);
    const deviceless = ["scene", "automation", "service"].includes(src.device_type);
    const candidates = this.card._devices.filter((d) => d.type === src.device_type);
    const ruleCount = (src.weather_rules || []).length;

    return html`
      <div class="modal-overlay" @click=${() => this.card.closeDuplicateModal()}>
        <div class="card" style="width:min(560px,100%);max-height:85vh;overflow:auto;padding:22px" @click=${(e: Event) => e.stopPropagation()}>
          <h3 style="margin:0 0 4px">${icon("copy", 15)} ${t("dup.title")}</h3>
          <p class="text-sm text-mute" style="margin:0 0 16px">${t("dup.subtitle", { name: src.name })}</p>

          <div class="field" style="margin-bottom:14px">
            <label class="field__label">${t("editor.field.name")}</label>
            <input class="input" .value=${this._name}
              @input=${(e: InputEvent) => { this._name = (e.target as HTMLInputElement).value; }}/>
          </div>

          ${!deviceless ? html`
            <div class="field" style="margin-bottom:14px">
              <label class="field__label">${t("nav.devices")}</label>
              <div class="row" style="gap:6px;flex-wrap:wrap">
                ${candidates.map((d) => {
                  const on = this._deviceIds.includes(d.id);
                  return html`
                    <button class="btn btn--sm" @click=${() => this._toggleDevice(d.id)}
                      style="background:${on ? "var(--accent)" : "var(--bg-sunken)"};color:${on ? "white" : "var(--text)"};border-color:${on ? "transparent" : "var(--border-soft)"}">
                      ${on ? icon("check", 11) : nothing} ${deviceIcon(d.type, 11)} ${d.alias}
                    </button>
                  `;
                })}
                ${!candidates.length ? html`<span class="text-xs text-mute">${t("editor.devices_empty")}</span>` : nothing}
              </div>
            </div>
          ` : nothing}

          <div class="field" style="margin-bottom:14px">
            <label class="field__label">${t("editor.days.repeat")}</label>
            <div class="row" style="gap:4px">
              ${getDays().map((d: string, i: number) => {
                const on = this._days[i];
                return html`
                  <button class="mono" @click=${() => {
                    const nd = [...this._days]; nd[i] = nd[i] ? 0 : 1; this._days = nd;
                  }} style="width:34px;height:30px;border-radius:8px;font-size:11px;font-weight:600;background:${on ? "var(--accent)" : "var(--bg-sunken)"};color:${on ? "white" : "var(--text-muted)"};border:1px solid ${on ? "transparent" : "var(--border-soft)"};cursor:pointer">
                    ${d}
                  </button>
                `;
              })}
            </div>
          </div>

          ${ruleCount ? html`
            <label class="row" style="gap:8px;cursor:pointer;margin-bottom:14px">
              <input type="checkbox" .checked=${this._includeRules}
                @change=${(e: Event) => { this._includeRules = (e.target as HTMLInputElement).checked; }}/>
              <span class="text-sm">${t("dup.include_rules", { n: ruleCount })}</span>
            </label>
          ` : nothing}

          <p class="text-xs text-mute" style="margin:0 0 16px">${t("dup.disabled_note")}</p>

          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${() => this.card.closeDuplicateModal()}>${t("common.cancel")}</button>
            <button class="btn btn--primary" ?disabled=${!this._name.trim()} @click=${() => this._confirm(src)}>
              ${icon("check", 13)} ${t("dup.create")}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _hydrate(src: any) {
    if (this._hydratedFor === src.id) return;
    this._hydratedFor = src.id;
    this._name = t("dup.copy_of", { name: src.name });
    this._deviceIds = [...(src.device_ids || [])];
    this._days = [...(src.days || [1, 1, 1, 1, 1, 1, 1])];
    this._includeRules = true;
  }

  private _toggleDevice(id: string) {
    this._deviceIds = this._deviceIds.includes(id)
      ? this._deviceIds.filter((x) => x !== id)
      : [...this._deviceIds, id];
  }

  private async _confirm(src: any) {
    const copy = duplicateSchedule(src, {
      name: this._name.trim(),
      device_ids: this._deviceIds,
      days: this._days,
      includeRules: this._includeRules,
    });
    this.card.closeDuplicateModal();
    await this.card.doAddSchedule(copy);
  }
}
