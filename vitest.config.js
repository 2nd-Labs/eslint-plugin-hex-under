import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
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
});
