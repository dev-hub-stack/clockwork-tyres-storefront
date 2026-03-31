import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/tests',
  fullyParallel: true,
  timeout: 30_000,
  use: {
    baseURL: 'http://localhost:4200',
    headless: true,
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'npm run start -- --host localhost',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
    timeout: 120_000
  }
});
