'use strict';

import js from '@eslint/js';
import json from '@eslint/json';
import vitest from '@vitest/eslint-plugin';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import plugin from './src/eslint-plugin-hex-under.js';

export default [
  {
    ignores: [
      'coverage',
      'node_modules',
      'test/bats/fixture/**/*.js',
      'tmp/*.js',
    ],
  },
  {
    ...js.configs.all,
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
    ...eslintPlugin.configs.recommended,
    rules: {
      'eslint-plugin/no-meta-replaced-by': 'off',
    },
  },
  {
    plugins: {
      json,
    },
    files: ['**/*.json'],
    ignores: ['package-lock.json'],
    language: 'json/json',
    rules: {
      'json/no-duplicate-keys': 'error',
      'json/sort-keys': 'error',
    },
  },
  {
    plugins: {
      json,
    },
    files: ['**/*.jsonc', '.vscode/*.json'],
    language: 'json/jsonc',
    rules: {
      'json/no-duplicate-keys': 'error',
      'json/sort-keys': 'error',
    },
  },
  {
    ignores: ['test/bats/fixture/**/*.js'],
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
      'hex-under/octal-under': [
        'error',
        {
          limit: 511,
          skipBigInt: false,
        },
      ],
      'hex-under/binary-under': [
        'error',
        {
          limit: 15,
          skipBigInt: false,
        },
      ],
    },
  },
];
