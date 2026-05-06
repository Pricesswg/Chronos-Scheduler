import { LitElement, html, svg, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { chronosStyles } from "./styles";
import { actionColor, actionLabel, getActionDef } from "./actions";
import { fmtHour, clamp, snapToGrid, resolveBlockTime } from "./utils";
import { defaultAction } from "./actions";
import { actionDefLabel } from "./i18n";
import type { Block, DeviceType, WeatherRule } from "./types";

@customElement("chronos-timeline")
export class ChronosTimeline extends LitElement {
  static styles = chronosStyles;

  @property({ type: String }) variant: "linear" | "radial" | "list" = "linear";
  @property({ type: String }) deviceType: DeviceType = "thermostat";
  @property({ type: Array }) blocks: Block[] = [];
  @property({ type: Number }) selectedIdx = -1;
  @property({ type: Number }) now: number | null = null;
  @property({ type: Boolean }) interactive = true;
  @property({ type: String }) height: "normal" | "compact" | "mini" = "normal";
  @property({ type: Boolean }) showWeather = true;
  @property({ type: Array }) forecast: any[] = [];
  /** When set, renders a ghost overlay showing the geometric range of the
   * rule's effect on its target block (for shift / extend / shrink /
   * scale_duration). For non-geometric effects no ghost is drawn. */
  @property({ attribute: false }) previewRule: WeatherRule | null = null;

  @state() private _drag: {
    idx: number;
    /** Reference to the block currently being dragged. Updated on every move
     * because we spread-copy the block to mutate it. Used to find the block's
     * new index after the parent's `updateBlocksLocal` sort: tracking by index
     * alone causes us to overwrite a sibling block when the dragged block
     * crosses it (visible "disappearing block" bug). */
    ref: Block;
    handle: "l" | "r" | "move";
    startX: number;
    startH?: number;
    origStart: number;
    origEnd: number;
  } | null = null;

  private _boundMove: ((e: MouseEvent) => void) | null = null;
  private _boundUp: (() => void) | null = null;

  render() {
    if (this.variant === "radial") return this._renderRadial();
    if (this.variant === "list") return this._renderList();
    return this._renderLinear();
  }

  private _renderRadialGhost(cx: number, cy: number, rOuter: number, _arcFn: (s: number, e: number, rO: number, rI: number) => string) {
    // Always draw the faint reference ring when interactive (so the user sees
    // there is a "projection layer" around the main timeline). The accent
    // arc is overlaid only when a rule is selected for preview.
    const r = rOuter + 14;
    const ringStrokeWidth = 8;
    const reference = this.previewRule ? svg`
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
        stroke="var(--border-soft)" stroke-width="${ringStrokeWidth}"
        opacity="0.4" pointer-events="none"/>
    ` : svg``;

    const range = this._computePreviewRange();
    if (!range) return reference;
    if (range.endH <= range.startH) return reference;

    const a1 = (range.startH / 24) * Math.PI * 2 - Math.PI / 2;
    const a2 = (range.endH / 24) * Math.PI * 2 - Math.PI / 2;
    const large = (range.endH - range.startH) > 12 ? 1 : 0;
    const x1 = cx + r * Math.cos(a1), y1 = cy + r * Math.sin(a1);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);

    // Anchor = the side of the ghost that's flush against the block edge.
    //  - forward extend  (ghost AFTER block):  anchor at startH = a1
    //  - backward extend (ghost BEFORE block): anchor at endH   = a2
    //  - shift / scale:  same convention via range.anchor
    const aAnchor = range.anchor === "end" ? a1 : a2;
    const xAnchor = cx + r * Math.cos(aAnchor);
    const yAnchor = cy + r * Math.sin(aAnchor);

    // Arrow tip pointing AWAY from the block, in the direction of motion.
    const aFar = range.anchor === "end" ? a2 : a1;
    const arrowR = r + 14;
    const aArrow = aFar + (range.anchor === "end" ? 1 : -1) * 0.04;
    const xArrowTip = cx + arrowR * Math.cos(aArrow);
    const yArrowTip = cy + arrowR * Math.sin(aArrow);

    return svg`
      ${reference}
      <path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}"
        fill="none" stroke="var(--accent)" stroke-width="${ringStrokeWidth}"
        stroke-linecap="round" stroke-opacity="0.95"
        pointer-events="none"/>
      <circle cx="${xAnchor}" cy="${yAnchor}" r="5" fill="var(--accent)" stroke="white" stroke-width="2" pointer-events="none"/>
      <line x1="${cx + (r + 4) * Math.cos(aFar)}" y1="${cy + (r + 4) * Math.sin(aFar)}"
        x2="${xArrowTip}" y2="${yArrowTip}"
        stroke="var(--accent)" stroke-width="3" stroke-linecap="round" pointer-events="none"/>
      <circle cx="${xArrowTip}" cy="${yArrowTip}" r="4.5" fill="var(--accent)" pointer-events="none"/>
    `;
  }

  /** Compute the geometric range a preview rule would affect on its target
   * block. Returns null if the rule is not geometric or has no target block.
   * `anchor` indicates which edge the change starts from (for arrow display):
   *  "end"   — change starts at block end (forward direction)
   *  "start" — change starts at block start (backward direction)
   */
  private _computePreviewRange(): { startH: number; endH: number; targetIdx: number; anchor: "start" | "end" } | null {
    const rule = this.previewRule;
    if (!rule) return null;
    const idx = rule.block_index;
    if (idx === null || idx === undefined || idx < 0 || idx >= this.blocks.length) return null;
    const block = this.blocks[idx];
    const bs = resolveBlockTime(block, "start");
    const be = resolveBlockTime(block, "end");
    const dir = rule.direction || "forward";
    const dH = (rule.delta_minutes || 0) / 60;

    // Ghost shows the DELTA / range of the moving edge — small arc just
    // outside the ring at the appropriate side, not the full new block.
    if (rule.effect === "shift") {
      return { startH: bs + dH, endH: be + dH, targetIdx: idx, anchor: dH >= 0 ? "end" : "start" };
    }
    if (rule.effect === "extend") {
      if (dir === "forward") return { startH: be, endH: Math.min(24, be + dH), targetIdx: idx, anchor: "end" };
      return { startH: Math.max(0, bs - dH), endH: bs, targetIdx: idx, anchor: "start" };
    }
    if (rule.effect === "shrink") {
      if (dir === "forward") return { startH: Math.max(bs, be - dH), endH: be, targetIdx: idx, anchor: "end" };
      return { startH: bs, endH: Math.min(be, bs + dH), targetIdx: idx, anchor: "start" };
    }
    if (rule.effect === "scale_duration") {
      const outMin = (rule.scale_out_min || 0) / 60;
      const outMax = (rule.scale_out_max || 60) / 60;
      if (dir === "forward") return { startH: bs + outMin, endH: Math.min(24, bs + outMax), targetIdx: idx, anchor: "end" };
      return { startH: Math.max(0, be - outMax), endH: be - outMin, targetIdx: idx, anchor: "start" };
    }
    return null;
  }

  // --- Linear ---
  private _renderLinear() {
    const pct = (h: number) => (h / 24) * 100;
    const cls = this.height === "compact" ? "timeline timeline--compact" : this.height === "mini" ? "timeline timeline--mini" : "timeline";

    return html`
      <div class="${cls}" @click=${this._onTrackClick}>
        ${this.showWeather && this.height !== "mini" ? this._renderWeatherRibbon() : nothing}
        <div class="timeline__hours">
          ${Array.from({ length: 24 }).map(() => html`<div></div>`)}
        </div>
        ${this.height === "normal" ? html`
          <div class="timeline__labels">
            ${[0, 6, 12, 18, 24].map((h) => html`<span style="left:${pct(h)}%">${String(h).padStart(2, "0")}:00</span>`)}
          </div>
        ` : nothing}
        ${this.blocks.map((b, i) => {
          const rs = resolveBlockTime(b, "start");
          const re = resolveBlockTime(b, "end");
          return html`
          <div
            class="tl-block"
            data-selected="${this.selectedIdx === i}"
            style="left:${pct(rs)}%;width:${pct(re - rs)}%;background:${actionColor(this.deviceType, b.action)}"
            @mousedown=${(e: MouseEvent) => this._onBlockDown(e, i, "move")}
            @click=${(e: MouseEvent) => { e.stopPropagation(); this._fireSelect(i); }}
          >
            ${this.interactive ? html`<div class="tl-block__handle tl-block__handle--l" @mousedown=${(e: MouseEvent) => this._onBlockDown(e, i, "l")}></div>` : nothing}
            <span class="truncate">${actionLabel(this.deviceType, b.action)}</span>
            ${this.height !== "mini" ? html`<span class="mono" style="font-size:10px;opacity:0.85">${fmtHour(rs)}</span>` : nothing}
            ${this.interactive ? html`<div class="tl-block__handle tl-block__handle--r" @mousedown=${(e: MouseEvent) => this._onBlockDown(e, i, "r")}></div>` : nothing}
          </div>
          `;
        })}
        ${this._renderLinearGhost(pct)}
        ${this.now !== null ? html`<div class="tl-now" style="left:${pct(this.now)}%"></div>` : nothing}
      </div>
    `;
  }

  private _renderLinearGhost(pct: (h: number) => number) {
    if (!this.previewRule) return nothing;
    const range = this._computePreviewRange();
    if (!range) return nothing;
    const left = pct(range.startH);
    const width = pct(range.endH) - left;
    if (width <= 0) return nothing;
    const color = "var(--accent)";
    const anchorSide = range.anchor === "end" ? "left" : "right";
    const movingSide = anchorSide === "left" ? "right" : "left";
    const arrowChar = movingSide === "right" ? "→" : "←";
    const anchorPos = anchorSide === "left"
      ? `left:${left}%`
      : `left:calc(${pct(range.endH)}% - 4px)`;
    const arrowPos = movingSide === "right"
      ? `left:calc(${pct(range.endH)}% + 2px)`
      : `right:calc(${100 - pct(range.startH)}% + 2px)`;
    // Ghost band drawn inside the timeline's bottom empty area (between blocks
    // and hour labels). 8px tall band, centered around bottom: 13px.
    return html`
      <div style="position:absolute;left:${left}%;width:${width}%;bottom:11px;height:6px;background:${color};opacity:0.85;border-radius:3px;pointer-events:none"></div>
      <div style="position:absolute;${anchorPos};bottom:8px;width:4px;height:12px;background:${color};border-radius:1px;pointer-events:none"></div>
      <div style="position:absolute;${arrowPos};bottom:8px;color:${color};font-weight:700;font-size:11px;line-height:12px;pointer-events:none">${arrowChar}</div>
    `;
  }

  private _renderWeatherRibbon() {
    if (!this.forecast.length) return nothing;
    return html`
      <div class="tl-weather">
        ${this.forecast.map((w) => {
          const state = w.condition || w.state || "cloud";
          const mapped = state.includes("rain") ? "rain" : state.includes("sun") ? "sun" : state.includes("snow") ? "snow" : "cloud";
          return html`<div class="tl-weather__cell" data-state="${mapped}"></div>`;
        })}
      </div>
    `;
  }

  // --- Radial ---
  private _renderRadial() {
    const size = 420;
    const cx = size / 2, cy = size / 2;
    const rOuter = 170, rInner = 120, rLabels = 195;

    const arc = (startH: number, endH: number, rO: number, rI: number) => {
      const a1 = (startH / 24) * Math.PI * 2 - Math.PI / 2;
      const a2 = (endH / 24) * Math.PI * 2 - Math.PI / 2;
      const large = (endH - startH) > 12 ? 1 : 0;
      const x1 = cx + rO * Math.cos(a1), y1 = cy + rO * Math.sin(a1);
      const x2 = cx + rO * Math.cos(a2), y2 = cy + rO * Math.sin(a2);
      const x3 = cx + rI * Math.cos(a2), y3 = cy + rI * Math.sin(a2);
      const x4 = cx + rI * Math.cos(a1), y4 = cy + rI * Math.sin(a1);
      return `M ${x1} ${y1} A ${rO} ${rO} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${rI} ${rI} 0 ${large} 0 ${x4} ${y4} Z`;
    };

    const nowAngle = this.now !== null ? (this.now / 24) * Math.PI * 2 - Math.PI / 2 : null;

    const handleAt = (h: number, idx: number, side: "l" | "r") => {
      const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
      const rMid = (rOuter + rInner) / 2;
      const x = cx + rMid * Math.cos(a);
      const y = cy + rMid * Math.sin(a);
      return svg`
        <g style="cursor:${this.interactive ? "ew-resize" : "default"}" @mousedown=${(e: MouseEvent) => this._onRadialHandleDown(e, idx, side)}>
          <circle cx="${x}" cy="${y}" r="9" fill="white" stroke="var(--accent)" stroke-width="2"/>
          <circle cx="${x}" cy="${y}" r="3" fill="var(--accent)"/>
        </g>
      `;
    };

    const selectedBlock = this.selectedIdx >= 0 ? this.blocks[this.selectedIdx] : null;

    return svg`
      <svg class="radial" viewBox="0 0 ${size} ${size}" style="touch-action:none">
        <circle cx="${cx}" cy="${cy}" r="${(rOuter + rInner) / 2}" fill="none" stroke="var(--border-soft)" stroke-width="${rOuter - rInner}"/>
        ${this.blocks.map((b, i) => {
          const rs = resolveBlockTime(b, "start");
          const re = resolveBlockTime(b, "end");
          return svg`
          <path
            d="${arc(rs, re, rOuter, rInner)}"
            fill="${actionColor(this.deviceType, b.action)}"
            stroke="${this.selectedIdx === i ? "var(--accent)" : "var(--block-edge)"}"
            stroke-width="${this.selectedIdx === i ? 3 : 1.5}"
            stroke-linejoin="round"
            style="cursor:${this.interactive ? "grab" : "pointer"}"
            @mousedown=${(e: MouseEvent) => this._onRadialHandleDown(e, i, "move")}
            @click=${(e: MouseEvent) => { e.stopPropagation(); this._fireSelect(i); }}
          />
        `;
        })}
        ${this.blocks.map((b) => {
          const rs = resolveBlockTime(b, "start");
          const re = resolveBlockTime(b, "end");
          // Etichetta sul midpoint dell'arco; solo se l'arco è abbastanza largo (>1.5h)
          if (re - rs < 1.5) return svg``;
          const midH = (rs + re) / 2;
          const a = (midH / 24) * Math.PI * 2 - Math.PI / 2;
          const rMid = (rOuter + rInner) / 2;
          const x = cx + rMid * Math.cos(a);
          const y = cy + rMid * Math.sin(a);
          const def = getActionDef(this.deviceType, b.action.id);
          let label = "";
          if (def?.value && b.action.value !== undefined && b.action.value !== null && b.action.value !== "") {
            label = `${b.action.value}${def.value.unit || ""}`;
          } else if (def?.label) {
            const translated = actionDefLabel(this.deviceType, b.action.id, def.label);
            label = translated.length > 8 ? translated.slice(0, 7) + "…" : translated;
          }
          if (!label) return svg``;
          return svg`
            <text x="${x}" y="${y}" text-anchor="middle" dy="4"
              font-size="13" font-weight="700"
              style="fill:#0f172a;stroke:rgba(255,255,255,0.9);stroke-width:2.5;paint-order:stroke fill"
              pointer-events="none">${label}</text>
          `;
        })}
        ${Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
          const r1 = rOuter - 2, r2 = i % 6 === 0 ? rOuter - 14 : rOuter - 8;
          return svg`<line x1="${cx + r1 * Math.cos(a)}" y1="${cy + r1 * Math.sin(a)}" x2="${cx + r2 * Math.cos(a)}" y2="${cy + r2 * Math.sin(a)}" stroke="white" stroke-width="${i % 6 === 0 ? 2 : 1}" opacity="0.7" pointer-events="none"/>`;
        })}
        ${[0, 6, 12, 18].map((h) => {
          const a = (h / 24) * Math.PI * 2 - Math.PI / 2;
          return svg`<text x="${cx + rLabels * Math.cos(a)}" y="${cy + rLabels * Math.sin(a)}" text-anchor="middle" dy="4" font-size="11">${String(h).padStart(2, "0")}</text>`;
        })}
        ${this._renderRadialGhost(cx, cy, rOuter, arc)}
        ${this.interactive && selectedBlock ? svg`${handleAt(resolveBlockTime(selectedBlock, "start"), this.selectedIdx, "l")}${handleAt(resolveBlockTime(selectedBlock, "end"), this.selectedIdx, "r")}` : nothing}
        ${nowAngle !== null ? svg`
          <g pointer-events="none">
            <line x1="${cx + 90 * Math.cos(nowAngle)}" y1="${cy + 90 * Math.sin(nowAngle)}" x2="${cx + (rOuter + 20) * Math.cos(nowAngle)}" y2="${cy + (rOuter + 20) * Math.sin(nowAngle)}" stroke="var(--danger)" stroke-width="2"/>
            <circle cx="${cx + (rOuter + 20) * Math.cos(nowAngle)}" cy="${cy + (rOuter + 20) * Math.sin(nowAngle)}" r="5" fill="var(--danger)"/>
          </g>
        ` : nothing}
        <text x="${cx}" y="${cy - 6}" text-anchor="middle" class="radial__label" font-size="32" font-weight="700" pointer-events="none">${this.now !== null ? fmtHour(this.now) : "—"}</text>
        <text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="11" pointer-events="none">24h · oggi</text>
      </svg>
    `;
  }

  // --- List ---
  private _renderList() {
    const range = this._computePreviewRange();
    return html`
      <div class="tl-list">
        ${this.blocks.map((b, i) => {
          const isTarget = range && range.targetIdx === i;
          const previewLabel = isTarget ? this._listPreviewLabel(range) : "";
          return html`
          <div
            class="tl-list__row"
            style="border-color:${this.selectedIdx === i ? "var(--accent)" : "var(--border-soft)"};background:${this.selectedIdx === i ? "var(--accent-soft)" : "var(--bg-sunken)"}"
            @click=${() => this._fireSelect(i)}
          >
            <div class="tl-list__time">${fmtHour(resolveBlockTime(b, "start"))} → ${fmtHour(resolveBlockTime(b, "end"))}</div>
            <div class="tl-list__mode">
              <span class="tl-list__mode-dot" style="background:${actionColor(this.deviceType, b.action)}"></span>
              <strong>${actionLabel(this.deviceType, b.action)}</strong>
            </div>
            ${previewLabel ? html`
              <span class="chip" style="background:var(--accent-soft);color:var(--accent-ink);font-weight:600">
                ${previewLabel}
              </span>
            ` : nothing}
            <span class="mono text-xs text-mute">${Math.round((resolveBlockTime(b, "end") - resolveBlockTime(b, "start")) * 60)} min</span>
          </div>
          `;
        })}
      </div>
    `;
  }

  /** Build a short delta label for the list preview chip. */
  private _listPreviewLabel(range: { startH: number; endH: number; targetIdx: number; anchor: "start" | "end" }): string {
    const rule = this.previewRule;
    if (!rule) return "";
    const dMin = Math.round((range.endH - range.startH) * 60);
    const arrow = range.anchor === "end" ? "→" : "←";
    if (rule.effect === "shift") return `${arrow} shift ${dMin}m`;
    if (rule.effect === "extend") return `${arrow} +${dMin} min`;
    if (rule.effect === "shrink") return `${arrow} −${dMin} min`;
    if (rule.effect === "scale_duration") {
      const omin = rule.scale_out_min ?? 0;
      const omax = rule.scale_out_max ?? 60;
      return `${arrow} ${omin}–${omax} min`;
    }
    return "";
  }

  // --- Drag logic ---
  private _onBlockDown(e: MouseEvent, idx: number, handle: "l" | "r" | "move") {
    if (!this.interactive) return;
    e.stopPropagation();
    e.preventDefault();
    this._fireSelect(idx);
    const b = this.blocks[idx];
    this._drag = {
      idx, ref: b, handle, startX: e.clientX,
      origStart: resolveBlockTime(b, "start"),
      origEnd: resolveBlockTime(b, "end"),
    };
    this._boundMove = (ev: MouseEvent) => this._onDragMove(ev);
    this._boundUp = () => this._onDragUp();
    window.addEventListener("mousemove", this._boundMove);
    window.addEventListener("mouseup", this._boundUp);
  }

  private _onDragMove(e: MouseEvent) {
    if (!this._drag) return;
    const el = this.shadowRoot?.querySelector(".timeline") as HTMLElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const h = clamp(((e.clientX - rect.left) / rect.width) * 24, 0, 24);
    const snap = snapToGrid(h);
    // Locate the dragged block by reference: its index can shift between moves
    // because the parent sorts blocks by `start` after each blocks-changed.
    const curIdx = this.blocks.indexOf(this._drag.ref);
    if (curIdx < 0) return;
    const next = [...this.blocks];
    const b: any = { ...next[curIdx] };
    if (this._drag.handle === "l") {
      const newStart = clamp(snap, 0, resolveBlockTime(b, "end") - 0.25);
      b.start = newStart;
      delete b.start_anchor;
      delete b.start_offset;
    } else if (this._drag.handle === "r") {
      const newEnd = clamp(snap, resolveBlockTime(b, "start") + 0.25, 24);
      b.end = newEnd;
      delete b.end_anchor;
      delete b.end_offset;
    } else {
      const dx = e.clientX - this._drag.startX;
      const dh = (dx / rect.width) * 24;
      const duration = this._drag.origEnd - this._drag.origStart;
      let s = clamp(this._drag.origStart + dh, 0, 24 - duration);
      s = snapToGrid(s);
      b.start = s;
      b.end = s + duration;
      delete b.start_anchor;
      delete b.start_offset;
      delete b.end_anchor;
      delete b.end_offset;
    }
    next[curIdx] = b;
    this._drag.ref = b;
    this._fireBlocksChanged(next);
  }

  private _onDragUp() {
    this._drag = null;
    if (this._boundMove) window.removeEventListener("mousemove", this._boundMove);
    if (this._boundUp) window.removeEventListener("mouseup", this._boundUp);
    this._boundMove = null;
    this._boundUp = null;
  }

  private _onRadialHandleDown(e: MouseEvent, idx: number, handle: "l" | "r" | "move") {
    if (!this.interactive) return;
    e.stopPropagation();
    e.preventDefault();
    this._fireSelect(idx);
    const b = this.blocks[idx];
    const svgEl = this.shadowRoot?.querySelector(".radial") as SVGSVGElement;
    if (!svgEl) return;

    const hoursFromEvent = (ev: MouseEvent) => {
      const rect = svgEl.getBoundingClientRect();
      const size = 420;
      const px = ((ev.clientX - rect.left) / rect.width) * size;
      const py = ((ev.clientY - rect.top) / rect.height) * size;
      let ang = Math.atan2(py - size / 2, px - size / 2) + Math.PI / 2;
      if (ang < 0) ang += Math.PI * 2;
      return (ang / (Math.PI * 2)) * 24;
    };

    const startH = hoursFromEvent(e);

    const origStart = resolveBlockTime(b, "start");
    const origEnd = resolveBlockTime(b, "end");

    // Track the dragged block by reference: the parent sorts blocks by `start`
    // after every blocks-changed event, so the original `idx` would point to
    // a different (sibling) block once the drag crosses it. Without this
    // reference tracking, the sibling block gets overwritten and visually
    // disappears when one block is dragged onto another.
    let draggedRef: Block = b;

    const onMove = (ev: MouseEvent) => {
      const h = hoursFromEvent(ev);
      const snap = snapToGrid(h);
      const curIdx = this.blocks.indexOf(draggedRef);
      if (curIdx < 0) return;
      const next = [...this.blocks];
      const block: any = { ...next[curIdx] };
      if (handle === "l") {
        block.start = clamp(snap, 0, resolveBlockTime(block, "end") - 0.25);
        delete block.start_anchor;
        delete block.start_offset;
      } else if (handle === "r") {
        block.end = clamp(snap, resolveBlockTime(block, "start") + 0.25, 24);
        delete block.end_anchor;
        delete block.end_offset;
      } else {
        const dh = h - startH;
        const dur = origEnd - origStart;
        let s = origStart + dh;
        s = snapToGrid(s);
        s = clamp(s, 0, 24 - dur);
        block.start = s;
        block.end = s + dur;
        delete block.start_anchor;
        delete block.start_offset;
        delete block.end_anchor;
        delete block.end_offset;
      }
      next[curIdx] = block;
      draggedRef = block;
      this._fireBlocksChanged(next);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  private _onTrackClick(e: MouseEvent) {
    if (!this.interactive) return;
    const target = e.target as HTMLElement;
    if (target.closest(".tl-block")) return;
    const el = this.shadowRoot?.querySelector(".timeline") as HTMLElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const h = clamp(((e.clientX - rect.left) / rect.width) * 24, 0, 24);
    const start = Math.max(0, snapToGrid(h) - 0.5);
    const end = Math.min(24, start + 1);
    const conflict = this.blocks.some((b) => {
      const bs = resolveBlockTime(b, "start");
      const be = resolveBlockTime(b, "end");
      return !(end <= bs || start >= be);
    });
    if (conflict) return;
    const newBlocks = [...this.blocks, { start, end, action: defaultAction(this.deviceType) }];
    this._fireBlocksChanged(newBlocks);
  }

  private _fireSelect(idx: number) {
    this.dispatchEvent(new CustomEvent("block-select", { detail: { index: idx } }));
  }

  private _fireBlocksChanged(blocks: Block[]) {
    this.dispatchEvent(new CustomEvent("blocks-changed", { detail: { blocks } }));
  }
}
