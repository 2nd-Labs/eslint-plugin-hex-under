import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/rules/**/*.js'],
      exclude: ['node_modules', 'test', '**/*.test.js', '**/*.spec.js'],
      reporter: ['text', 'html', 'json', 'lcov'],
      reportsDirectory: './coverage',
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
      skipFull: false,
      all: true,
      thresholds: {
        lines: 95,
        functions: 95,
        branches: 95,
        statements: 95,
      },
    },
    globals: false,
  },
});
