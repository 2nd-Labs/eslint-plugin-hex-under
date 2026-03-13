"use strict";

import plugin from "./src/eslint-plugin-hex-under.js";

export default [
  {
    plugins: {
      "hex-under": plugin,
    },
    rules: {
      "hex-under/hex-under": ["error", { limit: 255 }],
      "hex-under/hex-under-bigint": ["warn"],
    },
  },
];
