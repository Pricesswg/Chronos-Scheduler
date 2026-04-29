import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("chronos-card-editor")
export class ChronosCardEditor extends LitElement {
  static styles = css`
    :host { display: block; padding: 16px; }
    p { margin: 0; color: #666; font-size: 14px; }
  `;

  @property({ attribute: false }) hass: any;
  @property({ attribute: false }) _config: any = {};

  setConfig(config: any) {
    this._config = config;
  }

  render() {
    return html`
      <p>Chronos Scheduler non richiede configurazione nella card. Tutta la configurazione avviene dall'integrazione e dall'interfaccia interna della card.</p>
    `;
  }

  private _fireConfigChanged() {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }
}
