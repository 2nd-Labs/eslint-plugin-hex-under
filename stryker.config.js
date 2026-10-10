export default {
  mutate: ['src/rules/*.js'],
  testRunner: 'vitest',
  vitest: {
    configFile: 'vitest.config.js',
  },
};
