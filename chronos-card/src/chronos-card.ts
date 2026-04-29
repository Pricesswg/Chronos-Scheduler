import { LitElement, html, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles, chronosTokens } from "./styles";
import { icon } from "./icons";
import type {
  HomeAssistant,
  ChronosCardConfig,
  ChronosDevice,
  Schedule,
  Settings,
  Screen,
  ActionDef,
  WeatherAttribute,
} from "./types";
import { setActionsMap } from "./actions";
import {
  fetchDevices,
  fetchSchedules,
  fetchSettings,
  fetchActions,
  fetchWeatherAttributes,
  fetchForecast,
  fetchAvailableEntities,
  fetchWeatherEntities,
  fetchSensorEntities,
  saveSchedule as wsSaveSchedule,
  toggleSchedule as wsToggleSchedule,
  addDevice as wsAddDevice,
  updateDevice as wsUpdateDevice,
  removeDevice as wsRemoveDevice,
  removeSchedule as wsRemoveSchedule,
  updateSettings as wsUpdateSettings,
} from "./ws";
import { fmtHour, computeRepeat } from "./utils";

import "./screens/overview";
import "./screens/editor";
import "./screens/weather-rule";
import "./screens/device";
import "./screens/week";
import "./screens/live";
import "./screens/wizard";
import "./screens/devices";
import "./screens/settings";

const TITLES: Record<Screen, [string, string]> = {
  overview: ["Panoramica", "chronos / overview"],
  editor: ["Editor schedulazione", "chronos / schedule / edit"],
  weatherRule: ["Regola meteo", "chronos / schedule / weather"],
  device: ["Dispositivo", "chronos / device"],
  week: ["Vista settimanale", "chronos / week"],
  live: ["Stato live", "chronos / live"],
  wizard: ["Wizard", "chronos / wizard"],
  devices: ["Gestisci dispositivi", "chronos / devices"],
  settings: ["Impostazioni", "chronos / settings"],
};

@customElement("chronos-card")
export class ChronosCard extends LitElement {
  static styles = [chronosTokens, chronosStyles];

  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config!: ChronosCardConfig;

  @state() _screen: Screen = "overview";
  @state() _selectedId = "";
  @state() _deviceDetailId = "";
  @state() _schedules: Schedule[] = [];
  @state() _savedSchedules: Schedule[] = [];
  @state() _devices: ChronosDevice[] = [];
  @state() _settings: Settings | null = null;
  @state() _timelineVariant: "linear" | "radial" | "list" = "linear";
  @state() _pendingNav: Screen | null = null;
  @state() _loading = true;
  @state() _actionsMap: Record<string, ActionDef[]> = {};
  @state() _weatherAttributes: WeatherAttribute[] = [];
  @state() _forecast: any[] = [];
  @state() _availableEntities: any[] = [];
  @state() _weatherEntities: any[] = [];
  @state() _sensorEntities: any[] = [];
  @state() _mobile = false;
  @state() _drawerOpen = false;
  @state() _dark = false;

  private _resizeObserver?: ResizeObserver;

  setConfig(config: ChronosCardConfig) {
    this.config = config;
  }

  static getStubConfig() {
    return { type: "custom:chronos-card" };
  }

  connectedCallback() {
    super.connectedCallback();
    this._resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        this._mobile = entry.contentRect.width < 700;
      }
    });
    this._resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
  }

  async firstUpdated() {
    await this._loadAll();
  }

  updated(changed: PropertyValues) {
    if (changed.has("hass") && this.hass) {
      const dark = this.hass.themes?.darkMode ?? false;
      if (dark !== this._dark) {
        this._dark = dark;
      }
    }
    if (changed.has("_dark")) {
      if (this._dark) this.setAttribute("dark", "");
      else this.removeAttribute("dark");
    }
    if (changed.has("_settings") && this._settings?.density) {
      this.setAttribute("density", this._settings.density);
    }
  }

  private async _loadAll() {
    if (!this.hass) return;
    this._loading = true;
    try {
      const [devices, schedules, settings, actionsMap, weatherAttrs, forecast, available, weatherEnt, sensorEnt] =
        await Promise.all([
          fetchDevices(this.hass),
          fetchSchedules(this.hass),
          fetchSettings(this.hass),
          fetchActions(this.hass),
          fetchWeatherAttributes(this.hass),
          fetchForecast(this.hass),
          fetchAvailableEntities(this.hass),
          fetchWeatherEntities(this.hass),
          fetchSensorEntities(this.hass),
        ]);
      this._devices = devices;
      this._schedules = schedules;
      this._savedSchedules = JSON.parse(JSON.stringify(schedules));
      this._settings = settings;
      this._actionsMap = actionsMap;
      this._weatherAttributes = weatherAttrs;
      this._forecast = forecast;
      this._availableEntities = available;
      this._weatherEntities = weatherEnt;
      this._sensorEntities = sensorEnt;
      setActionsMap(actionsMap);
      if (settings?.default_timeline_variant) {
        this._timelineVariant = settings.default_timeline_variant;
      }
      if (schedules.length && !this._selectedId) {
        this._selectedId = schedules[0].id;
      }
      if (devices.length && !this._deviceDetailId) {
        this._deviceDetailId = devices[0].id;
      }
    } catch (e) {
      console.error("Chronos: failed to load data", e);
    }
    this._loading = false;
  }

  // --- Public API for screens ---

  navigate(screen: Screen) {
    const isDirty = JSON.stringify(this._schedules) !== JSON.stringify(this._savedSchedules);
    if (isDirty && this._screen === "editor" && screen !== "editor") {
      this._pendingNav = screen;
    } else {
      this._screen = screen;
    }
    this._drawerOpen = false;
  }

  selectSchedule(id: string, screen?: Screen) {
    this._selectedId = id;
    if (screen) this._screen = screen;
  }

  selectDevice(id: string) {
    this._deviceDetailId = id;
  }

  get isDirty(): boolean {
    return JSON.stringify(this._schedules) !== JSON.stringify(this._savedSchedules);
  }

  async saveCurrentSchedule() {
    const sched = this._schedules.find((s) => s.id === this._selectedId);
    if (!sched) return;
    const saved = await wsSaveSchedule(this.hass, sched);
    const idx = this._schedules.findIndex((s) => s.id === saved.id);
    if (idx >= 0) this._schedules = [...this._schedules.slice(0, idx), saved, ...this._schedules.slice(idx + 1)];
    this._savedSchedules = JSON.parse(JSON.stringify(this._schedules));
  }

  updateScheduleLocal(id: string, patch: Partial<Schedule>) {
    this._schedules = this._schedules.map((s) =>
      s.id === id ? { ...s, ...patch } : s
    );
  }

  updateBlocksLocal(id: string, blocks: any[]) {
    this._schedules = this._schedules.map((s) =>
      s.id === id ? { ...s, blocks: [...blocks].sort((a, b) => a.start - b.start) } : s
    );
  }

  async doToggleSchedule(id: string, enabled: boolean) {
    try {
      await wsToggleSchedule(this.hass, id, enabled);
      this._schedules = this._schedules.map((s) => (s.id === id ? { ...s, enabled } : s));
      this._savedSchedules = JSON.parse(JSON.stringify(this._schedules));
    } catch (e) {
      console.error("Chronos: toggleSchedule failed", e);
      await this._reloadAfterError();
    }
  }

  async doAddDevice(entity_id: string, alias?: string) {
    try {
      await wsAddDevice(this.hass, entity_id, alias);
    } catch (e) {
      console.error("Chronos: addDevice failed", e);
    }
    this._devices = await fetchDevices(this.hass);
    this._availableEntities = await fetchAvailableEntities(this.hass);
  }

  async doUpdateDevice(id: string, patch: any) {
    try {
      await wsUpdateDevice(this.hass, id, patch);
    } catch (e) {
      console.error("Chronos: updateDevice failed", e);
    }
    this._devices = await fetchDevices(this.hass);
  }

  async doRemoveDevice(id: string) {
    try {
      await wsRemoveDevice(this.hass, id);
    } catch (e) {
      console.error("Chronos: removeDevice failed", e);
    }
    this._devices = await fetchDevices(this.hass);
    this._schedules = await fetchSchedules(this.hass);
    this._savedSchedules = JSON.parse(JSON.stringify(this._schedules));
    this._availableEntities = await fetchAvailableEntities(this.hass);
  }

  async doRemoveSchedule(id: string) {
    try {
      await wsRemoveSchedule(this.hass, id);
    } catch (e) {
      console.error("Chronos: removeSchedule failed", e);
    }
    this._schedules = await fetchSchedules(this.hass);
    this._savedSchedules = JSON.parse(JSON.stringify(this._schedules));
    if (this._selectedId === id && this._schedules.length) {
      this._selectedId = this._schedules[0].id;
    } else if (!this._schedules.length) {
      this._selectedId = "";
    }
  }

  async doAddSchedule(schedule: Schedule) {
    try {
      const saved = await wsSaveSchedule(this.hass, schedule);
      this._schedules = await fetchSchedules(this.hass);
      this._savedSchedules = JSON.parse(JSON.stringify(this._schedules));
      this._selectedId = saved.id;
      this._screen = "editor";
    } catch (e) {
      console.error("Chronos: addSchedule failed", e);
    }
  }

  async doUpdateSettings(patch: Partial<Settings>) {
    try {
      const settings = await wsUpdateSettings(this.hass, patch);
      this._settings = settings;
    } catch (e) {
      console.error("Chronos: updateSettings failed", e);
      this._settings = await fetchSettings(this.hass);
    }
  }

  private async _reloadAfterError() {
    try {
      this._devices = await fetchDevices(this.hass);
      this._schedules = await fetchSchedules(this.hass);
      this._savedSchedules = JSON.parse(JSON.stringify(this._schedules));
      this._settings = await fetchSettings(this.hass);
    } catch {}
  }

  setTimelineVariant(v: "linear" | "radial" | "list") {
    this._timelineVariant = v;
  }

  // --- Render ---

  render() {
    if (this._loading) {
      return html`<div style="padding:40px;text-align:center;color:var(--text-muted)">Caricamento Chronos…</div>`;
    }

    const [title, crumbs] = TITLES[this._screen] || TITLES.overview;
    const now = new Date();
    const nowHour = now.getHours() + now.getMinutes() / 60;

    const drawerOpen = this._mobile && this._drawerOpen;
    const sidebarMode = !this._mobile ? "full" : drawerOpen ? "drawer" : "mini";

    return html`
      <div class="app" data-mobile="${this._mobile}" data-drawer="${drawerOpen}">
        ${this._renderSidebar(sidebarMode)}
        ${drawerOpen
          ? html`<div class="sidebar-backdrop" @click=${() => { this._drawerOpen = false; }}></div>`
          : nothing}
        <main class="content">
          ${this._renderTopbar(title, crumbs, nowHour)}
          <div class="content__inner">
            ${this._renderScreen(nowHour)}
          </div>
        </main>
        ${this._pendingNav ? this._renderDirtyModal() : nothing}
      </div>
    `;
  }

  private _renderSidebar(mode: "full" | "mini" | "drawer") {
    const nav = [
      { key: "overview" as Screen, label: "Panoramica", iconName: "dashboard" },
      { key: "editor" as Screen, label: "Editor", iconName: "clock" },
      { key: "week" as Screen, label: "Settimana", iconName: "calendar" },
      { key: "weatherRule" as Screen, label: "Regole meteo", iconName: "cloud" },
      { key: "device" as Screen, label: "Dispositivi", iconName: "device" },
      { key: "live" as Screen, label: "Stato live", iconName: "live" },
    ];
    const actions = [
      { key: "wizard" as Screen, label: "Nuova schedulazione", iconName: "wand" },
      { key: "devices" as Screen, label: "Gestisci dispositivi", iconName: "device" },
    ];

    const isMini = mode === "mini";
    const showHamburger = this._mobile;

    return html`
      <aside class="sidebar" data-mode="${mode}">
        ${showHamburger
          ? html`
              <button class="sidebar__hamburger" title="${isMini ? "Apri menu" : "Chiudi menu"}"
                @click=${() => { this._drawerOpen = !this._drawerOpen; }}>
                ${icon(isMini ? "menu" : "close", 18)}
              </button>
            `
          : nothing}
        <div class="sidebar__brand">
          <div class="sidebar__brand-mark">C</div>
          ${!isMini
            ? html`<div>
                <div class="sidebar__brand-name">Chronos</div>
                <div class="sidebar__brand-sub">v1.0 · HACS</div>
              </div>`
            : nothing}
        </div>
        ${!isMini ? html`<div class="nav-section">Principale</div>` : nothing}
        ${nav.map(
          (n) => html`
            <button class="nav-item" data-active="${this._screen === n.key}"
              title="${isMini ? n.label : ""}" @click=${() => this.navigate(n.key)}>
              ${icon(n.iconName, 16)} ${isMini ? nothing : html`<span>${n.label}</span>`}
            </button>
          `
        )}
        ${!isMini ? html`<div class="nav-section">Azioni</div>` : nothing}
        ${actions.map(
          (n) => html`
            <button class="nav-item" data-active="${this._screen === n.key}"
              title="${isMini ? n.label : ""}" @click=${() => this.navigate(n.key)}>
              ${icon(n.iconName, 16)} ${isMini ? nothing : html`<span>${n.label}</span>`}
            </button>
          `
        )}
        <div class="sidebar__footer">
          <button class="nav-item" data-active="${this._screen === "settings"}"
            title="${isMini ? "Impostazioni" : ""}" @click=${() => this.navigate("settings")}>
            ${icon("settings", 16)} ${isMini ? nothing : html`<span>Impostazioni</span>`}
          </button>
        </div>
      </aside>
    `;
  }

  private _renderTopbar(title: string, crumbs: string, nowHour: number) {
    return html`
      <div class="topbar">
        <div>
          <div class="topbar__title">${title}</div>
          <div class="topbar__crumbs">${crumbs}</div>
        </div>
        <div class="topbar__spacer"></div>
        <div class="topbar__time">
          <span class="time-dot"></span>
          <span>${fmtHour(nowHour)}</span>
        </div>
        <button class="btn btn--icon btn--ghost" @click=${() => { this._dark = !this._dark; }}>
          ${icon(this._dark ? "sun" : "moon", 16)}
        </button>
      </div>
    `;
  }

  private _renderScreen(nowHour: number) {
    switch (this._screen) {
      case "overview":
        return html`<chronos-overview .card=${this} .nowHour=${nowHour}></chronos-overview>`;
      case "editor":
        return html`<chronos-editor .card=${this} .nowHour=${nowHour}></chronos-editor>`;
      case "weatherRule":
        return html`<chronos-weather-rule .card=${this} .nowHour=${nowHour}></chronos-weather-rule>`;
      case "device":
        return html`<chronos-device-screen .card=${this} .nowHour=${nowHour}></chronos-device-screen>`;
      case "week":
        return html`<chronos-week .card=${this} .nowHour=${nowHour}></chronos-week>`;
      case "live":
        return html`<chronos-live .card=${this} .nowHour=${nowHour}></chronos-live>`;
      case "wizard":
        return html`<chronos-wizard .card=${this} .nowHour=${nowHour}></chronos-wizard>`;
      case "devices":
        return html`<chronos-devices-screen .card=${this} .nowHour=${nowHour}></chronos-devices-screen>`;
      case "settings":
        return html`<chronos-settings-screen .card=${this} .nowHour=${nowHour}></chronos-settings-screen>`;
      default:
        return html`<chronos-overview .card=${this} .nowHour=${nowHour}></chronos-overview>`;
    }
  }

  private _renderDirtyModal() {
    return html`
      <div class="modal-overlay">
        <div class="card" style="width:min(440px,100%)">
          <h3 style="margin:0 0 6px">Modifiche non salvate</h3>
          <p class="text-mute text-sm" style="margin:0 0 16px">Hai modifiche in sospeso su questa schedulazione. Vuoi davvero uscire e perderle?</p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn btn--ghost" @click=${() => { this._pendingNav = null; }}>Resta qui</button>
            <button class="btn" @click=${() => {
              this._schedules = JSON.parse(JSON.stringify(this._savedSchedules));
              this._screen = this._pendingNav!;
              this._pendingNav = null;
            }}>Scarta modifiche</button>
            <button class="btn btn--primary" @click=${async () => {
              await this.saveCurrentSchedule();
              this._screen = this._pendingNav!;
              this._pendingNav = null;
            }}>${icon("check", 14)} Salva ed esci</button>
          </div>
        </div>
      </div>
    `;
  }
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: "chronos-card",
  name: "Chronos Scheduler",
  description: "Advanced scheduler for Home Assistant with weather-based rules",
});
