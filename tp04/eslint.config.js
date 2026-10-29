const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  { ignores: ['coverage/', 'playwright-report/', 'test-results/'] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      eqeqeq: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'warn',
    },
  },
  {
    files: ['src/server.js'],
    rules: { 'no-console': 'off' },
  },
  {
    files: ['tests/unit/**/*.js', 'tests/integration/**/*.js'],
    languageOptions: { globals: { ...globals.jest } },
  },
  {
    files: ['public/**/*.js'],
    languageOptions: { sourceType: 'script', globals: { ...globals.browser } },
  },
  {
    files: ['k6/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: { __ENV: 'readonly' },
    },
  },
];
