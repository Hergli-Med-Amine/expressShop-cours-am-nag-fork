module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js'],
  coverageThreshold: {
    './src/orders/orderService.js': {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
};
