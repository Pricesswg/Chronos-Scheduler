import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "../styles";
import { icon, deviceIcon } from "../icons";
import { DEVICE_TYPES } from "../utils";
import { getDeviceColor } from "../device-colors";
import { t } from "../i18n";
import type { ChronosCard } from "../chronos-card";

@customElement("chronos-devices-screen")
export class ChronosDevicesScreen extends LitElement {
  static styles = chronosStyles;

  @property({ attribute: false, hasChanged: () => true }) card!: ChronosCard;
  @property({ type: Number }) nowHour = 0;

  @state() private _pickerOpen = false;
  @state() private _search = "";
  @state() private _pickedAlias: Record<string, string> = {};
  @state() private _busyId = "";
  @state() private _lastError = "";

  private async _removeDevice(id: string, alias: string) {
    if (this._busyId) return;
    if (!confirm(`${t("common.confirm")} · ${t("devices.unlink")}: ${alias}?`)) return;
    this._busyId = id;
    this._lastError = "";
    try {
      await this.card.doRemoveDevice(id);
    } catch (e: any) {
      this._lastError = e?.message || String(e);
      console.error("Chronos: removeDevice failed", e);
    } finally {
      this._busyId = "";
    }
  }

  render() {
    const { _devices: devices, _availableEntities: available } = this.card;

    return html`
      <div class="col" style="gap:22px">
        <div class="sp-between">
          <div>
            <h1 class="page-title">${t("screen.devices.title")}</h1>
            <p class="page-sub">${t("devices.subtitle", { n: devices.length })}</p>
          </div>
          <button class="btn btn--primary" @click=${() => { this._pickerOpen = true; }}>
            ${icon("plus", 14)} ${t("devices.add_entity")}
          </button>
        </div>

        <div class="card">
          <div class="col" style="gap:0">
            ${devices.map((d) => {
              const def = DEVICE_TYPES[d.type] || { label: d.type, capabilities: [] };
              const state = this.card.hass?.states?.[d.entity_id];
              const stateStr = state?.state || "—";
              const color = getDeviceColor(d, state, this.card._settings);
              return html`
                <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0;padding:14px 10px;align-items:center">
                  <div class="device-row__icon" style="background:${color.soft};color:${color.accent};flex:0 0 auto;border:1px solid ${color.soft}">
                    ${deviceIcon(d.type, 17)}
                  </div>
                  <div class="device-row__main" style="min-width:0">
                    <input class="input" .value=${d.alias}
                      @change=${(e: Event) => this.card.doUpdateDevice(d.id, { alias: (e.target as HTMLInputElement).value })}
                      style="border:1px solid transparent;background:transparent;padding:4px 6px;font-weight:500;font-size:14px;margin-left:-6px;width:100%;max-width:240px"
                      placeholder="${t("devices.alias")}…"/>
                    <div class="device-row__meta" style="margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                      <span style="color:var(--text-muted)">${d.entity_id}</span>
                      ${d.area ? html` · ${d.area}` : nothing}
                    </div>
                  </div>
                  <span class="chip chip--accent" style="flex:0 0 auto">${def.label}</span>
                  <div class="row" style="gap:4px;flex:0 1 auto;min-width:0;overflow:hidden">
                    ${(def.capabilities || []).slice(0, 2).map((c) => html`<span class="tag mono" style="white-space:nowrap">${c}</span>`)}
                    ${(def.capabilities || []).length > 2 ? html`<span class="tag mono">+${def.capabilities.length - 2}</span>` : nothing}
                  </div>
                  <span class="mono text-xs text-mute" style="flex:0 0 auto;min-width:60px;text-align:right">${stateStr}</span>
                  <button class="btn btn--icon btn--ghost btn--sm" style="flex:0 0 auto;color:var(--danger)"
                    @click=${(ev: MouseEvent) => { ev.stopPropagation(); ev.preventDefault(); this._removeDevice(d.id, d.alias); }}
                    @mousedown=${(ev: MouseEvent) => ev.preventDefault()}
                    title="${t("devices.unlink")}">
                    ${icon("trash", 14)}
                  </button>
                </div>
              `;
            })}
            ${!devices.length ? html`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
              <div style="width:52px;height:52px;margin:0 auto 12px;border-radius:14px;background:var(--bg-sunken);display:grid;place-items:center;color:var(--text-soft)">${icon("device", 22)}</div>
              <div style="font-weight:600;color:var(--text);font-size:14px">${t("devices.empty.title")}</div>
              <div style="font-size:12.5px;margin-top:4px">${t("devices.empty.hint")}</div>
            </div>` : nothing}
          </div>
        </div>

        <p class="text-xs text-mute" style="margin:0">${t("devices.types_hint")}</p>

        ${this._pickerOpen ? this._renderPicker(available) : nothing}
      </div>
    `;
  }

  private _renderPicker(available: any[]) {
    const filtered = available.filter(
      (e) => !this._search || (e.entity_id + e.friendly_name).toLowerCase().includes(this._search.toLowerCase())
    );

    return html`
      <div class="modal-overlay" @click=${() => { this._pickerOpen = false; }}>
        <div class="card" style="width:min(640px,100%);max-height:80vh;display:flex;flex-direction:column" @click=${(e: Event) => e.stopPropagation()}>
          <div class="sp-between" style="margin-bottom:14px">
            <div>
              <h3 style="margin:0">${t("devices.picker.title")}</h3>
              <p class="text-mute text-sm" style="margin:2px 0 0">${t("devices.picker.count", { n: available.length })}</p>
            </div>
            <button class="btn btn--icon btn--ghost" @click=${() => { this._pickerOpen = false; }}>${icon("close", 16)}</button>
          </div>
          <input class="input" placeholder="${t("devices.picker.search")}" .value=${this._search}
            @input=${(e: InputEvent) => { this._search = (e.target as HTMLInputElement).value; }}
            style="margin-bottom:12px"/>
          <div style="overflow:auto;flex:1;display:flex;flex-direction:column;gap:4px">
            ${filtered.map((e) => {
              const type = e.type || "plug";
              const def = DEVICE_TYPES[type] || { label: type };
              return html`
                <div class="device-row" style="background:var(--bg-sunken);padding:10px 12px">
                  <div class="device-row__icon">${deviceIcon(type, 16)}</div>
                  <div class="device-row__main">
                    <div class="device-row__name">${e.friendly_name}</div>
                    <div class="device-row__meta"><span class="mono">${e.entity_id}</span> · ${e.area || ""}</div>
                  </div>
                  <input class="input" placeholder="${t("devices.alias.placeholder")}"
                    .value=${this._pickedAlias[e.entity_id] || ""}
                    @input=${(ev: InputEvent) => { this._pickedAlias = { ...this._pickedAlias, [e.entity_id]: (ev.target as HTMLInputElement).value }; }}
                    style="width:160px;font-size:12px"/>
                  <span class="chip chip--accent">${def.label}</span>
                  <button class="btn btn--sm btn--primary" @click=${async () => {
                    await this.card.doAddDevice(e.entity_id, this._pickedAlias[e.entity_id] || undefined);
                    this._pickedAlias = { ...this._pickedAlias, [e.entity_id]: "" };
                  }}>${icon("plus", 12)} ${t("devices.import")}</button>
                </div>
              `;
            })}
            ${!available.length ? html`<div style="text-align:center;padding:40px 20px;color:var(--text-muted)">
              <div style="font-weight:600;color:var(--text);font-size:14px">${t("devices.picker.all_imported")}</div>
              <div style="font-size:12.5px;margin-top:4px">${t("devices.picker.all_imported.hint")}</div>
            </div>` : nothing}
          </div>
        </div>
      </div>
    `;
  }
}
