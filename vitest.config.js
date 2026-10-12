import { defineConfig } from 'vitest/config';

const coverageConfig = {
  provider: 'istanbul',
  include: ['src/**/*.js'],
  exclude: ['test/**'],
  cleanOnRerun: true,
  reporter: ['text', 'html', 'json', 'lcov', 'json-summary'],
  reportsDirectory: './coverage',
  reportOnFailure: true,
  skipFull: false,
  thresholds: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
};

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/**/*.test.js'],
          exclude: ['test/integration/**/*.int.test.js'],
          environment: 'node',
          sequence: {
            groupOrder: 0,
          },
          globals: false,
          coverage: {
            ...coverageConfig,
          },
        },
      },
      {
        test: {
          name: 'integration',
          include: ['test/integration/**/*.int.test.js'],
          environment: 'node',
          sequence: {
            groupOrder: 1,
          },
          globals: false,
          coverage: {
            enabled: false,
          },
        },
      },
    ],
  },
});
