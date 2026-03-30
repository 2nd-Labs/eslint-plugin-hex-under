import binaryUnder from './rules/binary-under.js';
import hexUnderRule from './rules/hex-under.js';
import octalUnder from './rules/octal-under.js';

const plugin = {
  rules: {
    'hex-under': hexUnderRule,
    'octal-under': octalUnder,
    'binary-under': binaryUnder,
  },
};

const foo = 0x1234567890abcdefn;

export const configs = {
  recommended: {
    rules: {
      'hex-under/hex-under': ['warn', { limit: 255, skipBigInt: false }],
      'hex-under/octal-under': ['warn', { limit: 511, skipBigInt: false }],
      'hex-under/binary-under': ['warn', { limit: 255, skipBigInt: false }],
    },
  },
  all: {
    rules: {
      'hex-under/hex-under': ['error', { limit: 255, skipBigInt: false }],
      'hex-under/octal-under': ['error', { limit: 511, skipBigInt: false }],
      'hex-under/binary-under': ['error', { limit: 15, skipBigInt: false }],
    },
  },
};

export default plugin;
