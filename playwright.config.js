const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.js',
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'node packages/backend/src/index.js',
      url: 'http://localhost:3030/',
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      command: 'BROWSER=none npm run start:frontend',
      url: 'http://localhost:3000/',
      reuseExistingServer: true,
      timeout: 120000,
    },
  ],
  // One browser only — Chromium — for fast, deterministic CI runs
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
