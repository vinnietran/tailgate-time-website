import { defineConfig, devices } from "@playwright/test";
import { loadEnv } from "vite";

const PORT = 4173;
const baseURL = `http://127.0.0.1:${PORT}`;
const env = loadEnv("", process.cwd(), "");
const e2eMode = process.env.PLAYWRIGHT_E2E_MODE === "qa" ? "qa" : "mock";

[
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_FIREBASE_MEASUREMENT_ID",
  "MAPS_API_KEY"
].forEach((key) => {
  if (!process.env[key] && env[key]) {
    process.env[key] = env[key];
  }
});

const webServerCommand =
  e2eMode === "qa"
    ? [
        `VITE_CONNECT_RETURN_URL=${baseURL}/#/account`,
        `VITE_CONNECT_REFRESH_URL=${baseURL}/#/tailgates/new`,
        `npm run dev -- --host 127.0.0.1 --port ${PORT}`
      ].join(" ")
    : `VITE_E2E_MOCK_FIREBASE=true npm run dev -- --host 127.0.0.1 --port ${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: e2eMode !== "qa",
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  workers: e2eMode === "qa" ? 1 : undefined,
  use: {
    baseURL,
    geolocation: {
      latitude: 40.4468,
      longitude: -79.9901
    },
    permissions: ["geolocation"],
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1100 }
      }
    },
    {
      name: "mobile-chrome",
      use: {
        ...devices["Pixel 5"]
      }
    }
  ],
  webServer: {
    command: webServerCommand,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
