import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173/cinematheca/",
    trace: "retain-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: {
    command: "npx vite preview --host 127.0.0.1 --port 4173 --outDir docs",
    url: "http://127.0.0.1:4173/cinematheca/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000
  }
});
