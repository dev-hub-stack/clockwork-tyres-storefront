import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './playwright/tests',
  fullyParallel: false,
  timeout: 60_000,
  use: {
    baseURL: 'http://127.0.0.1:4300',
    headless: true,
    trace: 'retain-on-failure'
  },
  webServer: [
    {
      command: 'powershell -NoProfile -ExecutionPolicy Bypass -File ./playwright/start-backend-e2e.ps1',
      url: 'http://127.0.0.1:8001',
      reuseExistingServer: false,
      timeout: 240_000
    },
    {
      command: 'npm run start:e2e',
      url: 'http://127.0.0.1:4300',
      reuseExistingServer: false,
      timeout: 180_000
    }
  ]
});
