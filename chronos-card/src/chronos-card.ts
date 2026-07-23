// Very first import: makes customElements.define idempotent for the
// chronos-* elements BEFORE the screen imports register them.
import "./define-guard";
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
  WeatherRule,
} from "./types";
import { setActionsMap, setColorSettings } from "./actions";
import { setLang, t } from "./i18n";
import { CARD_VERSION } from "./version";
import {
  fetchDevices,
  fetchSchedules,
  fetchRules,
  fetchSettings,
  fetchActions,
  fetchWeatherAttributes,
  fetchForecast,
  fetchAvailableEntities,
  fetchWeatherEntities,
  fetchSensorEntities,
  fetchSceneEntities,
  fetchAutomationEntities,
  saveSchedule as wsSaveSchedule,
  toggleSchedule as wsToggleSchedule,
  addDevice as wsAddDevice,
  updateDevice as wsUpdateDevice,
  removeDevice as wsRemoveDevice,
  removeSchedule as wsRemoveSchedule,
  saveRule as wsSaveRule,
  removeRule as wsRemoveRule,
  reorderRules as wsReorderRules,
  updateSettings as wsUpdateSettings,
} from "./ws";
import { fmtHour, computeRepeat, setSnapMinutes, setHassRef } from "./utils";

import "./screens/overview";
import "./screens/editor";
import "./screens/weather-rule";
import "./screens/weather-rules-list";
import "./screens/device";
import "./screens/week";
import "./screens/live";
import "./screens/wizard";
import "./screens/devices";
import "./screens/settings";
import "./screens/help";
import "./screens/history";
import "./screens/card-editor";
import "./duplicate-modal";

const TITLE_KEYS: Record<Screen, [string, string]> = {
  overview: ["screen.overview.title", "chronos / overview"],
  editor: ["screen.editor.title", "chronos / schedule / edit"],
  weatherRule: ["screen.weather_rule.title", "chronos / schedule / weather"],
  weatherRulesList: ["nav.weather_rules", "chronos / weather"],
  device: ["screen.device.title", "chronos / device"],
  week: ["screen.week.title", "chronos / week"],
  live: ["screen.live.title", "chronos / live"],
  wizard: ["screen.wizard.title", "chronos / wizard"],
  devices: ["screen.devices.title", "chronos / devices"],
  settings: ["screen.settings.title", "chronos / settings"],
  help: ["nav.help", "chronos / help"],
  history: ["screen.history.title", "chronos / history"],
};

@customElement("chronos-card")
export class ChronosCard extends LitElement {
  static styles = [chronosTokens, chronosStyles];

  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ attribute: false }) config!: ChronosCardConfig;

  @state() _screen: Screen = "overview";
  /** Embed mode: render only `config.view` with no sidebar/top bar. */
  @state() _embed = false;
  @state() _selectedId = "";
  @state() _deviceDetailId = "";
  @state() _schedules: Schedule[] = [];
  @state() _savedSchedules: Schedule[] = [];
  @state() _rules: WeatherRule[] = [];
  @state() _devices: ChronosDevice[] = [];
  @state() _settings: Settings | null = null;
  @state() _pendingNav: Screen | null = null;
  @state() _loading = true;
  @state() _loadError: string | null = null;
  @state() _actionsMap: Record<string, ActionDef[]> = {};
  @state() _weatherAttributes: WeatherAttribute[] = [];
  @state() _forecast: any[] = [];
  @state() _availableEntities: any[] = [];
  @state() _weatherEntities: any[] = [];
  @state() _sensorEntities: any[] = [];
  @state() _sceneEntities: any[] = [];
  @state() _automationEntities: any[] = [];
  @state() _mobile = false;
  @state() _drawerOpen = false;
  @state() _desktopCollapsed = false;
  /** When set, the rule builder edits this global rule instead of creating
   * a new one. Reset to "" when leaving the builder. */
  @state() _editingRuleId = "";
  /** Schedule id whose duplicate modal is open. "" = closed. */
  @state() _duplicateSourceId = "";

  private _resizeObserver?: ResizeObserver;

  setConfig(config: ChronosCardConfig) {
    this.config = config || ({} as ChronosCardConfig);
    // Embed mode: pin the card to a single screen with no chrome. `view`
    // wins over `default_screen` and locks the screen for the session.
    if (config?.view) {
      this._embed = true;
      if (!this._screenInitialised) {
        this._screen = config.view;
        this._screenInitialised = true;
      }
    } else {
      this._embed = false;
    }
    if (config?.default_screen && !config?.view && !this._screenInitialised) {
      this._screen = config.default_screen;
      this._screenInitialised = true;
    }
    if (config?.collapse_sidebar !== undefined) {
      this._desktopCollapsed = !!config.collapse_sidebar;
    }
    // Re-evaluate panel-mode whenever the config changes: panel_mode and
    // panel_offset are config-driven and might have just been edited via
    // the GUI editor.
    if (this.isConnected) this._checkPanelMode();
  }

  static getStubConfig() {
    return { type: "custom:chronos-card" };
  }

  /** Returns the GUI editor element for the Lovelace dashboard's "Edit card"
   * dialog. Without this, HA falls back to YAML-only editing. */
  static getConfigElement(): HTMLElement {
    return document.createElement("chronos-card-editor");
  }

  /** True after we've applied `default_screen` from config — prevents config
   * reloads (e.g. via the visual editor) from yanking the user back to the
   * default screen mid-session. */
  private _screenInitialised = false;

  private _windowResizeBound = () => this._checkPanelMode();

  /** Detect whether the card is being rendered in a Lovelace "panel" view
   * (where HA gives the card the full viewport height and overlays its app
   * bar on top of it instead of pushing the content down). In that mode our
   * sidebar and topbar would otherwise sit at y=0 of the viewport, behind
   * the HA app bar. We toggle a panel-mode attribute on :host so the CSS
   * can compensate with the appropriate top padding.
   *
   * Heuristic: in normal dashboard the card is below the app bar at roughly
   * y=56px or more; in panel mode the card's top is at viewport y=0 (or
   * negative when scrolled). 30px is a generous threshold that distinguishes
   * the two cases and tolerates HA themes that adjust the bar height.
   *
   * Honours the `panel_mode` config option (auto / true / false) to let
   * users force or disable the offset when the heuristic fails (kiosk
   * setups, themes that hide the HA bar, custom panel layouts). */
  private _checkPanelMode() {
    if (!this.isConnected) return;
    const cfg = this.config?.panel_mode;
    let isPanel: boolean;
    if (cfg === true) {
      isPanel = true;
    } else if (cfg === false) {
      isPanel = false;
    } else {
      // "auto" or unset: use bounding rect detection. Use ownerDocument's
      // documentElement scroll position to compare against viewport, since
      // getBoundingClientRect is already viewport-relative.
      const rect = this.getBoundingClientRect();
      isPanel = rect.top < 30 && rect.height > 200;
    }
    if (this.hasAttribute("panel-mode") !== isPanel) {
      this.toggleAttribute("panel-mode", isPanel);
    }
    // Apply explicit pixel offset from config if provided, otherwise leave
    // it to the CSS fallback (var(--header-height, 56px)).
    const offset = this.config?.panel_offset;
    if (typeof offset === "number" && offset >= 0) {
      this.style.setProperty("--chronos-panel-offset", `${offset}px`);
    } else {
      this.style.removeProperty("--chronos-panel-offset");
    }
  }

  connectedCallback() {
    super.connectedCallback();
    // Apply hass.language as soon as we're connected, so the very first
    // render goes out in the right language. Without this the first paint
    // is always Italian (the i18n default) and the user sees a flash of
    // Italian text before the post-_loadAll re-render swaps it for the
    // settings-driven language.
    if (this.hass) this._applyLanguage();
    this._checkPanelMode();
    // Defer one more check so HA's panel layout has time to settle. The
    // first connectedCallback tick can fire before the parent <hui-view>
    // has been positioned, returning a misleading rect.top.
    setTimeout(() => this._checkPanelMode(), 50);
    setTimeout(() => this._checkPanelMode(), 250);
    window.addEventListener("resize", this._windowResizeBound, { passive: true });
    this._resizeObserver = new ResizeObserver((entries) => {
      this._checkPanelMode();
      for (const entry of entries) {
        const threshold = this.config?.mobile_threshold;
        const t = typeof threshold === "number" ? threshold : 700;
        this._mobile = t > 0 && entry.contentRect.width < t;
      }
    });
    this._resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
    window.removeEventListener("resize", this._windowResizeBound);
    if (this._retryTimer) {
      clearTimeout(this._retryTimer);
      this._retryTimer = null;
    }
  }

  async firstUpdated() {
    // Re-run the panel-mode check now that Lit has rendered the shadow DOM
    // and HA has positioned us. ResizeObserver fires reliably afterwards.
    this._checkPanelMode();
    await this._loadAll();
  }

  updated(changed: PropertyValues) {
    if (changed.has("hass") && this.hass) {
      setHassRef(this.hass);
      // Apply language whenever hass arrives or its language attribute
      // changes. Previously this only ran on _settings change, which meant
      // a card whose settings WS hadn't loaded yet (or returned empty)
      // stayed in the default Italian even when HA was set to English
      // (issue #3).
      this._applyLanguage();
    }
    if (changed.has("_settings") && this._settings) {
      if (this._settings.density) this.setAttribute("density", this._settings.density);
      this._applyLanguage();
    }
    if (changed.has("_screen")) {
      // Top navigation: navigations that don't come from the bar itself
      // (open schedule from a list, wizard hand-off) must still bring the
      // active entry into the scrollable row's view.
      this.renderRoot
        .querySelector('.nav-ic[data-active="true"]')
        ?.scrollIntoView({ inline: "nearest", block: "nearest" });
    }
  }

  private _applyLanguage() {
    const lang = (this._settings as any)?.language;
    const target = !lang || lang === "auto" ? this.hass?.language : lang;
    const newLang = setLang(target);
    if (this._appliedLang !== newLang) {
      this._appliedLang = newLang;
      this.requestUpdate();
    }
  }
  private _appliedLang: string = "";

  /** Automatic retry of failed loads. Typical case: HA restarts with the
   * companion app open — the frontend reconnects before the integration
   * has registered its WS commands, every call answers "Unknown command"
   * and without a retry the error banner stays until the user reloads
   * manually (reports mentioned "clearing the cache", which only worked
   * because it forced a reload). Growing backoff, then give up. */
  private _retryCount = 0;
  private _retryTimer: ReturnType<typeof setTimeout> | null = null;
  private static readonly _RETRY_DELAYS_MS = [2000, 5000, 10000, 20000];

  private async _loadAll() {
    if (!this.hass) return;
    if (this._retryTimer) {
      clearTimeout(this._retryTimer);
      this._retryTimer = null;
    }
    this._loading = true;
    this._loadError = null;
    // Load every resource independently: one failing WS doesn't block the others.
    const safe = async <T>(fn: () => Promise<T>, fallback: T, name: string): Promise<T> => {
      try {
        return await fn();
      } catch (e: any) {
        console.error(`Chronos: ${name} failed`, e);
        const msg = e?.message || String(e);
        this._loadError = (this._loadError ? this._loadError + " · " : "") + `${name}: ${msg}`;
        return fallback;
      }
    };

    try {
      const [devices, schedules, rules, settings, actionsMap, weatherAttrs, forecast, available, weatherEnt, sensorEnt, sceneEnt, automationEnt] =
        await Promise.all([
          safe(() => fetchDevices(this.hass), [], "devices/list"),
          safe(() => fetchSchedules(this.hass), [], "schedules/list"),
          safe(() => fetchRules(this.hass), [], "rules/list"),
          safe(() => fetchSettings(this.hass), null as any, "settings/get"),
          safe(() => fetchActions(this.hass), {}, "actions"),
          safe(() => fetchWeatherAttributes(this.hass), [], "weather/attributes"),
          safe(() => fetchForecast(this.hass), [], "preview/forecast"),
          safe(() => fetchAvailableEntities(this.hass), [], "entities/available"),
          safe(() => fetchWeatherEntities(this.hass), [], "weather/entities"),
          safe(() => fetchSensorEntities(this.hass), [], "sensor/entities"),
          safe(() => fetchSceneEntities(this.hass), [], "scene/entities"),
          safe(() => fetchAutomationEntities(this.hass), [], "automation/entities"),
        ]);
      this._devices = devices;
      this._schedules = schedules;
      this._rules = rules;
      this._savedSchedules = JSON.parse(JSON.stringify(schedules));
      this._settings = settings;
      this._actionsMap = actionsMap;
      this._weatherAttributes = weatherAttrs;
      this._forecast = forecast;
      this._availableEntities = available;
      this._weatherEntities = weatherEnt;
      this._sensorEntities = sensorEnt;
      this._sceneEntities = sceneEnt;
      this._automationEntities = automationEnt;
      setActionsMap(actionsMap);
      setColorSettings(settings);
      if (settings?.snap_minutes) setSnapMinutes(settings.snap_minutes);
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
    if (this._loadError && this._retryCount < ChronosCard._RETRY_DELAYS_MS.length) {
      const delay = ChronosCard._RETRY_DELAYS_MS[this._retryCount++];
      console.info(`Chronos: load failed, retrying in ${delay / 1000}s (attempt ${this._retryCount})`);
      this._retryTimer = setTimeout(() => {
        this._retryTimer = null;
        this._loadAll();
      }, delay);
    } else if (!this._loadError) {
      this._retryCount = 0;
    }
  }

  // --- Public API for screens ---

  navigate(screen: Screen) {
    const isDirty = JSON.stringify(this._schedules) !== JSON.stringify(this._savedSchedules);
    if (isDirty && this._screen === "editor" && screen !== "editor") {
      this._pendingNav = screen;
    } else {
      this._screen = screen;
    }
    // Reset edit state when leaving the rule builder
    if (this._screen !== "weatherRule") {
      this._editingRuleId = "";
    }
    this._drawerOpen = false;
  }

  /** Open the rule builder pre-filled with an existing global rule.
   * scheduleId (optional) selects which schedule provides editing context
   * (e.g. clicked from that schedule's editor). */
  editWeatherRule(ruleId: string, scheduleId?: string) {
    if (scheduleId) this._selectedId = scheduleId;
    this._editingRuleId = ruleId;
    this._screen = "weatherRule";
  }

  // --- Weather rules (global store) ---

  /** Global rules projected onto one schedule: one entry per (rule, target)
   * pair with the target's block_index inlined, in the legacy shape the
   * screens already understand. */
  rulesForSchedule(scheduleId: string): WeatherRule[] {
    const out: WeatherRule[] = [];
    for (const r of this._rules) {
      for (const tgt of r.targets || []) {
        if (tgt.schedule_id === scheduleId) {
          out.push({ ...r, block_index: tgt.block_index ?? null });
        }
      }
    }
    return out;
  }

  async doSaveRule(rule: WeatherRule): Promise<WeatherRule | null> {
    try {
      const saved = await wsSaveRule(this.hass, rule);
      this._rules = await fetchRules(this.hass);
      return saved;
    } catch (e) {
      console.error("Chronos: saveRule failed", e);
      return null;
    }
  }

  async doRemoveRule(ruleId: string) {
    try {
      await wsRemoveRule(this.hass, ruleId);
    } catch (e) {
      console.error("Chronos: removeRule failed", e);
    }
    this._rules = await fetchRules(this.hass);
  }

  /** Persist a new manual order for the global rules list. Optimistically
   * applies `orderedIds` locally, then confirms with the backend. */
  async reorderRules(orderedIds: string[]) {
    const byId = new Map(this._rules.map((r) => [r.id, r]));
    const reordered = orderedIds.map((id) => byId.get(id)).filter(Boolean) as WeatherRule[];
    // Keep any rule not in the list (defensive) at the end.
    for (const r of this._rules) if (!orderedIds.includes(r.id!)) reordered.push(r);
    this._rules = reordered;
    try {
      this._rules = await wsReorderRules(this.hass, orderedIds);
    } catch (e) {
      console.error("Chronos: reorderRules failed", e);
      this._rules = await fetchRules(this.hass);
    }
  }

  /** Toggle a rule's active flag. Global: affects every target schedule. */
  async toggleRuleActive(ruleId: string, active: boolean) {
    const rule = this._rules.find((r) => r.id === ruleId);
    if (!rule) return;
    await this.doSaveRule({ ...rule, active });
  }

  /** Detach one schedule from a rule. Deletes the rule entirely when that
   * schedule was its last target. */
  async unlinkRuleFromSchedule(ruleId: string, scheduleId: string) {
    const rule = this._rules.find((r) => r.id === ruleId);
    if (!rule) return;
    const targets = (rule.targets || []).filter((t) => t.schedule_id !== scheduleId);
    if (!targets.length) await this.doRemoveRule(ruleId);
    else await this.doSaveRule({ ...rule, targets });
  }

  /** Open the duplicate-schedule modal. Saves pending editor changes first
   * so the copy reflects what the user sees and doAddSchedule's refetch
   * can't clobber unsaved edits on the source. */
  async openDuplicateModal(scheduleId: string) {
    if (this.isDirty) await this.saveCurrentSchedule();
    this._duplicateSourceId = scheduleId;
  }

  closeDuplicateModal() {
    this._duplicateSourceId = "";
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
    await this.saveScheduleById(this._selectedId);
  }

  /** Persist one schedule by id without touching the global selection.
   * Used by screens that edit schedules other than the selected one
   * (e.g. the cross-schedule weather rules list). */
  async saveScheduleById(id: string) {
    const sched = this._schedules.find((s) => s.id === id);
    if (!sched) return;
    // Sequential-irrigation valve-conflict guard. Warn always; hard-block
    // the save only when the user opted in (Settings → Irrigation).
    const conflict = this._findIrrigationConflict(sched);
    if (conflict) {
      const blockEnabled = !!(this._settings as any)?.irrigation_conflict_block;
      if (blockEnabled) {
        alert(t("editor.irrigation.conflict.blocked"));
        return;
      }
      const proceed = confirm(
        t("editor.irrigation.conflict.warn", { valve: conflict }) + "\n\n" + t("common.confirm") + "?"
      );
      if (!proceed) return;
    }
    const saved = await wsSaveSchedule(this.hass, sched);
    const idx = this._schedules.findIndex((s) => s.id === saved.id);
    if (idx >= 0) this._schedules = [...this._schedules.slice(0, idx), saved, ...this._schedules.slice(idx + 1)];
    this._savedSchedules = JSON.parse(JSON.stringify(this._schedules));
  }

  /** Returns the entity_id of the first valve shared between this
   * schedule's sequential irrigation blocks and another schedule whose
   * day mask overlaps and which also runs a sequential program on the
   * same valve. null when no conflict. Heuristic on day overlap only:
   * exact time-window math is unnecessary because two sequential
   * programs that can run on the same day on the same valve are already
   * a hazard worth flagging. */
  private _findIrrigationConflict(sched: Schedule): string | null {
    if (sched.device_type !== "irrigation") return null;
    const myValves = new Set<string>();
    for (const b of sched.blocks || []) {
      if (b.action?.mode === "sequential") {
        for (const s of b.action.sequence || []) myValves.add(s.entity_id);
      }
    }
    if (!myValves.size) return null;
    const dayOverlap = (a: number[], b: number[]) =>
      a.some((v, i) => v && b[i]);
    for (const other of this._schedules) {
      if (other.id === sched.id || other.device_type !== "irrigation") continue;
      if (!other.enabled || !sched.enabled) continue;
      if (!dayOverlap(sched.days || [], other.days || [])) continue;
      for (const b of other.blocks || []) {
        if (b.action?.mode !== "sequential") continue;
        for (const s of b.action.sequence || []) {
          if (myValves.has(s.entity_id)) return s.entity_id;
        }
      }
    }
    return null;
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
      console.error("Chronos: removeDevice WS failed", e);
      throw e;
    }
    try { this._devices = await fetchDevices(this.hass); } catch (e) { console.error("Chronos: fetchDevices after remove failed", e); }
    try { this._schedules = await fetchSchedules(this.hass); this._savedSchedules = JSON.parse(JSON.stringify(this._schedules)); } catch (e) { console.error("Chronos: fetchSchedules after remove failed", e); }
    try { this._availableEntities = await fetchAvailableEntities(this.hass); } catch (e) { console.error("Chronos: fetchAvailableEntities after remove failed", e); }
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

  /** Create a scene-type schedule with no devices and a single default block.
   * The user picks the scene per block on the editor. */
  async createSceneSchedule() {
    const schedule: Schedule = {
      id: "",
      name: t("overview.new_scene_default_name"),
      device_type: "scene",
      device_ids: [],
      days: [1, 1, 1, 1, 1, 1, 1],
      enabled: true,
      blocks: [{ start: 8, end: 9, action: { id: "activate" } }],
    };
    await this.doAddSchedule(schedule);
  }

  /** Same as createSceneSchedule but for automations: turn on/off or trigger
   * one or more HA automations per time block. */
  async createAutomationSchedule() {
    const schedule: Schedule = {
      id: "",
      name: t("overview.new_automation_default_name"),
      device_type: "automation",
      device_ids: [],
      days: [1, 1, 1, 1, 1, 1, 1],
      enabled: true,
      blocks: [{ start: 8, end: 9, action: { id: "turn_on" } }],
    };
    await this.doAddSchedule(schedule);
  }

  /** Service-call schedule: each block invokes a freeform HA service with
   * an optional JSON service_data payload. Useful for mqtt.publish, backup
   * snapshots, script execution and any debug-style invocations. */
  async createServiceSchedule() {
    const schedule: Schedule = {
      id: "",
      name: t("overview.new_service_default_name"),
      device_type: "service",
      device_ids: [],
      days: [1, 1, 1, 1, 1, 1, 1],
      enabled: true,
      blocks: [{ start: 8, end: 9, action: { id: "call_service", value: "" } }],
    };
    await this.doAddSchedule(schedule);
  }

  /** Create a schedule and navigate to its editor. Returns the saved
   * schedule (with its backend-assigned id) so callers can attach global
   * rules to it, or null on failure. */
  async doAddSchedule(schedule: Schedule): Promise<Schedule | null> {
    try {
      const saved = await wsSaveSchedule(this.hass, schedule);
      this._schedules = await fetchSchedules(this.hass);
      this._savedSchedules = JSON.parse(JSON.stringify(this._schedules));
      this._selectedId = saved.id;
      this._screen = "editor";
      return saved;
    } catch (e) {
      console.error("Chronos: addSchedule failed", e);
      return null;
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
    setColorSettings(this._settings);
    if (this._settings?.snap_minutes) setSnapMinutes(this._settings.snap_minutes);
  }

  /** Force a full re-fetch of every backend resource. Exposed for the
   * manual refresh button on the devices screen. */
  async reloadAll() {
    await this._loadAll();
  }


  private async _reloadAfterError() {
    try {
      this._devices = await fetchDevices(this.hass);
      this._schedules = await fetchSchedules(this.hass);
      this._savedSchedules = JSON.parse(JSON.stringify(this._schedules));
      this._settings = await fetchSettings(this.hass);
    } catch {}
  }

  /** Per-schedule timeline view preference (issue #13). Deliberately outside
   * the dirty/save flow: flipping the view while the schedule has pending
   * block edits must neither trigger the "unsaved changes" prompt nor commit
   * those edits as a side effect. So we persist the pristine server copy plus
   * the new variant, and mirror the field into the working copy. */
  async setTimelineVariant(scheduleId: string, v: "linear" | "radial" | "list") {
    this._schedules = this._schedules.map((s) =>
      s.id === scheduleId ? { ...s, timeline_variant: v } : s
    );
    const saved = this._savedSchedules.find((s) => s.id === scheduleId);
    if (!saved) return;
    saved.timeline_variant = v;
    try {
      await wsSaveSchedule(this.hass, saved);
    } catch (e) {
      console.error("Chronos: failed to persist timeline variant", e);
    }
  }

  // --- Render ---

  render() {
    if (this._loading) {
      return html`<div style="padding:40px;text-align:center;color:var(--text-muted)">${t("common.loading")}</div>`;
    }

    const errorBanner = this._loadError
      ? html`<div style="margin:10px;padding:10px 14px;background:#fef2f2;color:#991b1b;border-left:3px solid #ef4444;border-radius:4px;font-size:12.5px;font-family:ui-monospace,monospace">
          Chronos load errors: ${this._loadError}
          ${this._retryTimer ? html`<div style="margin-top:6px;font-weight:600">${t("load.retry.hint")}</div>` : nothing}
        </div>`
      : nothing;

    const [titleKey, crumbs] = TITLE_KEYS[this._screen] || TITLE_KEYS.overview;
    const title = t(titleKey);
    const now = new Date();
    const nowHour = now.getHours() + now.getMinutes() / 60;

    const drawerOpen = this._mobile && this._drawerOpen;
    let sidebarMode: "full" | "mini" | "drawer";
    if (this._mobile) {
      sidebarMode = drawerOpen ? "drawer" : "mini";
    } else {
      sidebarMode = this._desktopCollapsed ? "mini" : "full";
    }

    const userTitle = this.config?.title;
    const topNav = (this._settings?.nav_style ?? "top") !== "sidebar";

    // Embed mode: a single screen, no sidebar and no top bar, so Chronos
    // becomes a compact dashboard card. Data loading is unchanged; only the
    // chrome is stripped.
    if (this._embed) {
      return html`
        ${errorBanner}
        ${userTitle ? html`<div class="card-header" style="padding:14px 18px 6px;font-size:18px;font-weight:600;letter-spacing:-0.01em">${userTitle}</div>` : nothing}
        <div class="app app--embed">
          <main class="content">
            <div class="content__inner content__inner--embed">
              ${this._renderScreen(nowHour)}
            </div>
          </main>
          ${this._pendingNav ? this._renderDirtyModal() : nothing}
          ${this._duplicateSourceId
            ? html`<chronos-duplicate-modal .card=${this} .sourceId=${this._duplicateSourceId}></chronos-duplicate-modal>`
            : nothing}
        </div>
      `;
    }

    return html`
      ${errorBanner}
      ${userTitle ? html`<div class="card-header" style="padding:14px 18px 6px;font-size:18px;font-weight:600;letter-spacing:-0.01em">${userTitle}</div>` : nothing}
      <div class="app ${topNav ? "app--topnav" : ""}" data-mobile="${this._mobile}" data-drawer="${!topNav && drawerOpen}">
        ${topNav ? nothing : this._renderSidebar(sidebarMode)}
        ${!topNav && drawerOpen
          ? html`<div class="sidebar-backdrop" @click=${() => { this._drawerOpen = false; }}></div>`
          : nothing}
        <main class="content">
          ${topNav ? this._renderTopnav(nowHour) : this._renderTopbar(title, crumbs, nowHour)}
          <div class="content__inner">
            ${this._renderScreen(nowHour)}
          </div>
        </main>
        ${this._pendingNav ? this._renderDirtyModal() : nothing}
        ${this._duplicateSourceId
          ? html`<chronos-duplicate-modal .card=${this} .sourceId=${this._duplicateSourceId}></chronos-duplicate-modal>`
          : nothing}
      </div>
    `;
  }

  /** Navigation entries shared by the sidebar and the top bar. Split kept
   * as main screens vs actions so both layouts can render a separator. */
  private _navEntries() {
    const nav = [
      { key: "overview" as Screen, label: t("nav.overview"), iconName: "dashboard" },
      { key: "editor" as Screen, label: t("nav.editor"), iconName: "clock" },
      { key: "week" as Screen, label: t("nav.week"), iconName: "calendar" },
      { key: "weatherRulesList" as Screen, label: t("nav.weather_rules"), iconName: "cloud" },
      { key: "device" as Screen, label: t("nav.devices"), iconName: "device" },
      { key: "live" as Screen, label: t("nav.live"), iconName: "live" },
      { key: "history" as Screen, label: t("nav.history"), iconName: "history" },
    ];
    const actions = [
      { key: "wizard" as Screen, label: t("nav.new_schedule"), iconName: "wand" },
      { key: "devices" as Screen, label: t("nav.manage_devices"), iconName: "device" },
      { key: "help" as Screen, label: t("nav.help"), iconName: "info" },
    ];
    return { nav, actions };
  }

  private _renderSidebar(mode: "full" | "mini" | "drawer") {
    const { nav, actions } = this._navEntries();

    const isMini = mode === "mini";
    const showHamburger = true;  // always visible: mobile toggles drawer, desktop collapses sidebar

    return html`
      <aside class="sidebar" data-mode="${mode}">
        ${showHamburger
          ? html`
              <button class="sidebar__hamburger" title="${isMini ? t("nav.menu_open") : t("nav.menu_close")}"
                @click=${() => {
                  if (this._mobile) this._drawerOpen = !this._drawerOpen;
                  else this._desktopCollapsed = !this._desktopCollapsed;
                }}>
                ${icon(isMini ? "menu" : "close", 18)}
              </button>
            `
          : nothing}
        <div class="sidebar__brand">
          <div class="sidebar__brand-mark" style="background:transparent;box-shadow:none;padding:0;overflow:hidden">
            <img src="/local/chronos-icon.png?v=${CARD_VERSION}" alt="Chronos"
              style="width:100%;height:100%;object-fit:contain;display:block"
              @error=${(e: Event) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLElement).parentElement!.textContent = "C"; (e.target as HTMLElement).parentElement!.style.background = "linear-gradient(135deg, var(--accent), var(--weather))"; (e.target as HTMLElement).parentElement!.style.color = "white"; }}/>
          </div>
          ${!isMini
            ? html`<div>
                <div class="sidebar__brand-name">Chronos</div>
                <div class="sidebar__brand-sub">v${CARD_VERSION} · HACS</div>
              </div>`
            : nothing}
        </div>
        ${!isMini ? html`<div class="nav-section">${t("nav.section.main")}</div>` : nothing}
        ${nav.map(
          (n) => html`
            <button class="nav-item" data-active="${this._screen === n.key}"
              title="${isMini ? n.label : ""}" @click=${() => this.navigate(n.key)}>
              ${icon(n.iconName, 16)} ${isMini ? nothing : html`<span>${n.label}</span>`}
            </button>
          `
        )}
        ${!isMini ? html`<div class="nav-section">${t("nav.section.actions")}</div>` : nothing}
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
            title="${isMini ? t("nav.settings") : ""}" @click=${() => this.navigate("settings")}>
            ${icon("settings", 16)} ${isMini ? nothing : html`<span>${t("nav.settings")}</span>`}
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
      </div>
    `;
  }

  /** Top navigation (nav_style "top"): one bar with brand, clock and the
   * icon-only entry row. The active entry expands with its label. */
  private _renderTopnav(nowHour: number) {
    const { nav, actions } = this._navEntries();
    const item = (n: { key: Screen; label: string; iconName: string }, accent = false) => html`
      <button class="nav-ic ${accent ? "nav-ic--accent" : ""}"
        data-active="${this._screen === n.key}" title="${n.label}"
        @click=${(e: Event) => {
          this.navigate(n.key);
          (e.currentTarget as HTMLElement).scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
        }}>
        ${icon(n.iconName, 17)}<span class="nav-ic__lbl">${n.label}</span>
      </button>
    `;
    return html`
      <nav class="topnav">
        <div class="topnav__brand">
          <span class="topnav__logo">
            <img src="/local/chronos-icon.png?v=${CARD_VERSION}" alt=""
              style="width:100%;height:100%;object-fit:contain;display:block"
              @error=${(e: Event) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLElement).parentElement!.textContent = "C"; }}/>
          </span>
          <span class="topnav__name">Chronos</span>
          <span class="topnav__clock"><span class="time-dot"></span>${fmtHour(nowHour)}</span>
        </div>
        <div class="nav-scroll">
          ${nav.map((n) => item(n))}
          <span class="nav-sep"></span>
          ${item(actions[0], true)}
          ${actions.slice(1).map((n) => item(n))}
          <span class="nav-sep"></span>
          ${item({ key: "settings" as Screen, label: t("nav.settings"), iconName: "settings" })}
        </div>
      </nav>
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
      case "weatherRulesList":
        return html`<chronos-weather-rules-list .card=${this} .nowHour=${nowHour}></chronos-weather-rules-list>`;
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
      case "help":
        return html`<chronos-help-screen .card=${this} .nowHour=${nowHour}></chronos-help-screen>`;
      case "history":
        return html`<chronos-history-screen .card=${this} .nowHour=${nowHour}></chronos-history-screen>`;
      default:
        return html`<chronos-overview .card=${this} .nowHour=${nowHour}></chronos-overview>`;
    }
  }

  private _renderDirtyModal() {
    return html`
      <div class="modal-overlay">
        <div class="card" style="width:min(440px,100%)">
          <h3 style="margin:0 0 6px">${t("modal.unsaved.title")}</h3>
          <p class="text-mute text-sm" style="margin:0 0 16px">${t("modal.unsaved.body")}</p>
          <div class="row" style="justify-content:flex-end;gap:8px">
            <button class="btn btn--ghost" @click=${() => { this._pendingNav = null; }}>${t("modal.unsaved.stay")}</button>
            <button class="btn" @click=${() => {
              this._schedules = JSON.parse(JSON.stringify(this._savedSchedules));
              this._screen = this._pendingNav!;
              this._pendingNav = null;
            }}>${t("modal.unsaved.discard")}</button>
            <button class="btn btn--primary" @click=${async () => {
              await this.saveCurrentSchedule();
              this._screen = this._pendingNav!;
              this._pendingNav = null;
            }}>${icon("check", 14)} ${t("modal.unsaved.save")}</button>
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
  preview: false,
  documentationURL: "https://github.com/Pricesswg/Chronos-Scheduler",
});

// Diagnostic banner: a single console line on bundle load so users debugging
// "Custom element not found: chronos-card" (issue #6, typically WebView /
// embedded-browser timing edge cases) can confirm the bundle actually
// reached the page and the element registered. Visible in DevTools console.
// Style is kept innocuous so it doesn't pollute normal logs.
try {
  // eslint-disable-next-line no-console
  console.info(
    `%c[Chronos] card v${CARD_VERSION} loaded · custom element registered`,
    "color:#10b981;font-weight:600",
  );
} catch {
  // ignore environments without console (none in browsers, but defensive)
}
