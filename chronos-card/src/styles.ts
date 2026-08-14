import { css } from "lit";

// Token vars + host-level layout. Applied ONLY to the chronos-card root.
// Custom properties cascade through shadow DOM, so children
// inherit them without having to redefine :host in their own styles.
// Hybrid theme: chrome variables (background, text, border, surface) come from
// Home Assistant theme tokens with our oklch values as fallback. This way the
// card automatically follows whatever theme the user has installed (default,
// dark, custom HACS themes), and we keep our distinctive accent palette for
// brand recognition.
export const chronosTokens = css`
  :host {
    display: block;
    height: 100%;
    box-sizing: border-box;
  }
  /* Lovelace "panel" view: HA gives us the full viewport height and overlays
   * its app bar on top of the card instead of pushing it below. Without
   * compensating padding our sidebar and topbar sit at y=0 of the viewport,
   * directly under (and visually overlapping) the HA app bar. The host
   * element exposes a panel-mode attribute set by chronos-card.ts when
   * runtime detection identifies this layout; the padding then offsets the
   * card content by the app bar height. */
  :host([panel-mode]) {
    padding-top: var(--chronos-panel-offset, var(--header-height, 56px));
  }
  :host {
    --font-sans: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
    --font-mono: "JetBrains Mono", ui-monospace, Menlo, monospace;

    /* Chrome — follow HA theme. Layered cascade for max compatibility:
     *   --ha-card-background → --card-background-color → --primary-background-color
     * so themes that only define one of those still work. Our oklch values are
     * the final fallback for installations without theme tokens. */
    --bg: var(--ha-card-background, var(--card-background-color, var(--primary-background-color, oklch(0.985 0.004 85))));
    --bg-soft: var(--secondary-background-color, var(--primary-background-color, oklch(0.965 0.005 85)));
    --bg-sunken: var(--primary-background-color, var(--secondary-background-color, oklch(0.945 0.006 85)));
    --surface: var(--ha-card-background, var(--card-background-color, #ffffff));
    --border: var(--divider-color, oklch(0.90 0.006 85));
    --border-soft: var(--divider-color, oklch(0.93 0.005 85));
    --text: var(--primary-text-color, oklch(0.22 0.012 85));
    --text-soft: var(--secondary-text-color, oklch(0.42 0.012 85));
    --text-muted: var(--disabled-text-color, var(--secondary-text-color, oklch(0.60 0.010 85)));

    /* Accent — Chronos identity. Stay our oklch (with HA accent as soft override
     * for users who want their theme accent to influence Chronos too). */
    --accent: var(--accent-color, oklch(0.55 0.15 265));
    --accent-soft: oklch(0.93 0.04 265);
    --accent-ink: oklch(0.35 0.15 265);
    --weather: oklch(0.72 0.15 65);
    --weather-soft: oklch(0.95 0.04 65);
    --weather-ink: oklch(0.48 0.15 65);

    /* Semantic — keep ours for consistency */
    --ok: var(--success-color, oklch(0.65 0.14 155));
    --warn: var(--warning-color, oklch(0.72 0.15 65));
    --danger: var(--error-color, oklch(0.60 0.18 25));
    --info: var(--info-color, oklch(0.60 0.13 230));

    /* Block kind colors — Chronos identity, never change */
    --mode-eco: oklch(0.70 0.12 155);
    --mode-comfort: oklch(0.55 0.15 265);
    --mode-boost: oklch(0.62 0.20 30);
    --mode-night: oklch(0.45 0.10 280);
    --mode-off: oklch(0.70 0.01 85);

    --r-sm: 6px;
    --r-md: 10px;
    --r-lg: 16px;
    --r-xl: 22px;
    --r-pill: 999px;

    --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.06);
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
    --shadow-md: 0 4px 14px rgba(0, 0, 0, 0.10), 0 2px 4px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 16px 40px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.08);

    --block-edge: var(--primary-text-color, #000);

    --density-pad: 16px;
    --density-gap: 16px;
    --row-h: 56px;

    font-family: var(--font-sans);
    font-size: 14px;
    line-height: 1.45;
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  :host([density="compact"]) {
    --density-pad: 10px;
    --density-gap: 10px;
    --row-h: 44px;
  }
`;

// Shared component styles. Applied to every component.
// Does not redefine the tokens: inherits them from the chronos-card root.
export const chronosStyles = css`
  :host { display: block; }

  * { box-sizing: border-box; }
  button, input, select, textarea { font: inherit; color: inherit; }
  button { cursor: pointer; background: none; border: none; padding: 0; }
  input, textarea, select { outline: none; }

  .mono { font-family: var(--font-mono); font-feature-settings: "tnum" 1; }

  /* App shell */
  .app {
    display: grid;
    grid-template-columns: auto 1fr;
    min-height: 600px;
    height: 100%;
    background: var(--bg);
    border-radius: var(--r-lg);
    overflow: hidden;
    border: 1px solid var(--border);
    position: relative;
    /* Establish a fresh stacking context so position:sticky / absolute /
     * z-index children (sidebar, topbar, drawers) can't escape the card
     * boundary in browsers where border-radius + overflow:hidden alone
     * fails to clip composited layers (Safari / iOS WebKit notably). */
    isolation: isolate;
    /* Belt-and-braces clipping: inset rounds defeat Safari's known
     * issue where overflow:hidden doesn't clip transform-promoted or
     * sticky descendants against the rounded corners. */
    clip-path: inset(0 round var(--r-lg));
  }

  .sidebar {
    width: 244px;
    background: var(--bg-soft);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    /* Extra top padding so the brand icon sits below the visual line of
     * the topbar / HA app header on tablet and mobile. Reported overlap on
     * narrow devices when the card edge-to-edge against the HA app bar. */
    padding: 24px 14px 18px;
    gap: 4px;
    min-height: 0;
    overflow-y: auto;
    position: relative;
    z-index: 30;
    transition: width 180ms ease;
  }
  .sidebar[data-mode="mini"] {
    width: 64px;
    padding: 18px 8px 14px;
    align-items: center;
  }
  .sidebar[data-mode="drawer"] {
    position: absolute;
    top: 0; left: 0; bottom: 0;
    width: 244px;
    box-shadow: 0 0 30px rgba(0,0,0,0.18);
  }
  .sidebar-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.32);
    z-index: 25;
    backdrop-filter: blur(2px);
  }
  .sidebar__hamburger {
    display: flex; align-items: center; justify-content: center;
    width: 40px; height: 40px; margin-bottom: 6px;
    border-radius: var(--r-md);
    color: var(--text-soft);
    transition: background 120ms, color 120ms;
  }
  .sidebar__hamburger:hover { background: var(--bg-sunken); color: var(--text); }
  .sidebar[data-mode="mini"] .sidebar__hamburger { align-self: center; }

  .sidebar__brand {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 8px 18px;
    border-bottom: 1px solid var(--border-soft);
    margin-bottom: 10px;
  }
  .sidebar[data-mode="mini"] .sidebar__brand {
    padding: 6px 0 14px;
    border-bottom: 1px solid var(--border-soft);
    margin-bottom: 8px;
    width: 100%; justify-content: center;
  }
  .sidebar[data-mode="mini"] .nav-item {
    width: 40px; height: 40px;
    padding: 0;
    justify-content: center;
    gap: 0;
  }
  .sidebar[data-mode="mini"] .sidebar__footer {
    padding-top: 10px; align-items: center;
  }
  .sidebar__brand-mark {
    width: 30px; height: 30px; border-radius: 9px;
    background: linear-gradient(135deg, var(--accent), var(--weather));
    display: grid; place-items: center; color: white;
    font-weight: 700; font-size: 13px; letter-spacing: -0.02em;
    box-shadow: var(--shadow-sm);
  }
  .sidebar__brand-name { font-weight: 600; letter-spacing: -0.01em; font-size: 15px; }
  .sidebar__brand-sub { color: var(--text-muted); font-size: 11px; font-family: var(--font-mono); margin-top: 2px; }

  .nav-section { padding: 14px 8px 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); font-weight: 600; }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    width: 100%; padding: 9px 10px;
    border-radius: var(--r-md);
    color: var(--text-soft); font-size: 13.5px; font-weight: 500;
    text-align: left;
    transition: background 120ms, color 120ms;
  }
  .nav-item:hover { background: var(--bg-sunken); color: var(--text); }
  .nav-item[data-active="true"] {
    background: var(--accent-soft); color: var(--accent-ink); font-weight: 600;
  }
  .nav-item svg { width: 16px; height: 16px; flex: none; }

  .sidebar__footer { margin-top: auto; display: flex; flex-direction: column; gap: 6px; padding-top: 12px; border-top: 1px solid var(--border-soft); }

  /* Content area */
  .content { overflow: auto; min-height: 0; position: relative; }
  .content__inner { padding: 28px 36px 60px; max-width: 1400px; margin: 0 auto; }

  .topbar {
    position: sticky; top: 0; z-index: 20;
    display: flex; align-items: center; gap: 14px;
    padding: 14px 36px;
    background: color-mix(in srgb, var(--bg) 86%, transparent);
    backdrop-filter: saturate(1.2) blur(10px);
    border-bottom: 1px solid var(--border-soft);
  }
  .topbar__title { font-size: 18px; font-weight: 600; letter-spacing: -0.015em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .topbar__crumbs { color: var(--text-muted); font-size: 12.5px; font-family: var(--font-mono); }
  .topbar__spacer { flex: 1; }
  .topbar__time {
    font-family: var(--font-mono); font-size: 13px; color: var(--text-soft);
    background: var(--bg-sunken); padding: 6px 10px; border-radius: var(--r-md);
    border: 1px solid var(--border-soft);
    display: flex; align-items: center; gap: 8px;
  }
  .time-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 0 4px color-mix(in srgb, var(--ok) 25%, transparent); }

  /* Top navigation (nav_style "top", the default): ONE bar replaces the
   * sidebar and the old topbar. Entries are icon-only chips; the active
   * one expands into a pill with its label, which also takes over the
   * screen-title role of the old topbar. On narrow screens the row
   * scrolls horizontally: hidden scrollbar, faded edges as affordance. */
  .app--topnav { grid-template-columns: 1fr; }
  /* Embed mode: a single screen, no chrome. Let the content set the height
   * instead of the app's 600px minimum, and trim the generous screen
   * padding so the card sits compactly on a normal dashboard. */
  .app--embed { grid-template-columns: 1fr; min-height: 0; }
  .content__inner--embed { padding: 16px 18px 20px; }
  .topnav {
    position: sticky; top: 0; z-index: 20;
    display: flex; align-items: center; gap: 10px;
    padding: 8px 14px;
    background: color-mix(in srgb, var(--bg) 86%, transparent);
    backdrop-filter: saturate(1.2) blur(10px);
    border-bottom: 1px solid var(--border-soft);
  }
  .topnav__brand {
    display: flex; align-items: center; gap: 8px; flex: 0 0 auto;
    font-weight: 700; font-size: 13.5px; letter-spacing: -0.01em;
  }
  .topnav__logo {
    width: 26px; height: 26px; border-radius: 8px; overflow: hidden;
    display: grid; place-items: center;
    /* No plate behind the mark: the brand icon is a self-contained round
     * medallion, an accent square behind it would fight its shape. The
     * background only shows for the "C" text fallback. */
    background: transparent; color: var(--accent);
    font-weight: 700; font-size: 12px;
  }
  .topnav__clock {
    font-family: var(--font-mono); font-size: 12px; color: var(--text-soft);
    display: flex; align-items: center; gap: 6px; font-weight: 500;
  }
  .nav-scroll {
    display: flex; align-items: center; gap: 4px;
    overflow-x: auto; flex: 1 1 auto; min-width: 0;
    scrollbar-width: none; -webkit-overflow-scrolling: touch;
    padding: 4px 2px;
    mask-image: linear-gradient(to right, transparent, black 14px, black calc(100% - 14px), transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 14px, black calc(100% - 14px), transparent);
  }
  .nav-scroll::-webkit-scrollbar { display: none; }
  .nav-sep { flex: 0 0 1px; height: 22px; background: var(--border); margin: 0 5px; }
  .nav-ic {
    flex: 0 0 auto;
    display: inline-flex; align-items: center; gap: 7px;
    height: 34px; padding: 0 9px;
    border-radius: var(--r-pill); border: 1px solid transparent;
    background: transparent; color: var(--text-soft);
    font-family: inherit; font-size: 12.5px; font-weight: 600;
    cursor: pointer; white-space: nowrap;
    transition: background 120ms, color 120ms;
  }
  .nav-ic:hover { background: var(--bg-sunken); color: var(--text); }
  .nav-ic svg { width: 17px; height: 17px; flex: none; }
  .nav-ic__lbl { display: none; }
  .nav-ic[data-active="true"] {
    background: var(--accent-soft); border-color: var(--accent); color: var(--accent-ink);
  }
  .nav-ic[data-active="true"] .nav-ic__lbl { display: inline; }
  .nav-ic--accent { color: var(--accent); }
  @media (max-width: 560px) {
    .topnav__name { display: none; }
  }

  .page-title { font-size: 26px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 4px; }
  .page-sub { color: var(--text-muted); font-size: 14px; margin: 0 0 22px; }

  /* Card */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: var(--density-pad);
    box-shadow: var(--shadow-xs);
    /* Same reason as the forecast row: as a flex item inside .col, the
     * default min-width auto equals min-content and can blow the card out
     * of the parent width when its inner content (a long horizontal strip,
     * a wide table, etc.) doesn't shrink. Setting min-width:0 lets the
     * card honour its parent's bounds. */
    min-width: 0;
  }
  .card--pad-lg { padding: 22px; }
  .card--ghost { background: var(--bg-soft); }
  .card__header { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .card__title { font-weight: 600; font-size: 15px; letter-spacing: -0.01em; margin: 0; }
  .card__sub { color: var(--text-muted); font-size: 12.5px; margin: 2px 0 0; }

  /* Button */
  .btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 8px 14px; border-radius: var(--r-md);
    border: 1px solid var(--border); background: var(--surface);
    font-size: 13px; font-weight: 500; color: var(--text);
    transition: background 120ms, border-color 120ms, transform 60ms;
  }
  .btn:hover { background: var(--bg-soft); }
  .btn:active { transform: translateY(1px); }
  .btn--primary { background: var(--accent); color: white; border-color: transparent; box-shadow: var(--shadow-sm); }
  .btn--primary:hover { background: color-mix(in srgb, var(--accent) 90%, black); }
  .btn--ghost { border-color: transparent; background: transparent; color: var(--text-soft); }
  .btn--ghost:hover { background: var(--bg-sunken); color: var(--text); }
  .btn--sm { padding: 5px 10px; font-size: 12px; }
  .btn--icon { padding: 8px; }
  .btn svg { width: 16px; height: 16px; }

  /* Chip */
  .chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 3px 9px; border-radius: var(--r-pill);
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    color: var(--text-soft); font-size: 11.5px; font-weight: 500;
  }
  .chip--accent { background: var(--accent-soft); color: var(--accent-ink); border-color: transparent; }
  .chip--weather { background: var(--weather-soft); color: var(--weather-ink); border-color: transparent; }
  .chip--on { background: color-mix(in srgb, var(--ok) 15%, transparent); color: var(--ok); border-color: transparent; }
  .chip svg { width: 11px; height: 11px; }
  .chip__dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }

  .tag {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 11px; font-family: var(--font-mono); color: var(--text-muted);
    padding: 2px 6px; border-radius: 5px; background: var(--bg-sunken);
  }

  /* Switch */
  .switch { position: relative; display: inline-block; width: 36px; height: 20px; cursor: pointer; }
  .switch input { display: none; }
  .switch__track {
    position: absolute; inset: 0; background: var(--border); border-radius: 999px;
    transition: background 150ms;
  }
  .switch__thumb {
    position: absolute; top: 2px; left: 2px; width: 16px; height: 16px;
    background: white; border-radius: 50%;
    transition: transform 180ms cubic-bezier(.2,.8,.2,1);
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  .switch input:checked ~ .switch__track { background: var(--accent); }
  .switch input:checked ~ .switch__thumb { transform: translateX(16px); }

  /* Input */
  .input, .select, .textarea {
    width: 100%; padding: 9px 12px; border-radius: var(--r-md);
    border: 1px solid var(--border); background: var(--surface);
    color: var(--text); font-size: 13px;
    transition: border-color 120ms, box-shadow 120ms;
  }
  .input:focus, .select:focus { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 18%, transparent); }
  /* Inline-editable text that must LOOK editable on hover: transparent at
   * rest, border + soft background under the pointer. Pair with an .edit-hint
   * icon in the same .row to make the affordance visible without hovering. */
  .input--ghost { border-color: transparent; background: transparent; }
  .input--ghost:hover { border-color: var(--border); background: var(--bg-soft); }
  .row:hover > .edit-hint, .input--ghost:hover ~ .edit-hint { color: var(--text-soft); }
  .edit-hint { color: var(--text-muted); opacity: 0.7; flex: 0 0 auto; display: inline-flex; cursor: pointer; }
  .field { display: flex; flex-direction: column; gap: 6px; }
  .field__label { font-size: 12px; font-weight: 500; color: var(--text-soft); }
  .field__hint { font-size: 11.5px; color: var(--text-muted); }

  /* Segmented */
  .segmented {
    display: inline-flex; padding: 3px;
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    border-radius: var(--r-md); gap: 2px;
  }
  .segmented button {
    padding: 6px 12px; border-radius: 7px; color: var(--text-soft);
    font-size: 12.5px; font-weight: 500;
    transition: background 120ms, color 120ms;
  }
  .segmented button[data-active="true"] {
    background: var(--surface); color: var(--text); box-shadow: var(--shadow-xs);
  }

  .divider { height: 1px; background: var(--border-soft); margin: 16px 0; border: 0; }

  /* Timeline */
  .timeline {
    position: relative; width: 100%; height: 88px;
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    border-radius: var(--r-md); overflow: hidden; user-select: none;
  }
  .timeline--compact { height: 36px; }
  .timeline--mini { height: 14px; border-radius: 7px; }

  .timeline__hours {
    position: absolute; inset: 0;
    display: grid; grid-template-columns: repeat(24, 1fr);
    pointer-events: none;
  }
  .timeline__hours > div { border-right: 1px solid color-mix(in srgb, var(--border) 50%, transparent); }
  .timeline__hours > div:nth-child(6n+1) { border-right-color: var(--border); }
  .timeline__hours > div:last-child { border-right: 0; }

  .timeline__labels {
    position: absolute; inset: 0; pointer-events: none;
    font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);
  }
  .timeline__labels span { position: absolute; bottom: 3px; transform: translateX(-50%); }

  .tl-block {
    position: absolute; top: 6px; bottom: 22px; border-radius: 6px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 8px; font-size: 11.5px; font-weight: 600; color: white;
    overflow: hidden; cursor: grab;
    transition: filter 120ms, box-shadow 120ms;
    border: 1.5px solid var(--block-edge);
    box-shadow: 0 1px 2px rgba(0,0,0,0.08);
    /* On touch devices the browser by default tries to scroll the page when
     * the finger drags on a non-scrollable element. touch-action: none stops
     * that, so our pointermove drag handlers can actually receive the events
     * and the user can move blocks on phones / tablets. */
    touch-action: none;
  }
  .tl-block:hover { filter: brightness(1.05); box-shadow: 0 2px 8px rgba(0,0,0,0.18); }
  .tl-block[data-selected="true"] { outline: 2px solid var(--accent); outline-offset: 2px; z-index: 2; }
  /* A block an active weather rule points at: amber glow AND a dot in the
   * corner. Both on purpose: the glow reads at a glance on a wide block,
   * the dot is what survives when the block is only a few pixels wide.
   * Selection already uses outline, so the glow can own box-shadow. */
  .tl-block[data-ruled="1"] {
    box-shadow: 0 0 0 1.5px color-mix(in srgb, var(--weather) 70%, transparent),
                0 0 10px 1px color-mix(in srgb, var(--weather) 55%, transparent);
  }
  .tl-block[data-ruled="1"]::after {
    content: ""; position: absolute; top: 3px; right: 4px;
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--weather); box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.35);
    pointer-events: none;
  }
  /* Mini keeps only the glow: a dot on a 12px-tall bar is just noise. */
  .timeline--mini .tl-block[data-ruled="1"]::after { display: none; }
  .timeline--compact .tl-block { top: 3px; bottom: 3px; font-size: 10.5px; padding: 0 6px; }
  .timeline--mini .tl-block { top: 0; bottom: 0; border-radius: 0; font-size: 0; border-width: 1px; }

  .tl-block__handle {
    position: absolute; top: 0; bottom: 0; width: 6px;
    cursor: ew-resize; background: rgba(255,255,255,0.0);
    transition: background 120ms;
  }
  .tl-block__handle:hover { background: rgba(255,255,255,0.25); }
  .tl-block__handle--l { left: 0; border-radius: 6px 0 0 6px; }
  .tl-block__handle--r { right: 0; border-radius: 0 6px 6px 0; }

  .tl-now {
    position: absolute; top: 0; bottom: 0; width: 2px;
    background: var(--danger); pointer-events: none;
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--danger) 20%, transparent);
  }
  .tl-now::before {
    content: ""; position: absolute; top: -4px; left: -4px;
    width: 10px; height: 10px; background: var(--danger); border-radius: 50%;
    border: 2px solid var(--bg);
  }

  .tl-weather { position: absolute; top: 0; left: 0; right: 0; height: 6px; }
  .tl-weather__cell { position: absolute; top: 0; bottom: 0; }
  .tl-weather__cell[data-state="rain"] { background: color-mix(in srgb, var(--info) 50%, transparent); }
  .tl-weather__cell[data-state="sun"] { background: color-mix(in srgb, var(--weather) 60%, transparent); }
  .tl-weather__cell[data-state="cloud"] { background: color-mix(in srgb, var(--text-muted) 30%, transparent); }
  .tl-weather__cell[data-state="snow"] { background: color-mix(in srgb, var(--info) 25%, transparent); }

  /* Radial */
  .radial { width: 100%; aspect-ratio: 1; max-width: 520px; margin: 0 auto; display: block; }
  .radial text { font-family: var(--font-mono); fill: var(--text-soft); }
  .radial .radial__label { font-family: var(--font-sans); fill: var(--text); font-weight: 700; }

  /* List timeline */
  .tl-list { display: flex; flex-direction: column; gap: 6px; }
  .tl-list__row {
    display: grid; grid-template-columns: 110px 1fr auto;
    align-items: center; gap: 14px; padding: 10px 12px;
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    border-radius: var(--r-md); cursor: pointer;
  }
  /* Selection: accent mixed over the theme background, NOT the fixed
   * light --accent-soft. --accent-soft without its --accent-ink pairing is
   * unreadable in dark mode (light background + the HA theme's light
   * text). */
  .tl-list__row[data-selected="true"] {
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 14%, var(--bg-sunken));
  }
  .tl-list__time { font-family: var(--font-mono); font-size: 13px; color: var(--text); font-weight: 500; }
  .tl-list__mode-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 8px; vertical-align: middle; }
  .tl-list__mode { font-size: 13px; font-weight: 500; }

  /* Week grid */
  .weekgrid { display: grid; gap: 6px; }
  .weekgrid__row { display: grid; grid-template-columns: 50px 1fr; gap: 8px; align-items: center; }
  .weekgrid__day { font-size: 12px; font-weight: 600; color: var(--text-soft); font-family: var(--font-mono); text-transform: uppercase; }

  /* Schedule card */
  .sched-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--r-lg); padding: 18px;
    display: flex; flex-direction: column; gap: 14px;
    transition: border-color 120ms, transform 120ms, box-shadow 120ms;
    cursor: pointer;
  }
  .sched-card:hover { border-color: color-mix(in srgb, var(--accent) 40%, var(--border)); box-shadow: var(--shadow-sm); }
  .sched-card[data-selected="true"] { border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 15%, transparent); }
  .sched-card__header { display: flex; align-items: center; gap: 12px; }
  .sched-card__title { font-size: 15.5px; font-weight: 600; letter-spacing: -0.01em; margin: 0; flex: 1; }
  .sched-card__sub { color: var(--text-muted); font-size: 12.5px; margin: 2px 0 0; font-family: var(--font-mono); }
  .sched-card__footer { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .sched-card__devices { display: flex; gap: 4px; }
  .device-icon-pill {
    width: 26px; height: 26px; border-radius: 7px;
    background: var(--bg-sunken); display: grid; place-items: center;
    color: var(--text-soft); border: 1px solid var(--border-soft);
  }
  .device-icon-pill svg { width: 14px; height: 14px; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--density-gap); }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--density-gap); }
  .grid-auto { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: var(--density-gap); }

  /* Device row */
  .device-row {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: var(--r-md);
    transition: background 120ms;
  }
  .device-row:hover { background: var(--bg-sunken); }
  .device-row__icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--bg-sunken); display: grid; place-items: center;
    color: var(--text-soft); border: 1px solid var(--border-soft);
    flex-shrink: 0;
  }
  .device-row__icon svg { width: 17px; height: 17px; }
  .device-row__main { flex: 1; min-width: 0; }
  .device-row__name { font-weight: 500; font-size: 13.5px; }
  .device-row__meta { font-size: 11.5px; color: var(--text-muted); font-family: var(--font-mono); }

  /* Rule builder */
  .rule-block {
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    border-radius: var(--r-md); padding: 14px;
    display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
  }
  .rule-block__label {
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
    padding: 3px 8px; border-radius: 5px;
  }
  .rule-block__label--if { background: var(--weather-soft); color: var(--weather-ink); }
  .rule-block__label--then { background: var(--accent-soft); color: var(--accent-ink); }
  .rule-token {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 7px; padding: 5px 10px; font-size: 12.5px;
  }
  .rule-token--accent { background: var(--accent-soft); border-color: transparent; color: var(--accent-ink); font-weight: 500; }
  .rule-token--weather { background: var(--weather-soft); border-color: transparent; color: var(--weather-ink); font-weight: 500; }
  /* Drop indicator while reordering rules manually. */
  .rule-block--dragover { box-shadow: inset 0 2px 0 0 var(--accent); }

  /* Sticky action bar for long builder forms: keeps Save/Cancel reachable
   * without scrolling to the very bottom of the page. Sits inside the
   * scrolling .content area, pinned to its bottom edge. */
  .builder-actions {
    position: sticky; bottom: 0; z-index: 5;
    display: flex; justify-content: flex-end; gap: 8px; align-items: center;
    padding: 12px 4px; margin-top: 4px;
    background: color-mix(in srgb, var(--bg) 90%, transparent);
    backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
    border-top: 1px solid var(--border-soft);
  }

  /* Live screen: weather hero with source switcher */
  .lv-hero {
    position: relative; overflow: hidden; padding: 18px;
    border-radius: var(--r-lg); border: 1px solid var(--border);
    background:
      radial-gradient(120% 140% at 85% -20%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 55%),
      radial-gradient(90% 120% at 10% 120%, color-mix(in srgb, var(--info) 15%, transparent), transparent 60%),
      var(--surface);
  }
  .lv-hero__icon {
    width: 56px; height: 56px; border-radius: 16px; flex: 0 0 auto;
    background: color-mix(in srgb, var(--weather) 22%, var(--surface));
    display: grid; place-items: center; color: var(--weather-ink);
  }
  .lv-temp {
    font-size: 48px; font-weight: 700; letter-spacing: -0.04em; line-height: 1;
    font-family: var(--font-mono);
  }
  .lv-temp__alt { font-size: 22px; color: var(--text-soft); margin-left: 4px; }
  .lv-cond { color: var(--text-soft); font-size: 14px; margin-top: 5px; }
  .lv-stats { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
  .lv-stat {
    background: color-mix(in srgb, var(--text) 4%, transparent);
    border: 1px solid var(--border-soft);
    border-radius: var(--r-md); padding: 8px 12px; min-width: 88px;
  }
  .lv-stat b { display: block; font-size: 15px; font-weight: 650; font-family: var(--font-mono); }
  .lv-stat .lbl { font-size: 10px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; }
  .lv-stat .cmp { display: block; font-size: 11px; color: var(--text-soft); font-family: var(--font-mono); margin-top: 2px; }
  .lv-delta {
    display: inline-block; margin-left: 5px; padding: 0 5px; border-radius: 6px;
    font-size: 9.5px; font-family: var(--font-mono); vertical-align: middle;
  }
  .lv-delta[data-lvl="ok"] { background: color-mix(in srgb, var(--ok) 15%, transparent); color: var(--ok); }
  .lv-delta[data-lvl="warn"] { background: color-mix(in srgb, var(--warn) 15%, transparent); color: var(--warn); }
  .lv-delta[data-lvl="bad"] { background: color-mix(in srgb, var(--danger) 15%, transparent); color: var(--danger); }
  .lv-src {
    padding: 3px 10px; border-radius: var(--r-pill); font-size: 11px; cursor: pointer;
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    color: var(--text-soft); font-family: inherit;
  }
  .lv-src[data-on="1"] { background: var(--accent-soft); border-color: var(--accent); color: var(--text); }

  /* Live hero: animated weather backdrop. Everything is transform /
   * opacity / background-position CSS loops behind the hero content,
   * capped at low opacity so the numbers stay readable. Rain drops are
   * individual elements with randomized inline styles (see live.ts);
   * the rest is static markup per condition. */
  .lv-hero > :not(.lv-fx) { position: relative; z-index: 1; }
  .lv-fx {
    position: absolute; inset: 0; z-index: 0;
    overflow: hidden; border-radius: inherit; pointer-events: none;
  }
  .lv-fx__glow {
    position: absolute; width: 440px; height: 440px; right: -130px; top: -170px; border-radius: 50%;
    background: radial-gradient(circle,
      color-mix(in srgb, var(--weather) 30%, transparent),
      color-mix(in srgb, var(--weather) 10%, transparent) 45%, transparent 70%);
    animation: lvfx-breathe 7s ease-in-out infinite;
  }
  .lv-fx__glow--night {
    background: radial-gradient(circle,
      color-mix(in srgb, var(--info) 20%, transparent),
      color-mix(in srgb, var(--info) 7%, transparent) 45%, transparent 70%);
  }
  @keyframes lvfx-breathe { 0%, 100% { transform: scale(1); opacity: .75; } 50% { transform: scale(1.14); opacity: 1; } }
  .lv-fx__cloud {
    position: absolute; height: 90px; border-radius: 999px;
    background: color-mix(in srgb, var(--text) 6%, transparent); filter: blur(17px);
    animation: lvfx-drift linear infinite;
  }
  @keyframes lvfx-drift { from { transform: translateX(-420px); } to { transform: translateX(1400px); } }
  .lv-fx__fog {
    position: absolute; left: -30%; width: 160%; height: 74px; border-radius: 999px;
    background: color-mix(in srgb, var(--text) 5%, transparent); filter: blur(22px);
    animation: lvfx-fogdrift 26s ease-in-out infinite alternate;
  }
  @keyframes lvfx-fogdrift { from { transform: translateX(-5%); } to { transform: translateX(5%); } }
  .lv-fx__drops { position: absolute; inset: -20%; transform: rotate(12deg); }
  .lv-fx__drops--storm { transform: rotate(18deg); }
  .lv-fx__drops i {
    position: absolute; top: -46px; display: block; border-radius: 1px;
    background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--info) 75%, transparent));
    animation: lvfx-drop linear infinite;
  }
  @keyframes lvfx-drop { to { transform: translateY(840px); } }
  .lv-fx__dim { position: absolute; inset: 0; background: rgba(8, 10, 16, 0.32); }
  .lv-fx__flash {
    position: absolute; inset: 0; opacity: 0;
    background: radial-gradient(80% 60% at 62% 0%,
      rgba(214, 226, 255, 0.85), rgba(160, 190, 255, 0.22) 55%, transparent 78%);
    animation: lvfx-lightning 7s infinite;
  }
  .lv-fx__flash--b { animation-delay: 3.4s; animation-duration: 9.5s; }
  @keyframes lvfx-lightning {
    0%, 96.4%, 100% { opacity: 0; }
    97% { opacity: .55; }
    97.5% { opacity: .06; }
    98.1% { opacity: .8; }
    99% { opacity: 0; }
  }
  .lv-fx__snow {
    position: absolute; inset: 0; opacity: .8;
    background-image:
      radial-gradient(2.1px 2.1px at 22% 24%, color-mix(in srgb, var(--text) 55%, transparent), transparent 60%),
      radial-gradient(1.7px 1.7px at 64% 58%, color-mix(in srgb, var(--text) 42%, transparent), transparent 60%),
      radial-gradient(1.4px 1.4px at 86% 12%, color-mix(in srgb, var(--text) 34%, transparent), transparent 60%),
      radial-gradient(1.9px 1.9px at 40% 80%, color-mix(in srgb, var(--text) 48%, transparent), transparent 60%);
    background-size: 150px 150px;
    animation: lvfx-snowfall 11s linear infinite;
  }
  .lv-fx__snow--far { background-size: 220px 220px; opacity: .5; animation: lvfx-snowfall-far 17s linear infinite; }
  @keyframes lvfx-snowfall { from { background-position: 0 0; } to { background-position: 150px 300px; } }
  @keyframes lvfx-snowfall-far { from { background-position: 0 0; } to { background-position: -220px 440px; } }
  @media (prefers-reduced-motion: reduce) {
    .lv-fx, .lv-fx * { animation: none !important; }
    .lv-fx__drops, .lv-fx__flash { display: none; }
  }

  /* Live screen: interactive hourly strip */
  .lv-hours { display: flex; gap: 4px; overflow-x: auto; padding-bottom: 6px; }
  .lv-hour {
    flex: 1 0 44px; border: 1px solid transparent; border-radius: var(--r-md);
    padding: 8px 3px 6px; text-align: center; cursor: pointer;
    background: transparent; color: var(--text); font-family: inherit;
  }
  .lv-hour:hover { background: var(--bg-sunken); }
  .lv-hour[data-sel="1"] { background: var(--accent-soft); border-color: var(--accent); }
  .lv-hour .h { font-size: 10px; color: var(--text-muted); }
  .lv-hour .ic { margin-top: 4px; }
  .lv-hour .ic svg { width: 16px; height: 16px; }
  .lv-hour .tp { font-size: 12.5px; font-weight: 650; margin-top: 2px; }
  .lv-hour .bar { width: 6px; margin: 5px auto 0; border-radius: 3px; opacity: 0.85; }
  .lv-hour .rn { font-size: 9px; color: var(--info); margin-top: 2px; min-height: 11px; }
  .lv-detail {
    display: flex; gap: 20px; flex-wrap: wrap; padding: 10px 4px 0;
    color: var(--text-soft); font-size: 12.5px;
    border-top: 1px solid var(--border-soft); margin-top: 6px;
  }
  .lv-detail b { color: var(--text); font-weight: 650; }
  .lv-detail span { display: inline-flex; align-items: center; gap: 5px; }

  /* KPI */
  .kpi { padding: 16px; border-radius: var(--r-lg); background: var(--surface); border: 1px solid var(--border); }
  .kpi__label { font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); font-weight: 600; }
  .kpi__value { font-size: 28px; font-weight: 700; letter-spacing: -0.03em; font-family: var(--font-mono); margin-top: 6px; }
  .kpi__delta { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

  .live-device {
    display: grid; grid-template-columns: 40px 1fr auto auto;
    gap: 12px; align-items: center; padding: 10px 12px;
    border-radius: var(--r-md); border: 1px solid var(--border-soft);
  }
  .live-device + .live-device { margin-top: 6px; }
  .live-device__bar { width: 80px; height: 6px; border-radius: 3px; background: var(--bg-sunken); overflow: hidden; }
  .live-device__bar > div { height: 100%; background: var(--accent); border-radius: 3px; transition: width 300ms; }

  /* Wizard */
  .wizard-stepper { display: flex; gap: 6px; margin-bottom: 24px; flex-wrap: wrap; }
  .wizard-step {
    flex: 1 1 0; min-width: 0;
    display: flex; align-items: center; gap: 10px;
    padding: 12px 14px; border-radius: var(--r-md);
    background: var(--bg-sunken); border: 1px solid var(--border-soft);
    font-size: 12.5px; color: var(--text-muted); font-weight: 500;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .wizard-step[data-state="active"] { background: var(--accent-soft); color: var(--accent-ink); border-color: transparent; }
  .wizard-step[data-state="done"] { background: color-mix(in srgb, var(--ok) 12%, transparent); color: var(--ok); border-color: transparent; }
  .wizard-step__num {
    width: 22px; height: 22px; border-radius: 50%;
    background: var(--surface); border: 1px solid var(--border);
    display: grid; place-items: center; font-size: 11px; font-weight: 600;
    font-family: var(--font-mono);
    flex-shrink: 0;
  }
  .wizard-step[data-state="done"] .wizard-step__num { background: var(--ok); color: white; border-color: transparent; }
  .wizard-step[data-state="active"] .wizard-step__num { background: var(--accent); color: white; border-color: transparent; }
  /* Narrow viewports: collapse the step labels except for the active one
   * so all six step indicators stay visible without overflowing. */
  @media (max-width: 700px) {
    .wizard-stepper { gap: 4px; }
    .wizard-step { padding: 8px 10px; gap: 6px; }
    .wizard-step > span:not(.wizard-step__num) { display: none; }
    .wizard-step[data-state="active"] > span:not(.wizard-step__num) { display: inline; }
  }

  .tile-pick {
    padding: 14px; border-radius: var(--r-lg); border: 1px solid var(--border);
    background: var(--surface); cursor: pointer;
    display: flex; flex-direction: column; gap: 8px;
    transition: border-color 120ms, background 120ms; text-align: left; width: 100%;
  }
  .tile-pick:hover { border-color: color-mix(in srgb, var(--accent) 30%, var(--border)); }
  .tile-pick[data-selected="true"] { border-color: var(--accent); background: color-mix(in srgb, var(--accent-soft) 60%, var(--surface)); }
  .tile-pick__icon {
    width: 34px; height: 34px; border-radius: 9px;
    background: var(--accent-soft); color: var(--accent-ink);
    display: grid; place-items: center;
  }
  .tile-pick__name { font-weight: 600; font-size: 13.5px; }
  .tile-pick__desc { color: var(--text-muted); font-size: 12px; }

  /* Modal overlay */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 300;
    display: grid; place-items: center; padding: 20px;
  }

  /* Utility */
  .row { display: flex; align-items: center; gap: 10px; }
  .col { display: flex; flex-direction: column; gap: 10px; }
  .sp-between { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .text-mute { color: var(--text-muted); }
  .text-soft { color: var(--text-soft); }
  .text-sm { font-size: 12.5px; }
  .text-xs { font-size: 11.5px; }
  .fw-600 { font-weight: 600; }
  .fw-500 { font-weight: 500; }
  .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* Editor 2-column layout (timeline + block detail). Stacks on tablet. */
  .editor-cols {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 18px;
  }

  /* Rule builder weather variables picker grid */
  .wr-vars { max-height: 380px; overflow-y: auto; padding-right: 4px; }

  @media (max-width: 1000px) {
    .editor-cols { grid-template-columns: 1fr; }
  }

  @media (max-width: 900px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .content__inner { padding: 18px 16px 40px; }
    .topbar { padding: 12px 16px; }
    .topbar__crumbs { display: none; }
    .topbar__title { font-size: 16px; }
  }

  @media (max-width: 600px) {
    .content__inner { padding: 14px 10px 30px; }
    .topbar { padding: 10px 12px; gap: 8px; }
    .topbar__title { font-size: 14px; }
    .page-title { font-size: 22px !important; }
    .page-sub { font-size: 12px !important; }
    .card { padding: 12px !important; }
    .card--pad-lg { padding: 16px !important; }
    .device-row { flex-wrap: wrap; gap: 8px; padding: 10px 8px !important; }
    .device-row__main { flex: 1 1 100%; min-width: 0; }
    .rule-block { flex-wrap: wrap; padding: 10px 8px !important; gap: 6px; }
    .timeline { height: 76px; }
    .radial { max-width: 360px; }
    .weekgrid__row { grid-template-columns: 38px 1fr; gap: 6px; }
    .kpi { padding: 12px; }
    .kpi__value { font-size: 22px; }
    .sched-card { padding: 12px; gap: 10px; }
    .grid-auto { grid-template-columns: 1fr !important; }
    /* Hourly strip on phone: keep the horizontal scroll but make the
     * tap targets a touch wider so fingers land on the right hour. */
    .lv-hour { flex-basis: 48px; }
    .lv-temp { font-size: 40px; }
    .wr-vars { max-height: 260px; }
    .segmented button { padding: 5px 8px; font-size: 11.5px; }
    .btn { padding: 7px 10px; font-size: 12.5px; }
  }
`;
