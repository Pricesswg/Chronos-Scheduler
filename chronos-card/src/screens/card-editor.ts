import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { ChronosCardConfig, Screen } from "../types";

const SCREEN_OPTIONS: { value: Screen; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "editor", label: "Schedule editor" },
  { value: "week", label: "Week view" },
  { value: "weatherRulesList", label: "Weather rules" },
  { value: "device", label: "Devices" },
  { value: "live", label: "Live status" },
  { value: "wizard", label: "New schedule wizard" },
  { value: "devices", label: "Manage devices" },
  { value: "settings", label: "Settings" },
  { value: "help", label: "Help" },
];

/** Lovelace visual editor for `custom:chronos-card`. Returned by
 * `ChronosCard.getConfigElement()` so the dashboard's "Edit card" dialog
 * shows a GUI form instead of falling back to YAML-only editing.
 *
 * Pattern: read config via `setConfig`, render a form, dispatch
 * `config-changed` (bubbling, composed) with the new config on every input.
 * HA writes the resulting YAML back into the dashboard for us. */
@customElement("chronos-card-editor")
export class ChronosCardEditor extends LitElement {
  @property({ attribute: false }) hass: any;
  @state() private _config: ChronosCardConfig = { type: "custom:chronos-card" };

  static styles = css`
    :host { display: block; padding: 8px 4px; font-family: var(--paper-font-body1_-_font-family, system-ui); }
    .row { display: flex; gap: 12px; align-items: center; margin-bottom: 14px; }
    label { min-width: 140px; font-size: 13px; color: var(--secondary-text-color, #6b7280); }
    input[type=text], input[type=number], select {
      flex: 1; padding: 8px 10px; border: 1px solid var(--divider-color, #e5e7eb);
      border-radius: 6px; font-size: 14px; background: var(--card-background-color, white);
      color: var(--primary-text-color, #111);
    }
    input[type=checkbox] { width: 18px; height: 18px; }
    .info { background: var(--secondary-background-color, #f9fafb); border-radius: 8px; padding: 12px 14px; font-size: 12.5px; color: var(--secondary-text-color, #6b7280); margin-top: 10px; line-height: 1.45; }
    .info strong { color: var(--primary-text-color, #111); }
    code { background: var(--code-editor-background-color, #f3f4f6); padding: 1px 5px; border-radius: 4px; font-size: 12px; }
  `;

  setConfig(config: ChronosCardConfig) {
    this._config = { ...config };
  }

  private _emit(patch: Partial<ChronosCardConfig>) {
    this._config = { ...this._config, ...patch };
    Object.keys(this._config).forEach((k) => {
      const v = (this._config as any)[k];
      if (v === "" || v === undefined || v === null) delete (this._config as any)[k];
    });
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config },
      bubbles: true, composed: true,
    }));
  }

  render() {
    const c = this._config;
    return html`
      <div class="row">
        <label for="title">Card title</label>
        <input id="title" type="text" .value=${c.title || ""}
          placeholder="(optional)"
          @input=${(e: Event) => this._emit({ title: (e.target as HTMLInputElement).value })}/>
      </div>
      <div class="row">
        <label for="default_screen">Default screen</label>
        <select id="default_screen"
          @change=${(e: Event) => this._emit({ default_screen: ((e.target as HTMLSelectElement).value || undefined) as Screen | undefined })}>
          <option value="">Overview (default)</option>
          ${SCREEN_OPTIONS.map((o) => html`
            <option value=${o.value} ?selected=${c.default_screen === o.value}>${o.label}</option>
          `)}
        </select>
      </div>
      <div class="row">
        <label for="collapse_sidebar">Collapsed sidebar</label>
        <input id="collapse_sidebar" type="checkbox" .checked=${!!c.collapse_sidebar}
          @change=${(e: Event) => this._emit({ collapse_sidebar: (e.target as HTMLInputElement).checked })}/>
        <span style="font-size:12.5px;color:var(--secondary-text-color)">Start the card with the sidebar in mini mode (desktop only).</span>
      </div>
      <div class="row">
        <label for="mobile_threshold">Mobile breakpoint (px)</label>
        <input id="mobile_threshold" type="number" min="0" step="10"
          .value=${c.mobile_threshold !== undefined ? String(c.mobile_threshold) : ""}
          placeholder="700"
          @input=${(e: Event) => {
            const v = (e.target as HTMLInputElement).value;
            this._emit({ mobile_threshold: v === "" ? undefined : parseInt(v, 10) });
          }}/>
      </div>
      <div class="info">
        <strong>Chronos has no entity bindings to configure here.</strong>
        Schedules, devices and weather rules are managed inside the card itself
        (the ⚙ Settings screen and the wizard). All of Chronos' state is stored
        by the integration via WebSocket — the card config only controls
        presentation.
        <br><br>
        Minimum YAML: <code>type: custom:chronos-card</code>
      </div>
    `;
  }
}
