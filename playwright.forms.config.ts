import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests/e2e/forms',
  fullyParallel: false, // Run sequentially for easier debugging and DB state
  reporter: [['list'], ['html', { open: 'never' }]],
  // globalSetup: require.resolve('./tests/e2e/global-setup.ts'),
  use: {
    baseURL: 'http://localhost:3000',
    bypassCSP: true,
    // Capture requirements
    trace: 'on',
    screenshot: 'on',
    video: 'retain-on-failure',
    // Network HAR capture
    recordHar: {
      path: path.join(__dirname, 'test-results', 'network.har'),
      mode: 'full',
    },
  },
  projects: [
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ]
});
