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

export default plugin;
