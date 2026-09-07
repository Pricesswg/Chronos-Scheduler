import { LitElement, PropertyValues, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { HomeAssistant } from "./types";

/** Sidebar host. Home Assistant renders this element at /chronos, gives it
 * the whole content area and keeps `hass` and `narrow` updated. It mounts
 * the card full-bleed. The card is created imperatively so setConfig runs
 * before hass arrives, the order Lovelace guarantees and the card relies on.
 * Custom panels get no toolbar from HA: on a narrow screen the card shows
 * the button that opens the HA sidebar instead. */
@customElement("chronos-panel")
export class ChronosPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) panel?: { config?: Record<string, unknown> };

  static styles = css`
    :host { display: block; height: 100%; }
    #host, chronos-card { display: block; height: 100%; }
  `;

  private _card?: any;

  render() {
    return html`<div id="host"></div>`;
  }

  firstUpdated() {
    const card = document.createElement("chronos-card") as any;
    card.setConfig({ type: "custom:chronos-card", panel_mode: false });
    card.toggleAttribute("sidebar", true);
    card.toggleAttribute("narrow", this.narrow);
    card.hass = this.hass;
    this.renderRoot.querySelector("#host")!.appendChild(card);
    this._card = card;
  }

  updated(changed: PropertyValues) {
    if (!this._card) return;
    if (changed.has("hass")) this._card.hass = this.hass;
    if (changed.has("narrow")) this._card.toggleAttribute("narrow", this.narrow);
  }
}
