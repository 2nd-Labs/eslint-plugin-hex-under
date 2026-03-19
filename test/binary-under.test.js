import { describe, it, expect } from 'vitest';
import { RuleTester } from 'eslint';
import rule from '../src/rules/binary-under.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2025,
    sourceType: 'module',
  },
});

describe('binary-under rule', () => {
  describe('default options', () => {
    it('valid cases', () => {
      expect.assertions(0);

      ruleTester.run('binary-under', rule, {
        valid: [
          'const foo = 0b1111;',
          'const foo = 0B1111;',

          'const foo = 0b1111n;',
          'const foo = 0B1111n;',

          'const foo = 0b11_11;',
          'const foo = 0B11_11;',

          'const foo = 0b11_11n;',
          'const foo = 0B11_11n;',

          '// ignore-binary-under\nconst foo = 0b10000;',
          'const foo = 0b10000; // ignore-binary-under',
        ],
        invalid: [],
      });
    });

    it('invalid cases', () => {
      expect.assertions(0);

      ruleTester.run('binary-under', rule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0b1_0000_0000;',
            output: 'const foo = 256;',
            errors: 1,
          },
          {
            code: 'const foo = 0B1_0000_0000;',
            output: 'const foo = 256;',
            errors: 1,
          },
          {
            code: 'const foo = 0b100000000;',
            output: 'const foo = 256;',
            errors: 1,
          },
          {
            code: 'const foo = 0B100000000;',
            output: 'const foo = 256;',
            errors: 1,
          },
          {
            code: 'const foo = 0b1_0000_0000n;',
            output: 'const foo = 256n;',
            errors: 1,
          },
          {
            code: 'const foo = 0B1_0000_0000n;',
            output: 'const foo = 256n;',
            errors: 1,
          },
          {
            code: 'const foo = 0b100000000n;',
            output: 'const foo = 256n;',
            errors: 1,
          },
          {
            code: 'const foo = 0B100000000n;',
            output: 'const foo = 256n;',
            errors: 1,
          },
        ],
      });
    });
  });

  describe('with custom limit (1)', () => {
    it('valid cases', () => {
      expect.assertions(0);

      ruleTester.run('binary-under', rule, {
        valid: [
          { code: 'const foo = 0b1;', options: [{ limit: 1 }] },
          { code: 'const foo = 0B1;', options: [{ limit: 1 }] },

          { code: 'const foo = 0b1n;', options: [{ limit: 1 }] },
          { code: 'const foo = 0B1n;', options: [{ limit: 1 }] },
        ],
        invalid: [],
      });
    });

    it('invalid cases', () => {
      expect.assertions(0);

      ruleTester.run('binary-under', rule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0b10;',
            output: 'const foo = 2;',
            options: [{ limit: 1 }],
            errors: 1,
          },
          {
            code: 'const foo = 0B10;',
            output: 'const foo = 2;',
            options: [{ limit: 1 }],
            errors: 1,
          },
          {
            code: 'const foo = 0b10n;',
            output: 'const foo = 2n;',
            options: [{ limit: 1 }],
            errors: 1,
          },
          {
            code: 'const foo = 0B10n;',
            output: 'const foo = 2n;',
            options: [{ limit: 1 }],
            errors: 1,
          },
        ],
      });
    });
  });

  describe('with skipBigInt: true', () => {
    it('valid cases', () => {
      expect.assertions(0);

      ruleTester.run('binary-under', rule, {
        valid: [
          { code: 'const foo = 0b1111;', options: [{ skipBigInt: true }] },
          { code: 'const foo = 0B1111;', options: [{ skipBigInt: true }] },

          {
            code: 'const foo = 0b100000000n;',
            options: [{ skipBigInt: true }],
          },
          {
            code: 'const foo = 0B100000000n;',
            options: [{ skipBigInt: true }],
          },
        ],
        invalid: [],
      });
    });
  });
});
