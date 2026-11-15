import { defineConfig } from '@playwright/test';
import { USER_AGENTS } from '../../helpers/remote';

// Level 3 for the web TVs: the real production bundle (dist/) in a real
// Chromium, loaded from file:// exactly like a packaged webOS/Tizen app.
// One project per TV so each runs with its own user agent and remote keys.
//
//   npm run test:e2e:web                    both TVs
//   npx playwright test -c testing/e2e/web --project lg-webos
//
// Set E2E_SKIP_BUILD=1 to reuse an existing dist/.
const tv = { viewport: { width: 1920, height: 1080 } };

export default defineConfig({
  testDir: '.',
  testMatch: '**/*.spec.ts',
  globalSetup: require.resolve('./global-setup'),
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never', outputFolder: '../../../test-results/e2e-web-report' }]] : 'list',
  outputDir: '../../../test-results/e2e-web',
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'lg-webos',
      use: { ...tv, userAgent: USER_AGENTS['lg-webos'] },
    },
    {
      name: 'samsung-tizen',
      use: { ...tv, userAgent: USER_AGENTS['samsung-tizen'] },
    },
  ],
});
