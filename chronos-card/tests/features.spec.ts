// Behaviour of the card against the fake backend: what the user sees and
// which API calls a click produces. Playwright locators pierce shadow DOM.
import { expect, test } from "@playwright/test";

/** Overview card by schedule name: the grid order depends on the groups. */
const card = (page, name: string) => page.locator("chronos-overview .sched-card").filter({ hasText: name });
const S1 = "Irrigazione mattina zona 1", S2 = "Luci sera con presenza simulata", S3 = "Riscaldamento soggiorno inverno";

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
  await expect(card(page, S1)).toContainText("Conflitti: 1");
  await expect(card(page, S2)).toContainText("In pausa fino a");
  await expect(card(page, S3)).not.toContainText("In pausa");

  // Resume s2 straight from its card.
  await card(page, S2).locator('button[data-action="pause"]').click();
  await expect(card(page, S2)).not.toContainText("In pausa fino a");
  const log = await page.evaluate(() => (window as any).__wsLog.filter((m) => m.type === "chronos/schedules/pause"));
  expect(log).toEqual([{ type: "chronos/schedules/pause", schedule_id: "s2", until: null }]);

  // Skip today on s1 through the modal.
  await card(page, S1).locator('button[data-action="pause"]').click();
  const modal = page.locator("chronos-pause-modal");
  await expect(modal).toContainText("Metti in pausa Irrigazione mattina zona 1");
  await modal.locator('button[data-preset="skip_today"]').click();
  await expect(modal).toHaveCount(0);
  await expect(card(page, S1)).toContainText("In pausa fino a");
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

test("the mode selector switches the mode and idles the schedules of other modes", async ({ page }) => {
  await mount(page, "overview");
  await expect(card(page, S2).locator('[data-role="idle"]')).toContainText("Ferma in Casa");
  await page.locator('chronos-overview [data-role="mode"] button[data-mode="away"]').click();
  await expect(page.locator('chronos-overview [data-role="mode"] button[data-mode="away"]')).toHaveAttribute("data-active", "true");
  await expect(card(page, S2).locator('[data-role="idle"]')).toHaveCount(0);
  const log = await page.evaluate(() => (window as any).__wsLog.filter((m) => m.type === "chronos/mode/set"));
  expect(log).toEqual([{ type: "chronos/mode/set", mode: "away" }]);
});

test("the editor offers to limit a presence block to Away", async ({ page }) => {
  await mount(page, "editor");
  await page.evaluate(() => (window as any).__card.selectSchedule("s2", "editor"));
  const modes = page.locator('chronos-editor [data-role="modes"]');
  await expect(modes.locator('button[data-mode="away"]')).toHaveAttribute("data-active", "true");
  await expect(modes.locator('button[data-mode="home"]')).toHaveAttribute("data-active", "false");
  // s1 is unrestricted: all three active, and the presence hint is not shown.
  await page.evaluate(() => (window as any).__card.selectSchedule("s1", "editor"));
  await expect(page.locator('chronos-editor [data-role="modes"] button[data-active="true"]')).toHaveCount(3);
});

test("a rule can compare an on/off entity to one of its states", async ({ page }) => {
  await mount(page, "weatherRule");
  const rule = page.locator("chronos-weather-rule");
  const sensorSelect = rule.locator("select").filter({ has: page.locator('option[value="binary_sensor.workday_sensor"]') }).first();
  await sensorSelect.selectOption("binary_sensor.workday_sensor");
  const value = rule.locator('select[data-role="state-value"]').first();
  await expect(value).toHaveCount(1);
  await expect(value.locator("option")).toHaveText(["on", "off"]);
  await expect(rule).toContainText("Giorno lavorativo");
});

test("the legacy navigation inside the panel offers the HA menu on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await page.waitForFunction(() => typeof (window as any).__mount === "function");
  const m = await page.evaluate(() => (window as any).__mount({ host: "panel", narrow: true, settings: { nav_style: "sidebar" } }));
  expect(m.error).toBe("");
  await page.evaluate(() => { (window as any).__menu = 0; document.addEventListener("hass-toggle-menu", () => { (window as any).__menu++; }); });
  const btn = page.locator('chronos-card .topbar button[data-role="ha-menu"]');
  await expect(btn).toHaveCount(1);
  await btn.click();
  expect(await page.evaluate(() => (window as any).__menu)).toBe(1);
});

test("the map source is selectable and a custom template gets its own field", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto("/");
  await page.waitForFunction(() => typeof (window as any).__mount === "function");
  const m = await page.evaluate(() => (window as any).__mount({ host: "card", settings: { live_map: true } }));
  expect(m.error).toBe("");
  await page.evaluate(() => (window as any).__open("settings"));
  const select = page.locator('chronos-settings-screen select[data-role="map-source"]');
  await expect(select).toHaveCount(1);
  await expect(select.locator("option")).toHaveCount(4);
  await expect(select).toHaveValue("esri");
  await select.selectOption("custom");
  const url = page.locator('chronos-settings-screen input[data-role="map-custom-url"]');
  await expect(url).toHaveCount(1);
  await url.fill("https://tiles.example.org/{z}/{x}/{y}.png");
  await url.press("Tab");
  const log = await page.evaluate(() => (window as any).__wsLog.filter((x) => x.type === "chronos/settings/update").map((x) => x.patch));
  expect(log[0]).toEqual({ map_source: "custom" });
  expect(log[log.length - 1]).toEqual({ map_custom_url: "https://tiles.example.org/{z}/{x}/{y}.png" });
});

test("the overview groups schedules under collapsible headers and remembers the state", async ({ page }) => {
  await mount(page, "overview");
  const heads = page.locator("chronos-overview .group-head");
  await expect(heads).toHaveText([/Giardino/, /Riscaldamento/, /Senza gruppo/]);
  await expect(heads.nth(0).locator(".tag")).toHaveText("2/2");
  await expect(page.locator("chronos-overview .sched-card")).toHaveCount(5);
  await heads.nth(0).click();
  await expect(heads.nth(0)).toHaveAttribute("data-collapsed", "true");
  await expect(page.locator("chronos-overview .sched-card")).toHaveCount(3);
  // A fresh mount on the same origin reads the collapsed state back.
  await page.evaluate(() => (window as any).__mount({ host: "card" }));
  await page.evaluate(() => (window as any).__open("overview"));
  await expect(page.locator("chronos-overview .group-head").nth(0)).toHaveAttribute("data-collapsed", "true");
  await page.locator("chronos-overview .group-head").nth(0).click();
  await expect(page.locator("chronos-overview .sched-card")).toHaveCount(5);
});

test("grouping by device type and flat layout follow the setting", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 900 });
  await page.goto("/");
  await page.waitForFunction(() => typeof (window as any).__mount === "function");
  await page.evaluate(() => (window as any).__mount({ host: "card", settings: { overview_group_by: "type" } }));
  await page.evaluate(() => (window as any).__open("overview"));
  await expect(page.locator("chronos-overview .group-head")).toHaveText([/Luce/, /Presa/, /Termostato/]);
  await expect(page.locator('chronos-overview [data-key="light"] .sched-card')).toHaveCount(2);
  await page.evaluate(() => (window as any).__mount({ host: "card", settings: { overview_group_by: "none" } }));
  await page.evaluate(() => (window as any).__open("overview"));
  await expect(page.locator("chronos-overview .group-head")).toHaveCount(0);
  await expect(page.locator("chronos-overview .sched-card")).toHaveCount(5);
});

test("the week view filters by group and the editor offers the groups in use", async ({ page }) => {
  await mount(page, "week");
  await page.locator('chronos-week [data-role="group-filter"] button[data-group="Riscaldamento"]').click();
  const schedChip = (name: string) => page.locator("chronos-week .chip:not([data-group])").filter({ hasText: name });
  await expect(schedChip(S3).locator("svg")).toHaveCount(1, { timeout: 5000 });
  await expect(schedChip(S1).locator("svg")).toHaveCount(0);

  await page.evaluate(() => (window as any).__card.selectSchedule("s2", "editor"));
  const field = page.locator('chronos-editor [data-role="group"]');
  await expect(field.locator("button[data-group]")).toHaveText(["Giardino", "Riscaldamento"]);
  await field.locator('button[data-group="Giardino"]').click();
  expect(await page.evaluate(() => (window as any).__card._schedules.find((s) => s.id === "s2").group)).toBe("Giardino");
  await expect(field.locator("button[data-group]")).toHaveText(["Riscaldamento"]);
});

test("a group has a colour, shown on its header, its tags and the week chips", async ({ page }) => {
  await mount(page, "overview");
  const giardino = page.locator('chronos-overview [data-role="group"][data-key="Giardino"] .group-head .group-dot');
  await expect(giardino).toHaveCSS("background-color", "rgb(67, 160, 71)");
  await expect(page.locator('chronos-overview [data-role="group"][data-key="Riscaldamento"] .group-head .group-dot')).toHaveCount(0);
  // Under its own header the card carries no tag; grouped by type it does.
  await expect(page.locator('chronos-overview [data-role="group-tag"]')).toHaveCount(0);
  await page.evaluate(() => (window as any).__mount({ host: "card", settings: { overview_group_by: "type" } }));
  await page.evaluate(() => (window as any).__open("overview"));
  const tag = card(page, S1).locator('[data-role="group-tag"]');
  await expect(tag).toHaveText(/Giardino/);
  await expect(tag).toHaveCSS("background-color", "rgb(67, 160, 71)");

  // The editor palette writes the colour to the settings.
  await page.evaluate(() => (window as any).__card.selectSchedule("s3", "editor"));
  const palette = page.locator('chronos-editor [data-role="group-color"]');
  await expect(palette.locator('.group-swatch[data-active="true"]')).toHaveAttribute("data-color", "");
  await palette.locator('.group-swatch[data-color="#1e88e5"]').click();
  await expect(palette.locator('.group-swatch[data-active="true"]')).toHaveAttribute("data-color", "#1e88e5");
  const last = await page.evaluate(() => (window as any).__wsLog.filter((m) => m.type === "chronos/settings/update").pop());
  expect(last.patch.group_colors).toEqual({ Giardino: "#43a047", Riscaldamento: "#1e88e5" });

  await page.evaluate(() => (window as any).__open("week"));
  await expect(page.locator('chronos-week [data-role="group-filter"] button[data-group="Riscaldamento"]')).toHaveCSS("background-color", "rgb(30, 136, 229)");
});

test("rules are no longer called weather rules, and the safety-off field is offered", async ({ page }) => {
  await mount(page, "overview");
  for (const screen of ["overview", "weatherRulesList", "editor"]) {
    await page.evaluate((s) => (window as any).__open(s), screen);
    const text = await page.locator("chronos-card").innerText();
    expect(text, screen).not.toMatch(/regol[ae] meteo/i);
  }
  await expect(page.locator("chronos-card .topnav")).toContainText("Regole");
  const field = page.locator('chronos-editor [data-role="manual-off"] input');
  await expect(field).toHaveValue("45");
  await field.fill("30");
  await field.dispatchEvent("change");
  expect(await page.evaluate(() => (window as any).__card._schedules.find((s) => s.id === "s1").manual_off_min)).toBe(30);
});

test("schedules of different modes are not in conflict, and the warnings can be switched off", async ({ page }) => {
  await mount(page, "editor");
  // s2 (Away only) and s5 (Home only) drive the same light at the same
  // hours: no conflict, in either direction.
  await page.evaluate(() => (window as any).__card.selectSchedule("s5", "editor"));
  await expect(page.locator("chronos-editor [data-conflicts]")).toHaveCount(0);
  await page.evaluate(() => (window as any).__card.selectSchedule("s2", "editor"));
  await expect(page.locator("chronos-editor [data-conflicts]")).toHaveCount(0);

  // The check still fires when the modes do overlap: s1 and s4 both run in
  // every mode on the same valve.
  await page.evaluate(() => (window as any).__card.selectSchedule("s1", "editor"));
  await expect(page.locator("chronos-editor [data-conflicts]")).toHaveAttribute("data-conflicts", "1");

  // The setting hides what is left, in the editor and in the overview.
  await page.evaluate(() => (window as any).__mount({ host: "card", settings: { conflict_warnings: false } }));
  await page.evaluate(() => (window as any).__open("overview"));
  await expect(page.locator("chronos-overview .chip--conflict")).toHaveCount(0);
  await page.evaluate(() => (window as any).__card.selectSchedule("s1", "editor"));
  await expect(page.locator("chronos-editor [data-conflicts]")).toHaveCount(0);
});

test("the overlap warnings toggle lives in Settings", async ({ page }) => {
  await mount(page, "settings");
  const row = page.locator('chronos-settings-screen [data-role="conflict-warnings"]');
  await expect(row).toContainText("Avvisi di sovrapposizione");
  await expect(row.locator("input")).toBeChecked();
  await row.locator("label.switch").click();
  const last = await page.evaluate(() => (window as any).__wsLog.filter((m) => m.type === "chronos/settings/update").pop());
  expect(last.patch).toEqual({ conflict_warnings: false });
});

test("a schedule holding a device of another type says so, and that device is not a conflict", async ({ page }) => {
  await mount(page, "editor");
  // Reproduce what older wizards produced (issue #29 follow-up): the Smart
  // plug schedule s4 also holds the thermostat d3, which the enabled
  // thermostat schedule s3 drives at overlapping times.
  await page.evaluate(() => {
    const c = (window as any).__card;
    c.updateScheduleLocal("s3", { enabled: true });
    c.updateScheduleLocal("s4", { device_ids: ["d1", "d3"] });
    c.selectSchedule("s4", "editor");
  });
  const foreign = page.locator("chronos-editor [data-foreign]");
  await expect(foreign).toHaveAttribute("data-foreign", "1");
  await expect(foreign).toContainText("Termostato soggiorno");
  // The thermostat is not driven by s4, so the only conflict left is the
  // valve d1 it shares with s1.
  const box = page.locator("chronos-editor [data-conflicts]");
  await expect(box).toHaveAttribute("data-conflicts", "1");
  await expect(box).not.toContainText("Termostato");
});

test("the wizard locks the device type after the first pick", async ({ page }) => {
  await mount(page, "wizard");
  const wizard = page.locator("chronos-wizard");
  // Step 0 is the name / import step: move to the devices step.
  await page.evaluate(() => {
    const w = (window as any).__card.shadowRoot.querySelector("chronos-wizard");
    w._step = 1;
  });
  await expect(wizard.locator('[data-role="type-lock"]')).toHaveCount(0);
  await wizard.locator('.tile-pick[data-device="d1"]').click();
  await expect(wizard.locator('[data-role="type-lock"]')).toContainText("Presa");
  await expect(wizard.locator('.tile-pick[data-device="d3"]')).toBeDisabled();
  await expect(wizard.locator('.tile-pick[data-device="d2"]')).toBeDisabled();
  // Deselecting frees every type again.
  await wizard.locator('.tile-pick[data-device="d1"]').click();
  await expect(wizard.locator('.tile-pick[data-device="d3"]')).toBeEnabled();
});

test("modes are user-defined: rename, add, refuse duplicates, guard modes in use", async ({ page }) => {
  await mount(page, "settings");
  const box = page.locator('chronos-settings-screen [data-role="modes-settings"]');
  await expect(box.locator("[data-mode-row]")).toHaveCount(3);
  // The current mode (home) and a mode in use (away, by s2) cannot go.
  await expect(box.locator('[data-mode-row="home"] [data-action="delete-mode"]')).toBeDisabled();
  await expect(box.locator('[data-mode-row="away"] [data-action="delete-mode"]')).toBeDisabled();
  await expect(box.locator('[data-mode-row="holiday"] [data-action="delete-mode"]')).toBeEnabled();
  const updates = () => page.evaluate(() => (window as any).__wsLog.filter((m) => m.type === "chronos/settings/update"));

  const home = box.locator('[data-mode-row="home"] input');
  await home.fill("Estate");
  await home.dispatchEvent("change");
  await expect.poll(async () => (await updates()).length).toBe(1);
  expect((await updates())[0].patch.modes).toEqual([
    { id: "home", name: "Estate" }, { id: "away", name: "" }, { id: "holiday", name: "" },
  ]);

  await box.locator('[data-role="new-mode"]').fill("Natale");
  await box.locator('[data-action="add-mode"]').click();
  await expect.poll(async () => (await updates()).length).toBe(2);
  expect((await updates())[1].patch.modes.at(-1)).toEqual({ id: "natale", name: "Natale" });
  await expect(box.locator("[data-mode-row]")).toHaveCount(4);

  // A duplicate name is refused before reaching the backend.
  await box.locator('[data-role="new-mode"]').fill("estate");
  await box.locator('[data-action="add-mode"]').click();
  await expect(box.locator('[data-role="modes-error"]')).toBeVisible();
  expect((await updates()).length).toBe(2);

  // The overview selector and the editor chips follow the list.
  await page.evaluate(() => (window as any).__open("overview"));
  await expect(page.locator('chronos-overview [data-role="mode"] button')).toHaveText(["Estate", "Fuori", "Vacanza", "Natale"]);
  await page.evaluate(() => (window as any).__card.selectSchedule("s1", "editor"));
  await expect(page.locator('chronos-editor [data-role="modes"] button[data-active="true"]')).toHaveCount(4);
});
