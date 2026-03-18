'use strict';

import js from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import plugin from './src/eslint-plugin-hex-under.js';

export default [
  {
    ...js.configs.all,
    ignores: [
      'coverage',
      'node_modules',
      'test/bats/fixture/**/*.js',
      'tmp/*.js',
    ],
    rules: {
      'no-magic-numbers': 'off',
    },
  },
  {
    files: ['test/**/*.test.js'],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.all.rules,
    },
  },
  {
    plugins: {
      'hex-under': plugin,
    },
    rules: {
      'hex-under/hex-under': [
        'error',
        {
          limit: 255,
          skipBigInt: false,
        },
      ],
    },
  },
];
