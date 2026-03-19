import { describe, it, expect } from 'vitest';
import { RuleTester } from 'eslint';
import rule from '../src/rules/octal-under.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2025,
    sourceType: 'module',
  },
});

const oldRuleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2025,
    sourceType: 'script',
  },
});

describe('octal-under rule', () => {
  describe('default options', () => {
    it('valid cases', () => {
      expect.assertions(0);

      ruleTester.run('octal-under', rule, {
        valid: [
          'const foo = 0o777;',
          'const foo = 0O777;',
          'const foo = 0o777n;',
          'const foo = 0O777n;',

          'const foo = 0o7_77;',
          'const foo = 0O7_77;',
          'const foo = 0o7_77n;',
          'const foo = 0O7_77n;',
        ],
        invalid: [],
      });

      oldRuleTester.run('octal-under', rule, {
        valid: ['const foo = 0777;'],
        invalid: [],
      });
    });

    it('invalid cases', () => {
      expect.assertions(0);

      ruleTester.run('octal-under', rule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0o1000;',
            output: 'const foo = 512;',
            errors: 1,
          },
          {
            code: 'const foo = 0O1000;',
            output: 'const foo = 512;',
            errors: 1,
          },
          {
            code: 'const foo = 0o1000n;',
            output: 'const foo = 512n;',
            errors: 1,
          },
          {
            code: 'const foo = 0O1000n;',
            output: 'const foo = 512n;',
            errors: 1,
          },
          {
            code: 'const foo = 0o1_000;',
            output: 'const foo = 512;',
            errors: 1,
          },
          {
            code: 'const foo = 0O1_000;',
            output: 'const foo = 512;',
            errors: 1,
          },
          {
            code: 'const foo = 0o1_000n;',
            output: 'const foo = 512n;',
            errors: 1,
          },
          {
            code: 'const foo = 0O1_000n;',
            output: 'const foo = 512n;',
            errors: 1,
          },
        ],
      });
    });
  });

  describe('with custom limit (7)', () => {
    it('valid cases', () => {
      expect.assertions(0);

      ruleTester.run('octal-under', rule, {
        valid: [
          { code: 'const foo = 0o7;', options: [{ limit: 7 }] },
          { code: 'const foo = 0O7;', options: [{ limit: 7 }] },

          { code: 'const foo = 0o7n;', options: [{ limit: 7 }] },
          { code: 'const foo = 0O7n;', options: [{ limit: 7 }] },
        ],
        invalid: [],
      });
    });

    it('invalid cases', () => {
      expect.assertions(0);

      ruleTester.run('octal-under', rule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0o10;',
            output: 'const foo = 8;',
            options: [{ limit: 7 }],
            errors: 1,
          },
          {
            code: 'const foo = 0O10;',
            output: 'const foo = 8;',
            options: [{ limit: 7 }],
            errors: 1,
          },
          {
            code: 'const foo = 0o10n;',
            output: 'const foo = 8n;',
            options: [{ limit: 7 }],
            errors: 1,
          },
          {
            code: 'const foo = 0O10n;',
            output: 'const foo = 8n;',
            options: [{ limit: 7 }],
            errors: 1,
          },
        ],
      });
    });
  });

  describe('with skipBigInt: true', () => {
    it('valid cases', () => {
      expect.assertions(0);

      ruleTester.run('octal-under', rule, {
        valid: [
          { code: 'const foo = 0o777;', options: [{ skipBigInt: true }] },
          { code: 'const foo = 0O777;', options: [{ skipBigInt: true }] },

          { code: 'const foo = 0o1000n;', options: [{ skipBigInt: true }] },
          { code: 'const foo = 0O1000n;', options: [{ skipBigInt: true }] },
        ],
        invalid: [],
      });
    });
  });
});
