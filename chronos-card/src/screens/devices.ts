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
  @state() private _confirmRemoveId = "";
  @state() private _bulkOpen = false;
  @state() private _bulkSelected = "";
  @state() private _busy = false;
  @state() private _lastError = "";
  @state() private _debugLog: string[] = [];

  private _log(msg: string) {
    const line = `${new Date().toLocaleTimeString()} · ${msg}`;
    console.log("[Chronos]", line);
    this._debugLog = [...this._debugLog.slice(-9), line];
  }

  private _askRemove(id: string) {
    this._log(`click TRASH id="${id}" (type=${typeof id})`);
    this._confirmRemoveId = id;
  }

  private async _doRemove(id: string) {
    this._log(`click CONFIRM id="${id}" busy=${this._busy}`);
    if (this._busy) {
      this._log("ABORT: busy=true");
      return;
    }
    this._busy = true;
    this._lastError = "";
    const beforeCount = this.card._devices.length;
    this._log(`devices BEFORE remove: ${beforeCount}`);

    try {
      this._log(`calling doRemoveDevice("${id}")…`);
      await this.card.doRemoveDevice(id);
      const afterCount = this.card._devices.length;
      this._log(`OK · devices AFTER: ${afterCount} (delta=${afterCount - beforeCount})`);
      if (afterCount === beforeCount) {
        this._log("WARN: device count NON cambiato → backend non ha rimosso");
      }
    } catch (e: any) {
      const msg = e?.message || String(e);
      this._lastError = msg;
      this._log(`ERROR: ${msg}`);
    } finally {
      this._busy = false;
      this._confirmRemoveId = "";
      this._bulkOpen = false;
      this._bulkSelected = "";
      this.requestUpdate();
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
          <div class="row" style="gap:8px">
            <button class="btn" title="Force refresh from backend"
              @click=${async () => {
                this._log("force REFRESH dal backend…");
                try {
                  await this.card._reloadAllDebug();
                  this._log(`refresh OK · devices=${this.card._devices.length}`);
                } catch (e: any) {
                  this._log(`refresh ERROR: ${e?.message || e}`);
                }
              }}>
              ${icon("repeat", 14)}
            </button>
            ${devices.length ? html`
              <button class="btn" @click=${() => { this._bulkOpen = true; this._bulkSelected = devices[0]?.id || ""; }}>
                ${icon("trash", 14)} ${t("devices.unlink")}…
              </button>
            ` : nothing}
            <button class="btn btn--primary" @click=${() => { this._pickerOpen = true; }}>
              ${icon("plus", 14)} ${t("devices.add_entity")}
            </button>
          </div>
        </div>

        ${this._lastError ? html`
          <div style="padding:10px 14px;background:#fef2f2;color:#991b1b;border-left:3px solid #ef4444;border-radius:6px;font-size:12.5px;font-family:ui-monospace,monospace">
            ${this._lastError}
          </div>
        ` : nothing}

        <div class="card">
          <div class="col" style="gap:0">
            ${devices.map((d) => {
              const def = DEVICE_TYPES[d.type] || { label: d.type, capabilities: [] };
              const state = this.card.hass?.states?.[d.entity_id];
              const stateStr = state?.state || "—";
              const color = getDeviceColor(d, state, this.card._settings);
              return html`
                <div class="device-row" style="border-bottom:1px solid var(--border-soft);border-radius:0;padding:14px 10px;align-items:center;position:relative">
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
                      <span style="color:var(--text-muted);opacity:0.6"> · id:${d.id}(${typeof d.id})</span>
                    </div>
                  </div>
                  <span class="chip chip--accent" style="flex:0 0 auto">${def.label}</span>
                  <span class="mono text-xs text-mute" style="flex:0 0 auto;min-width:60px;text-align:right">${stateStr}</span>
                  <button
                    type="button"
                    class="btn btn--sm"
                    style="flex:0 0 auto;background:#fee2e2;color:#991b1b;border:1px solid #fecaca;font-weight:600;z-index:5;position:relative"
                    @click=${(ev: MouseEvent) => { ev.preventDefault(); ev.stopPropagation(); this._askRemove(d.id); }}
                    title="${t("devices.unlink")}: ${d.alias}">
                    ${icon("trash", 12)} ${t("common.remove")}
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

        ${this._debugLog.length ? html`
          <details style="font-size:11px;font-family:ui-monospace,monospace;background:var(--bg-sunken);border-radius:8px;padding:8px 12px;color:var(--text-soft)">
            <summary style="cursor:pointer;font-weight:600">Debug log (${this._debugLog.length})</summary>
            <div style="margin-top:8px;display:flex;flex-direction:column;gap:2px">
              ${this._debugLog.map((l) => html`<div>${l}</div>`)}
            </div>
            <button class="btn btn--sm" style="margin-top:8px" @click=${() => { this._debugLog = []; }}>Clear log</button>
          </details>
        ` : nothing}

        ${this._pickerOpen ? this._renderPicker(available) : nothing}
        ${this._confirmRemoveId ? this._renderConfirm() : nothing}
        ${this._bulkOpen ? this._renderBulkRemove() : nothing}
      </div>
    `;
  }

  private _renderConfirm() {
    const dev = this.card._devices.find((d) => d.id === this._confirmRemoveId);
    if (!dev) return nothing;
    return html`
      <div class="modal-overlay" @click=${() => { this._confirmRemoveId = ""; }}>
        <div class="card" style="width:min(420px,100%);padding:22px" @click=${(e: Event) => e.stopPropagation()}>
          <h3 style="margin:0 0 8px">${t("devices.unlink")}?</h3>
          <p class="text-sm" style="margin:0 0 16px;color:var(--text-soft)">
            <strong>${dev.alias}</strong>
            <span class="mono text-xs" style="display:block;color:var(--text-muted);margin-top:4px">${dev.entity_id}</span>
          </p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${() => { this._confirmRemoveId = ""; }}>${t("common.cancel")}</button>
            <button class="btn btn--primary" style="background:#ef4444" ?disabled=${this._busy}
              @click=${() => this._doRemove(dev.id)}>
              ${icon("trash", 12)} ${this._busy ? "…" : t("common.confirm")}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderBulkRemove() {
    const devices = this.card._devices;
    const selected = devices.find((d) => d.id === this._bulkSelected);
    return html`
      <div class="modal-overlay" @click=${() => { this._bulkOpen = false; }}>
        <div class="card" style="width:min(520px,100%);padding:22px" @click=${(e: Event) => e.stopPropagation()}>
          <h3 style="margin:0 0 4px">${t("devices.unlink")}</h3>
          <p class="text-sm text-mute" style="margin:0 0 14px">
            ${t("devices.bulk_remove.hint") !== "devices.bulk_remove.hint"
              ? t("devices.bulk_remove.hint")
              : "Seleziona il dispositivo da scollegare. Verrà rimosso anche dalle schedulazioni che lo usano."}
          </p>
          <select class="select mono" style="margin-bottom:12px"
            @change=${(e: Event) => { this._bulkSelected = (e.target as HTMLSelectElement).value; }}>
            ${devices.map((d) => html`
              <option value="${d.id}" ?selected=${d.id === this._bulkSelected}>${d.alias} — ${d.entity_id}</option>
            `)}
          </select>
          ${selected ? html`
            <div class="card card--ghost" style="padding:12px;margin-bottom:14px">
              <div class="row" style="gap:10px;align-items:center">
                <div class="device-row__icon">${deviceIcon(selected.type, 16)}</div>
                <div>
                  <div class="fw-600">${selected.alias}</div>
                  <div class="text-xs text-mute mono">${selected.entity_id}</div>
                </div>
              </div>
            </div>
          ` : nothing}
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn" @click=${() => { this._bulkOpen = false; }}>${t("common.cancel")}</button>
            <button class="btn btn--primary" style="background:#ef4444"
              ?disabled=${this._busy || !this._bulkSelected}
              @click=${() => this._doRemove(this._bulkSelected)}>
              ${icon("trash", 12)} ${this._busy ? "…" : t("common.confirm")}
            </button>
          </div>
        </div>
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
