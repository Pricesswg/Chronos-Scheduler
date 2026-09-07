// Layout contract: every screen of the real card, with a fake backend, must
// render without errors and without horizontal overflow at phone widths, also
// with the system font scaled up. This is the class of bug behind issue #22:
// a row that could not wrap pushed the content past the card, and a touch
// then scrolled the whole screen sideways.
import { expect, test } from "@playwright/test";

const SCREENS = ["overview", "editor", "week", "live", "devices", "device", "history", "weatherRulesList", "weatherRule", "settings", "help", "wizard"];
const CASES = [
  { width: 1200, font: 1.0 },
  { width: 360, font: 1.0 },
  { width: 360, font: 1.3 },
  { width: 320, font: 1.0 },
  { width: 320, font: 1.3 },
];

for (const { width, font } of CASES) {
  test.describe(`${width}px, font ${Math.round(font * 100)}%`, () => {
    for (const screen of SCREENS) {
      test(screen, async ({ page }) => {
        const errors: string[] = [];
        page.on("pageerror", (e) => errors.push(e.message));
        await page.setViewportSize({ width, height: 800 });
        await page.goto("/");
        // The bundle is a large module: `load` can fire before it has run.
        await page.waitForFunction(() => typeof (window as any).__mount === "function");
        const mount = await page.evaluate(() => (window as any).__mount({}));
        expect(mount.error, "card load error").toBe("");
        const shown = await page.evaluate((s) => (window as any).__open(s), screen);
        expect(shown).toBe(screen);
        if (font !== 1) await page.evaluate((f) => (window as any).__scaleFonts(f), font);
        const probe = await page.evaluate(() => (window as any).__probe());
        expect(errors, "page errors").toEqual([]);
        expect(probe.contentOverflow, `content overflow, culprits: ${JSON.stringify(probe.culprits)}`).toBe(0);
        expect(probe.documentOverflow, "document overflow").toBe(0);
      });
    }
  });
}
