import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  // Serial on purpose. The career-mode tests drive a real-time canvas game, and
  // the engine clamps its per-frame delta — so when parallel workers starve the
  // frame rate, game time advances slower than wall clock and input timing
  // stops lining up. Giving the run one worker keeps gameplay deterministic.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  // One retry: the career-mode gameplay test drives a physics platformer with
  // scripted input, so whether a given jump lands a stomp is genuinely
  // stochastic. Retrying covers that without masking a product failure — every
  // other test in the suite is deterministic and passes first time.
  retries: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
