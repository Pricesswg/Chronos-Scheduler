// Behaviour of the card against the fake backend: what the user sees and
// which API calls a click produces. Playwright locators pierce shadow DOM.
import { expect, test } from "@playwright/test";

async function mount(page, screen: string) {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto("/");
  await page.waitForFunction(() => typeof (window as any).__mount === "function");
  const m = await page.evaluate(() => (window as any).__mount({ host: "card" }));
  expect(m.error).toBe("");
  await page.evaluate((s) => (window as any).__open(s), screen);
}

test("the editor flags a device shared with another schedule", async ({ page }) => {
  await mount(page, "editor");
  const box = page.locator("chronos-editor [data-conflicts]");
  await expect(box).toHaveAttribute("data-conflicts", "1");
  await expect(box).toContainText("Irrigazione zona 1 bis");
  await expect(box).toContainText("Valvola giardino 1");
});

test("the overview shows conflicts and pauses, and pause buttons call the API", async ({ page }) => {
  await mount(page, "overview");
  const cards = page.locator("chronos-overview .sched-card");
  await expect(cards.nth(0)).toContainText("Conflitti: 1");
  await expect(cards.nth(1)).toContainText("In pausa fino a");
  await expect(cards.nth(2)).not.toContainText("In pausa");

  // Resume s2 straight from its card.
  await cards.nth(1).locator('button[data-action="pause"]').click();
  await expect(cards.nth(1)).not.toContainText("In pausa fino a");
  const log = await page.evaluate(() => (window as any).__wsLog.filter((m) => m.type === "chronos/schedules/pause"));
  expect(log).toEqual([{ type: "chronos/schedules/pause", schedule_id: "s2", until: null }]);

  // Skip today on s1 through the modal.
  await cards.nth(0).locator('button[data-action="pause"]').click();
  const modal = page.locator("chronos-pause-modal");
  await expect(modal).toContainText("Metti in pausa Irrigazione mattina zona 1");
  await modal.locator('button[data-preset="skip_today"]').click();
  await expect(modal).toHaveCount(0);
  await expect(cards.nth(0)).toContainText("In pausa fino a");
  const last = await page.evaluate(() => (window as any).__wsLog.filter((m) => m.type === "chronos/schedules/pause").pop());
  expect(last.schedule_id).toBe("s1");
  expect(last.until).toMatch(/^\d{4}-\d{2}-\d{2}T00:00:00$/);
});

test("the editor pause button resumes a paused schedule", async ({ page }) => {
  await mount(page, "editor");
  await page.evaluate(() => (window as any).__card.selectSchedule("s2", "editor"));
  const btn = page.locator('chronos-editor button[data-action="pause"]');
  await expect(btn).toContainText("Riprendi");
  await btn.click();
  await expect(btn).toContainText("Pausa");
});
