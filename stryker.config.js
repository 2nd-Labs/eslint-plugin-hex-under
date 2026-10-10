export default {
  mutate: ['src/rules/*.js'],
  testRunner: 'command',
  commandRunner: {
    command: 'npx vitest run --project unit --reporter=dot',
  },
  reporters: ['html', 'clear-text', 'progress'],
  thresholds: {
    high: 90,
    low: 80,
    break: 75,
  },
  coverageAnalysis: 'off',
  concurrency: 4,
  timeoutMS: 15_000,
};
