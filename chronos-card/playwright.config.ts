import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  reporter: "list",
  // Never reuse a server already on the port: another project's dev server
  // would be probed instead of this card, silently. Fail fast instead.
  webServer: { command: "node tests/serve.mjs", port: 8917, reuseExistingServer: false },
  use: { baseURL: "http://localhost:8917" },
});
