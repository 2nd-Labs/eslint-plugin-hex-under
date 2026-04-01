'use strict';

import plugin, { configs } from '../../src/eslint-plugin-hex-under.js';

export default [
  {
    plugins: {
      'hex-under': plugin,
    },
    ...configs.all,
  },
];
