import { RuleTester } from 'eslint';
import { describe, expect, it } from 'vitest';
import rule from '../src/rules/octal-under.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2025,
    sourceType: 'module',
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

          'const foo = -0O777;',
          'const foo = -0o777n;',

          'const foo = 0o7_77;',
          'const foo = 0O7_77;',
          'const foo = 0o7_77n;',
          'const foo = 0O7_77n;',
        ],
        invalid: [],
      });
    });

    it('valid cases - comments', () => {
      expect.assertions(0);

      ruleTester.run('octal-under', rule, {
        valid: [
          'const foo = 0o1000; // ignore-octal-under',
          '// ignore-octal-under\nconst foo = 0o1000;',
          'const foo = 0o1000n; // ignore-octal-under',
          '// ignore-octal-under\nconst foo = 0o1000n;',
          '// ignore-octal-under\nconst foo = 0o1000n; const bar = 0o1000;',
          'const foo = 0o1000n; const bar = 0o1000; // ignore-octal-under',

          '/* ignore-all-hex-under */\n\nconst foo = 0o1000;\nconst bar = 0o7777n;',
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
          {
            code: 'const foo = -0O1_000n;',
            output: 'const foo = -512n;',
            errors: 1,
          },
        ],
      });
    });

    it('invalid cases - comments', () => {
      expect.assertions(0);

      ruleTester.run('octal-under', rule, {
        valid: [],
        invalid: [
          {
            code: 'const bar = 0o1000; // ignore-octal-under\nconst foo = 0o1000n;',
            output:
              'const bar = 0o1000; // ignore-octal-under\nconst foo = 512n;',
            errors: 1,
          },
          {
            code: 'const bar = 0o1000; // ignore-binary-under\nconst foo = 0o1000n;',
            output:
              'const bar = 512; // ignore-binary-under\nconst foo = 512n;',
            errors: 2,
          },
          {
            code: 'const bar = 0o1000; // ignore-hex-under\nconst foo = 0o1000n;',
            output: 'const bar = 512; // ignore-hex-under\nconst foo = 512n;',
            errors: 2,
          },
          {
            code: '// This should fail.\n/* ignore-all-hex-under */\n\nconst foo = 0o1000;\nconst bar = 0o1001;',
            output:
              '// This should fail.\n/* ignore-all-hex-under */\n\nconst foo = 512;\nconst bar = 513;',
            errors: 2,
          },
        ],
      });
    });
  });

  describe('old style octals', () => {
    it('valid cases', () => {
      expect.assertions(0);

      const oldRuleTester = new RuleTester({
        languageOptions: {
          ecmaVersion: 2025,
          sourceType: 'script',
        },
      });

      oldRuleTester.run('octal-under', rule, {
        valid: ['const foo = 0777;'],
        invalid: [],
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

    it('invalid cases', () => {
      expect.assertions(0);

      ruleTester.run('octal-under', rule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0o1000n;',
            output: 'const foo = 512n;',
            options: [
              {
                skipBigInt: false,
              },
            ],
            errors: 1,
          },
          {
            code: 'const foo = 0O1000n;',
            output: 'const foo = 512n;',
            options: [
              {
                skipBigInt: false,
              },
            ],
            errors: 1,
          },
        ],
      });
    });
  });
});
