import { svg, SVGTemplateResult } from "lit";

/** Tiny hand-drawn SVG flags for the language picker. Deliberately not
 * emoji: Windows renders flag emoji as bare letter pairs, which would
 * duplicate the label next to them. Each flag is a 15x11 rect composition
 * clipped to rounded corners; colors are the official flag colors, fixed
 * (flags don't follow the theme). */
function flagSvg(size: number, id: string, body: SVGTemplateResult): SVGTemplateResult {
  const w = size;
  const h = Math.round(size * 0.73);
  return svg`<svg width="${w}" height="${h}" viewBox="0 0 15 11" style="flex-shrink:0;vertical-align:-1px">
    <defs><clipPath id="cf-${id}"><rect width="15" height="11" rx="1.6"/></clipPath></defs>
    <g clip-path="url(#cf-${id})">${body}</g>
    <rect width="15" height="11" rx="1.6" fill="none" stroke="rgba(0,0,0,0.25)" stroke-width="0.5"/>
  </svg>`;
}

export function langFlag(lang: string, size = 14): SVGTemplateResult | typeof svg.prototype {
  switch (lang) {
    case "it":
      return flagSvg(size, "it", svg`
        <rect width="5" height="11" fill="#009246"/>
        <rect x="5" width="5" height="11" fill="#ffffff"/>
        <rect x="10" width="5" height="11" fill="#ce2b37"/>`);
    case "fr":
      return flagSvg(size, "fr", svg`
        <rect width="5" height="11" fill="#0055a4"/>
        <rect x="5" width="5" height="11" fill="#ffffff"/>
        <rect x="10" width="5" height="11" fill="#ef4135"/>`);
    case "en":
      // Simplified Union Jack: blue field, white/red diagonals, white/red cross.
      return flagSvg(size, "en", svg`
        <rect width="15" height="11" fill="#012169"/>
        <path d="M0 0 L15 11 M15 0 L0 11" stroke="#ffffff" stroke-width="2.2"/>
        <path d="M0 0 L15 11 M15 0 L0 11" stroke="#c8102e" stroke-width="0.9"/>
        <path d="M7.5 0 V11 M0 5.5 H15" stroke="#ffffff" stroke-width="3.4"/>
        <path d="M7.5 0 V11 M0 5.5 H15" stroke="#c8102e" stroke-width="1.8"/>`);
    case "de":
      return flagSvg(size, "de", svg`
        <rect width="15" height="3.67" fill="#000000"/>
        <rect y="3.67" width="15" height="3.66" fill="#dd0000"/>
        <rect y="7.33" width="15" height="3.67" fill="#ffce00"/>`);
    case "es":
      return flagSvg(size, "es", svg`
        <rect width="15" height="11" fill="#f1bf00"/>
        <rect width="15" height="2.75" fill="#aa151b"/>
        <rect y="8.25" width="15" height="2.75" fill="#aa151b"/>`);
    case "pt":
      return flagSvg(size, "pt", svg`
        <rect width="6" height="11" fill="#046a38"/>
        <rect x="6" width="9" height="11" fill="#da291c"/>
        <circle cx="6" cy="5.5" r="2.1" fill="#ffe900"/>
        <circle cx="6" cy="5.5" r="1.2" fill="#da291c"/>`);
    case "nl":
      return flagSvg(size, "nl", svg`
        <rect width="15" height="3.67" fill="#ae1c28"/>
        <rect y="3.67" width="15" height="3.66" fill="#ffffff"/>
        <rect y="7.33" width="15" height="3.67" fill="#21468b"/>`);
    case "pl":
      return flagSvg(size, "pl", svg`
        <rect width="15" height="5.5" fill="#ffffff"/>
        <rect y="5.5" width="15" height="5.5" fill="#dc143c"/>`);
    default:
      return svg``;
  }
}

/** Simplified Home Assistant mark (house with circuit nodes) in the HA
 * brand blue, for the "follow Home Assistant" language option. Fixed
 * color on purpose: it is a logo, not a themed glyph. */
export function haLogo(size = 14): SVGTemplateResult {
  return svg`<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="flex-shrink:0;vertical-align:-2px">
    <path fill="#18bcf2" d="M12 2.4 1.8 12.2h2.9v9h14.6v-9h2.9L12 2.4z"/>
    <g stroke="#ffffff" stroke-width="1.3" fill="none">
      <path d="M12 8.4v10.2"/>
      <path d="M12 13.8l-3.4 3.4"/>
      <path d="M12 12.2l3.4 3.4"/>
    </g>
    <g fill="#ffffff">
      <circle cx="12" cy="8.2" r="1.35"/>
      <circle cx="8.4" cy="17.4" r="1.35"/>
      <circle cx="15.6" cy="15.8" r="1.35"/>
    </g>
  </svg>`;
}
