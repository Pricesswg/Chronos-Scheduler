import { LitElement, html, css, unsafeCSS, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import * as L from "leaflet";
import { LEAFLET_CSS } from "./leaflet-css";
import { icon } from "./icons";
import { t } from "./i18n";

/** Radar frame: RainViewer timestamp (unix seconds) + its preloaded tile
 * layer. All frames stay on the map at opacity 0 so scrubbing/playing is
 * instant instead of re-fetching tiles per step. */
interface RadarFrame {
  time: number;
  layer: L.TileLayer;
}

const OWM_LAYERS = [
  { id: "temp_new", key: "temp" },
  { id: "wind_new", key: "wind" },
  { id: "clouds_new", key: "clouds" },
  { id: "pressure_new", key: "pressure" },
] as const;

/** Interactive weather map for the Live screen: OpenStreetMap base tiles
 * (dark-filtered when the card theme is dark), RainViewer precipitation
 * radar with past + nowcast frames (free, no API key), and optional
 * OpenWeatherMap overlays (temperature / wind / clouds / pressure) that
 * unlock when the user configures an OWM API key in Settings.
 *
 * Everything here talks to the network at view time (OSM, RainViewer,
 * OWM); installations that must stay offline can hide the whole map via
 * Settings → Live screen. */
@customElement("chronos-weather-map")
export class ChronosWeatherMap extends LitElement {
  @property({ type: Number }) lat = 0;
  @property({ type: Number }) lon = 0;
  @property() owmKey = "";
  @property({ type: Boolean }) dark = false;

  @state() private _frames: RadarFrame[] = [];
  @state() private _frameIdx = 0;
  @state() private _playing = false;
  @state() private _radarOn = true;
  @state() private _owmLayer = "";
  @state() private _radarError = false;

  private _map?: L.Map;
  private _base?: L.TileLayer;
  private _owm?: L.TileLayer;
  private _ro?: ResizeObserver;
  private _timer?: number;
  /** Frames below this index are observed radar, from it onwards nowcast. */
  private _pastCount = 0;

  static styles = [
    unsafeCSS(LEAFLET_CSS),
    css`
      :host { display: block; }
      #map {
        height: 380px;
        border-radius: var(--r-md, 10px);
        border: 1px solid var(--border);
        overflow: hidden;
        background: var(--bg-sunken);
      }
      .osm-dark {
        filter: brightness(0.62) invert(1) contrast(2.6) hue-rotate(195deg)
          saturate(0.35) brightness(0.72);
      }
      .toolbar { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-bottom: 10px; }
      .lchip {
        padding: 4px 11px; border-radius: 999px; font-size: 11.5px; cursor: pointer;
        background: var(--bg-sunken); border: 1px solid var(--border);
        color: var(--text-soft); font-family: inherit;
      }
      .lchip[data-on="1"] { background: var(--accent-soft); border-color: var(--accent); color: var(--text); }
      .lchip[disabled] { opacity: 0.45; cursor: not-allowed; }
      .timebox {
        margin-left: auto; display: flex; align-items: center; gap: 8px;
        font-size: 11.5px; color: var(--text-soft);
      }
      .nowcast {
        padding: 1px 7px; border-radius: 999px; font-size: 10px;
        background: color-mix(in srgb, var(--accent) 18%, transparent); color: var(--accent);
      }
      .play {
        width: 26px; height: 26px; border-radius: 50%; border: 1px solid var(--border);
        background: var(--bg-sunken); color: var(--text); cursor: pointer;
        display: inline-flex; align-items: center; justify-content: center;
      }
      .play[disabled] { opacity: 0.45; cursor: not-allowed; }
      input[type="range"] { accent-color: var(--accent); width: 130px; }
      .radar-note { font-size: 11px; color: var(--text-muted); }
      .home-dot {
        border-radius: 50%;
        background: var(--accent);
        border: 3px solid color-mix(in srgb, var(--accent) 35%, transparent);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 25%, transparent),
          0 0 14px color-mix(in srgb, var(--accent) 80%, transparent);
      }
      /* Leaflet chrome, restyled onto the card's design tokens */
      .leaflet-container { background: var(--bg-sunken); font: inherit; }
      .leaflet-bar a {
        background: var(--surface); color: var(--text);
        border-bottom: 1px solid var(--border);
      }
      .leaflet-bar a:hover { background: var(--bg-sunken); color: var(--text); }
      .leaflet-control-attribution {
        background: color-mix(in srgb, var(--surface) 85%, transparent);
        color: var(--text-muted); font-size: 9.5px;
      }
      .leaflet-control-attribution a { color: var(--text-soft); }
    `,
  ];

  render() {
    const noKey = !this.owmKey;
    const frame = this._frames[this._frameIdx];
    return html`
      <div class="toolbar">
        <button class="lchip" data-on=${this._radarOn ? "1" : "0"} @click=${this._toggleRadar}>
          ${t("live.map.layer.radar")}
        </button>
        ${OWM_LAYERS.map((l) => html`
          <button class="lchip" data-on=${this._owmLayer === l.id ? "1" : "0"}
            ?disabled=${noKey}
            title=${noKey ? t("live.map.needs_key") : ""}
            @click=${() => this._setOwm(l.id)}>
            ${t("live.map.layer." + l.key)}
          </button>
        `)}
        <span class="timebox">
          ${this._radarError
            ? html`<span class="radar-note">${t("live.map.radar_error")}</span>`
            : frame
              ? html`
                  ${this._frameIdx >= this._pastCount
                    ? html`<span class="nowcast">${t("live.map.nowcast")}</span>`
                    : nothing}
                  <span>${new Date(frame.time * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                `
              : nothing}
          <button class="play" ?disabled=${!this._frames.length}
            title=${this._playing ? t("live.map.pause") : t("live.map.play")}
            @click=${this._togglePlay}>
            ${icon(this._playing ? "pause" : "play", 11)}
          </button>
          <input type="range" min="0" max=${Math.max(0, this._frames.length - 1)}
            .value=${String(this._frameIdx)} ?disabled=${!this._frames.length}
            @input=${this._onScrub} />
        </span>
      </div>
      <div id="map"></div>
    `;
  }

  firstUpdated() {
    this._initMap();
  }

  connectedCallback() {
    super.connectedCallback();
    // Re-init after a detach/re-attach cycle (tab navigation can move the
    // element without destroying it; disconnectedCallback tore the map down).
    if (this.hasUpdated && !this._map) queueMicrotask(() => this._initMap());
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._pause();
    this._ro?.disconnect();
    this._ro = undefined;
    this._map?.remove();
    this._map = undefined;
    this._base = undefined;
    this._owm = undefined;
    this._frames = [];
    this._radarError = false;
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has("dark") && this._base) {
      this._base.getContainer()?.classList.toggle("osm-dark", this.dark);
    }
    if (changed.has("owmKey") && this._owmLayer) {
      // Key added/removed while an overlay is selected: rebuild it.
      const cur = this._owmLayer;
      this._owmLayer = "";
      this._setOwm(cur);
    }
  }

  private _initMap() {
    const el = this.renderRoot.querySelector("#map") as HTMLElement | null;
    if (!el || this._map || !isFinite(this.lat) || !isFinite(this.lon)) return;
    this._map = L.map(el, {
      center: [this.lat, this.lon],
      zoom: 9,
      zoomControl: true,
    });
    this._map.attributionControl.setPrefix(false);
    this._base = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      className: this.dark ? "osm-dark" : "",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &middot; <a href="https://www.rainviewer.com/">RainViewer</a>',
    }).addTo(this._map);
    L.marker([this.lat, this.lon], {
      icon: L.divIcon({ className: "home-dot", iconSize: [14, 14] }),
      interactive: false,
    }).addTo(this._map);
    // Leaflet measures its container once; the card lays out asynchronously
    // (tab switch, sidebar collapse), so keep the size in sync.
    this._ro = new ResizeObserver(() => this._map?.invalidateSize());
    this._ro.observe(el);
    this._loadRadar();
  }

  private async _loadRadar() {
    try {
      const res = await fetch("https://api.rainviewer.com/public/weather-maps.json");
      const data = await res.json();
      const past = (data?.radar?.past || []).slice(-7);
      const nowcast = data?.radar?.nowcast || [];
      const raw = [...past, ...nowcast];
      if (!raw.length || !this._map) {
        this._radarError = !raw.length;
        return;
      }
      this._pastCount = past.length;
      this._frames = raw.map((f: any) => ({
        time: f.time,
        layer: L.tileLayer(`${data.host}${f.path}/256/{z}/{x}/{y}/2/1_1.png`, {
          opacity: 0,
          zIndex: 5,
          maxZoom: 18,
        }).addTo(this._map!),
      }));
      // Land on the latest observed frame; the user presses play for the loop.
      this._showFrame(Math.max(0, this._pastCount - 1));
    } catch {
      this._radarError = true;
    }
  }

  private _showFrame(i: number) {
    this._frameIdx = i;
    this._frames.forEach((f, j) => f.layer.setOpacity(this._radarOn && j === i ? 0.7 : 0));
  }

  private _toggleRadar = () => {
    this._radarOn = !this._radarOn;
    if (!this._radarOn) this._pause();
    this._showFrame(this._frameIdx);
  };

  private _togglePlay = () => {
    if (this._playing) {
      this._pause();
      return;
    }
    if (!this._frames.length) return;
    if (!this._radarOn) {
      this._radarOn = true;
      this._showFrame(this._frameIdx);
    }
    this._playing = true;
    this._timer = window.setInterval(() => {
      this._showFrame((this._frameIdx + 1) % this._frames.length);
    }, 700);
  };

  private _pause() {
    this._playing = false;
    if (this._timer !== undefined) {
      clearInterval(this._timer);
      this._timer = undefined;
    }
  }

  private _onScrub = (e: Event) => {
    this._pause();
    const v = parseInt((e.target as HTMLInputElement).value, 10);
    if (!isNaN(v)) this._showFrame(v);
  };

  private _setOwm(layerId: string) {
    if (this._owm) {
      this._owm.remove();
      this._owm = undefined;
    }
    if (this._owmLayer === layerId) {
      this._owmLayer = "";
      return;
    }
    this._owmLayer = layerId;
    if (!this.owmKey || !this._map) return;
    this._owm = L.tileLayer(
      `https://tile.openweathermap.org/map/${layerId}/{z}/{x}/{y}.png?appid=${encodeURIComponent(this.owmKey)}`,
      {
        opacity: 0.65,
        zIndex: 4,
        maxZoom: 18,
        attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      },
    ).addTo(this._map);
  }
}
