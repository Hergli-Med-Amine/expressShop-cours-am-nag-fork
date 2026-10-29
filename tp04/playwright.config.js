const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests/e2e',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:3000',
    // Sur votre poste : le navigateur Edge déjà installé.
    // Dans GitHub Actions (variable CI définie) : le Chromium installé par Playwright.
    channel: process.env.CI ? undefined : 'msedge',
  },
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000/products',
    reuseExistingServer: true,
  },
});
