import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { ScheduleCardConfig, Schedule } from "../types";
import { fetchSchedules } from "../ws";

const VARIANTS = [
  { value: "", label: "Schedule default" },
  { value: "linear", label: "Linear" },
  { value: "radial", label: "Radial" },
  { value: "list", label: "List" },
];

// [config key, label]. All default on except the weather ribbon.
const TOGGLES: [keyof ScheduleCardConfig, string][] = [
  ["show_now", "Now line"],
  ["show_next", "Next line"],
  ["show_timeline", "Timeline bar"],
  ["show_weather_ribbon", "Weather ribbon on timeline"],
  ["show_status_active", "Status: active"],
  ["show_status_devices", "Status: devices"],
  ["show_status_weather", "Status: weather rules"],
  ["show_status_days", "Status: days"],
  ["show_status_period", "Status: period"],
  ["show_last_activity", "Last activity line"],
  ["show_log", "Activity log"],
  ["alarm_glow", "Alarm glow on errors"],
  ["show_header", "Header (name + state)"],
  ["show_link", "Button linking to Chronos"],
];

/** Lovelace visual editor for `custom:chronos-schedule-card`. Same
 * config-changed pattern as the main card editor. English-only. */
@customElement("chronos-schedule-card-editor")
export class ChronosScheduleCardEditor extends LitElement {
  @property({ attribute: false }) hass: any;
  @state() private _config: ScheduleCardConfig = { type: "custom:chronos-schedule-card" };
  @state() private _schedules: Schedule[] = [];

  static styles = css`
    :host { display: block; padding: 8px 4px; font-family: var(--paper-font-body1_-_font-family, system-ui); }
    .row { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
    label { min-width: 150px; font-size: 13px; color: var(--secondary-text-color, #6b7280); }
    input[type=text], input[type=number], select {
      flex: 1; padding: 8px 10px; border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 6px; font-size: 14px; background: var(--card-background-color, white);
      color: var(--primary-text-color, #111);
    }
    input[type=checkbox] { width: 18px; height: 18px; }
    .toggles { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 18px; margin: 6px 0 12px; }
    .toggle { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--primary-text-color, #111); }
    .sec { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--secondary-text-color, #6b7280); font-weight: 600; margin: 4px 0 8px; }
    .info { background: var(--secondary-background-color, #f9fafb); border-radius: 8px; padding: 12px 14px; font-size: 12.5px; color: var(--secondary-text-color, #6b7280); margin-top: 10px; line-height: 1.45; }
    code { background: var(--code-editor-background-color, #f3f4f6); padding: 1px 5px; border-radius: 4px; font-size: 12px; }
  `;

  setConfig(config: ScheduleCardConfig) {
    this._config = { ...config };
  }

  connectedCallback(): void {
    super.connectedCallback();
    if (this.hass) fetchSchedules(this.hass).then((s) => { this._schedules = s || []; }).catch(() => {});
  }

  private _emit(patch: Partial<ScheduleCardConfig>) {
    this._config = { ...this._config, ...patch };
    Object.keys(this._config).forEach((k) => {
      const v = (this._config as any)[k];
      if (v === "" || v === undefined || v === null) delete (this._config as any)[k];
    });
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  private _bool(key: keyof ScheduleCardConfig): boolean {
    const v = this._config[key] as boolean | undefined;
    // Everything defaults on except the weather ribbon and the link button.
    return v === undefined ? key !== "show_weather_ribbon" && key !== "show_link" : v;
  }

  render() {
    const c = this._config;
    return html`
      <div class="row">
        <label for="schedule">Schedule</label>
        <select id="schedule"
          @change=${(e: Event) => this._emit({ schedule: (e.target as HTMLSelectElement).value || undefined })}>
          <option value="">— pick a schedule —</option>
          ${this._schedules.map((s) => html`
            <option value=${s.id} ?selected=${c.schedule === s.id}>${s.name || s.id}</option>`)}
        </select>
      </div>
      <div class="row">
        <label for="title">Title override</label>
        <input id="title" type="text" .value=${c.title || ""} placeholder="(schedule name)"
          @input=${(e: Event) => this._emit({ title: (e.target as HTMLInputElement).value })}/>
      </div>
      <div class="row">
        <label for="variant">Timeline variant</label>
        <select id="variant"
          @change=${(e: Event) => this._emit({ timeline_variant: ((e.target as HTMLSelectElement).value || undefined) as any })}>
          ${VARIANTS.map((v) => html`
            <option value=${v.value} ?selected=${(c.timeline_variant || "") === v.value}>${v.label}</option>`)}
        </select>
      </div>
      <div class="row">
        <label for="compare">Compare with</label>
        <select id="compare"
          @change=${(e: Event) => this._emit({ compare_with: (e.target as HTMLSelectElement).value || undefined })}>
          <option value="">None</option>
          ${this._schedules.filter((s) => s.id !== c.schedule).map((s) => html`
            <option value=${s.id} ?selected=${c.compare_with === s.id}>${s.name || s.id}</option>`)}
        </select>
      </div>
      <div class="row">
        <label for="link_path">Link target</label>
        <input id="link_path" type="text" .value=${c.link_path || ""} placeholder="/chronos"
          @input=${(e: Event) => this._emit({ link_path: (e.target as HTMLInputElement).value })}/>
      </div>
      <div class="row">
        <label for="log_limit">Log rows</label>
        <input id="log_limit" type="number" min="1" max="50" .value=${c.log_limit !== undefined ? String(c.log_limit) : ""}
          placeholder="6"
          @input=${(e: Event) => { const v = (e.target as HTMLInputElement).value; this._emit({ log_limit: v === "" ? undefined : parseInt(v, 10) }); }}/>
      </div>

      <div class="sec">Sections</div>
      <div class="toggles">
        ${TOGGLES.map(([key, label]) => html`
          <label class="toggle">
            <input type="checkbox" .checked=${this._bool(key)}
              @change=${(e: Event) => this._emit({ [key]: (e.target as HTMLInputElement).checked } as Partial<ScheduleCardConfig>)}/>
            ${label}
          </label>`)}
      </div>

      <div class="info">
        A read-only status recap of one schedule. Manage the schedule itself inside the
        main Chronos card. Minimum YAML: <code>type: custom:chronos-schedule-card</code> +
        <code>schedule: &lt;id&gt;</code> (copy the id from the schedule editor's ID chip).
      </div>
    `;
  }
}
