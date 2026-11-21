import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  // The dev server compiles each page the first time it's visited, which can be slow
  timeout: 60_000,
  expect: { timeout: 15_000 },
  workers: process.env.CI ? 1 : 2,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    // The site's home timezone, so time-of-day tests are predictable
    timezoneId: 'America/Winnipeg',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      // Sample posts: no real feeds, same results every run
      NEWS_PREVIEW: 'sample',
      // No Jamendo calls from tests (the player stays hidden); unit tests cover the music
      JAMENDO_CLIENT_ID: '',
      MOON_PREVIEW: '',
      MOON_PREVIEW_DATE: '',
      SUN_PREVIEW: '',
    },
  },
});
