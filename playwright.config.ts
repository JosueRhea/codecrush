import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",

  timeout: 30 * 1000,
  use: {
    actionTimeout: 30000,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "Safari",
      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],
  webServer: {
    command: "pnpm run dev:core",
    port: 5173,
    reuseExistingServer: true,
  },
};

export default config;
