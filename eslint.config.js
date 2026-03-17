'use strict';

import js from '@eslint/js';
import plugin from './src/eslint-plugin-hex-under.js';

export default [
  {
    ...js.configs.recommended,
    ignores: ['fixture/*.js', 'tmp/*.js'],
  },
  {
    plugins: {
      'hex-under': plugin,
    },
    rules: {
      'hex-under/hex-under': ['error', { limit: 255 }],
      'hex-under/hex-under-bigint': ['error'],
    },
  },
];
