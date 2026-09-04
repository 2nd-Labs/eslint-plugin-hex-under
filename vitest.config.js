import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/**/*.test.js'],
          exclude: ['test/integration/**/*.int.test.js'],
          sequence: {
            groupOrder: 0,
          },
          environment: 'node',
          reporters: 'verbose',
          threads: false,
          coverage: {
            provider: 'istanbul',
            exclude: ['test/integration/**/*.int.test.js'],
            cleanOnRerun: true,
            reporter: ['text', 'html', 'json', 'lcov', 'json-summary'],
            reportsDirectory: './coverage',
            reportOnFailure: true,
            skipFull: false,
            all: true,
            thresholds: {
              statements: 80,
              branches: 80,
              functions: 80,
              lines: 80,
            },
          },
          globals: false,
        },
      },
      {
        test: {
          name: 'integration',
          include: ['test/integration/**/*.int.test.js'],
          sequence: {
            groupOrder: 1,
          },
          environment: 'node',
          coverage: {
            enabled: false,
            provider: 'istanbul',
          },
          threads: false,
          globals: false,
        },
      },
    ],
  },
});
