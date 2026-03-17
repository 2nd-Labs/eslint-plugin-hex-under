import { describe, it } from 'vitest';
import { RuleTester } from 'eslint';
import hexUnderBigintRule from '../src/rules/hex-under.js';

describe('hex-under-bigint', () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      ecmaVersion: 2025,
    },
  });

  describe('valid cases - under limit', () => {
    it('allows hex bigint under limit (255)', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [
          {
            options: [{ limit: 255 }],
            code: 'const foo = 0xffn;',
          },
        ],
        invalid: [],
      });
    });

    it('allows hex bigint under small limit', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [
          {
            options: [{ limit: 15 }],
            code: 'const foo = 0xfn;',
          },
        ],
        invalid: [],
      });
    });

    it('allows hex bigint exactly at limit boundary', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [
          {
            options: [{ limit: 256 }],
            code: 'const foo = 0x100n;',
          },
        ],
        invalid: [],
      });
    });
  });

  describe('valid cases - different declarations', () => {
    it('allows const declaration', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [
          {
            options: [{ limit: 255 }],
            code: 'const foo = 0xffn;',
          },
        ],
        invalid: [],
      });
    });

    it('allows let declaration', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [
          {
            options: [{ limit: 255 }],
            code: 'let foo = 0xffn;',
          },
        ],
        invalid: [],
      });
    });

    it('allows var declaration', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [
          {
            options: [{ limit: 256 }],
            code: 'var foo = 0xffn;',
          },
        ],
        invalid: [],
      });
    });
  });

  describe('valid cases - usage contexts', () => {
    it('allows bigint inside function return', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [
          {
            code: 'function func() {\n  return 0xffn;\n}',
          },
        ],
        invalid: [],
      });
    });

    it('allows bigint as function argument', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [
          {
            code: 'functionA(0xefn);',
          },
        ],
        invalid: [],
      });
    });

    it('allows bigint in arrow function', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [
          {
            code: 'const func = () => 0xabn;',
          },
        ],
        invalid: [],
      });
    });
  });

  describe('valid cases - hex format variations', () => {
    it('allows uppercase hex bigint under limit', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [
          {
            options: [{ limit: 3000 }],
            code: 'const foo = 0xABCn;',
          },
        ],
        invalid: [],
      });
    });

    it('allows mixed case hex bigint under limit', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [
          {
            options: [{ limit: 3000 }],
            code: 'const foo = 0XaBcn;',
          },
        ],
        invalid: [],
      });
    });

    it('allows hex bigint with numeric separators under limit', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [
          {
            options: [{ limit: 3000 }],
            code: 'const foo = 0xa_b_cn;',
          },
        ],
        invalid: [],
      });
    });
  });

  describe('invalid cases - exceeds limit', () => {
    it('converts hex bigint over default limit', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0x100n;',
            output: 'const foo = 256n;',
            errors: 1,
          },
        ],
      });
    });

    it('converts hex bigint over custom limit', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [],
        invalid: [
          {
            code: 'let bar = 0x1ffn;',
            output: 'let bar = 511n;',
            options: [{ limit: 300 }],
            errors: 1,
          },
        ],
      });
    });

    it('converts large hex bigint', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [],
        invalid: [
          {
            code: 'const big = 0x12345n;',
            output: 'const big = 74565n;',
            options: [{ limit: 70000 }],
            errors: 1,
          },
        ],
      });
    });
  });

  describe('invalid cases - hex format variations', () => {
    it('converts uppercase hex bigint over limit', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0xABCn;',
            output: 'const foo = 2748n;',
            options: [{ limit: 2000 }],
            errors: 1,
          },
        ],
      });
    });

    it('converts mixed case hex bigint over limit', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0XaBcn;',
            output: 'const foo = 2748n;',
            options: [{ limit: 2000 }],
            errors: 1,
          },
        ],
      });
    });

    it('converts hex bigint with numeric separators over limit', () => {
      ruleTester.run('hex-under', hexUnderBigintRule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0xa_b_cn;',
            output: 'const foo = 2748n;',
            options: [{ limit: 2000 }],
            errors: 1,
          },
        ],
      });
    });
  });
});
