import hexUnderRule from './rules/hex-under.js';
import hexUnderBigintRule from './rules/hex-under-bigint.js';

const plugin = {
  rules: {
    'hex-under': hexUnderRule,
    'hex-under-bigint': hexUnderBigintRule,
  },
};

export default plugin;
