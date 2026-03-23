'use strict';

import plugin from '../../src/eslint-plugin-hex-under.js';

export default [
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
