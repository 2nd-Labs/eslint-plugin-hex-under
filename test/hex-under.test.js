import { RuleTester } from 'eslint';
import { describe, expect, it } from 'vitest';
import rule from '../src/rules/hex-under.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2025,
    sourceType: 'module',
  },
});

describe('hex-under rule', () => {
  describe('default options', () => {
    it('valid cases', () => {
      expect.assertions(0);

      ruleTester.run('hex-under', rule, {
        valid: [
          'const foo = 0xff;',
          'const foo = 0Xff;',
          'const foo = 0xffn;',
          'const foo = 0Xffn;',

          'const foo = -0xff;',
          'const foo = -0Xff;',
          'const foo = -0xffn;',
          'const foo = -0Xffn;',

          'const foo = 0xFF;',
          'const foo = 0XFF;',
          'const foo = 0xFFn;',
          'const foo = 0XFFn;',

          'const foo = 0xFf;',
          'const foo = 0XFf;',
          'const foo = 0xFfn;',
          'const foo = 0XFfn;',

          'const foo = 0xF_f;',
          'const foo = 0XF_f;',
          'const foo = 0xF_fn;',
          'const foo = 0XF_fn;',
        ],
        invalid: [],
      });
    });

    it('valid cases - comments', () => {
      expect.assertions(0);

      ruleTester.run('hex-under', rule, {
        valid: [
          'const foo = 0x100; // ignore-hex-under',
          '// ignore-hex-under\nconst foo = 0x100;',
          'const foo = 0x100n; // ignore-hex-under',
          '// ignore-hex-under\nconst foo = 0x100n;',
          '// ignore-hex-under\nconst foo = 0x100n; const bar = 0x100;',
          'const foo = 0x100n; const bar = 0x100; // ignore-hex-under',
          '/* ignore-all-hex-under */\n\nconst foo = 0x100;\nconst bar = 0xfff;',
        ],
        invalid: [],
      });
    });

    it('invalid cases', () => {
      expect.assertions(0);

      ruleTester.run('hex-under', rule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0x100;',
            output: 'const foo = 256;',
            errors: 1,
          },
          {
            code: 'const foo = 0X100;',
            output: 'const foo = 256;',
            errors: 1,
          },
          {
            code: 'const foo = 0x100n;',
            output: 'const foo = 256n;',
            errors: 1,
          },
          {
            code: 'const foo = 0X100n;',
            output: 'const foo = 256n;',
            errors: 1,
          },
          {
            code: 'const foo = -0X100n;\nconst bar = -0x100;',
            output: 'const foo = -256n;\nconst bar = -256;',
            errors: 2,
          },
        ],
      });
    });

    it('invalid cases - comments', () => {
      expect.assertions(0);

      ruleTester.run('hex-under', rule, {
        valid: [],
        invalid: [
          {
            code: 'const bar = 0x100; // ignore-hex-under\nconst foo = 0x100n;',
            output: 'const bar = 0x100; // ignore-hex-under\nconst foo = 256n;',
            errors: 1,
          },
          {
            code: 'const bar = 0x100; // ignore-binary-under\nconst foo = 0x100n;',
            output:
              'const bar = 256; // ignore-binary-under\nconst foo = 256n;',
            errors: 2,
          },
          {
            code: 'const bar = 0x100; // ignore-octal-under\nconst foo = 0x100n;',
            output: 'const bar = 256; // ignore-octal-under\nconst foo = 256n;',
            errors: 2,
          },
          {
            code: '// This should fail.\n/* ignore-all-hex-under */\n\nconst foo = 0x100;\nconst bar = 0x101;',
            output:
              '// This should fail.\n/* ignore-all-hex-under */\n\nconst foo = 256;\nconst bar = 257;',
            errors: 2,
          },
        ],
      });
    });
  });

  describe('with custom limit (15)', () => {
    it('valid cases', () => {
      expect.assertions(0);

      ruleTester.run('hex-under', rule, {
        valid: [
          {
            code: 'const foo = 0xf;',
            options: [
              {
                limit: 15,
              },
            ],
          },
          {
            code: 'const foo = 0Xf;',
            options: [
              {
                limit: 15,
              },
            ],
          },
          {
            code: 'const foo = 0xfn;',
            options: [
              {
                limit: 15,
              },
            ],
          },
          {
            code: 'const foo = 0Xfn;',
            options: [
              {
                limit: 15,
              },
            ],
          },
          {
            code: 'const foo = 0xF;',
            options: [
              {
                limit: 15,
              },
            ],
          },
          {
            code: 'const foo = 0XF;',
            options: [
              {
                limit: 15,
              },
            ],
          },
          {
            code: 'const foo = 0xFn;',
            options: [
              {
                limit: 15,
              },
            ],
          },
          {
            code: 'const foo = 0XFn;',
            options: [
              {
                limit: 15,
              },
            ],
          },
        ],
        invalid: [],
      });
    });

    it('invalid cases', () => {
      expect.assertions(0);

      ruleTester.run('hex-under', rule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0x10;',
            output: 'const foo = 16;',
            options: [
              {
                limit: 15,
              },
            ],
            errors: 1,
          },
          {
            code: 'const foo = 0X10;',
            output: 'const foo = 16;',
            options: [
              {
                limit: 15,
              },
            ],
            errors: 1,
          },
          {
            code: 'const foo = 0x10n;',
            output: 'const foo = 16n;',
            options: [
              {
                limit: 15,
              },
            ],
            errors: 1,
          },
          {
            code: 'const foo = 0X10n;',
            output: 'const foo = 16n;',
            options: [
              {
                limit: 15,
              },
            ],
            errors: 1,
          },
        ],
      });
    });
  });

  describe('with skipBigInt: true', () => {
    it('valid cases', () => {
      expect.assertions(0);

      ruleTester.run('hex-under', rule, {
        valid: [
          {
            code: 'const foo = 0xff;',
            options: [
              {
                skipBigInt: true,
              },
            ],
          },
          {
            code: 'const foo = 0Xff;',
            options: [
              {
                skipBigInt: true,
              },
            ],
          },
          {
            code: 'const foo = 0xffffn;',
            options: [
              {
                skipBigInt: true,
              },
            ],
          },
          {
            code: 'const foo = 0Xffffn;',
            options: [
              {
                skipBigInt: true,
              },
            ],
          },
          {
            code: 'const foo = 0xFF;',
            options: [
              {
                skipBigInt: true,
              },
            ],
          },
          {
            code: 'const foo = 0XFF;',
            options: [
              {
                skipBigInt: true,
              },
            ],
          },
          {
            code: 'const foo = 0xFFFFn;',
            options: [
              {
                skipBigInt: true,
              },
            ],
          },
          {
            code: 'const foo = 0XFFFFn;',
            options: [
              {
                skipBigInt: true,
              },
            ],
          },
        ],
        invalid: [],
      });
    });

    it('invalid cases', () => {
      expect.assertions(0);

      ruleTester.run('hex-under', rule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0x100n;',
            output: 'const foo = 256n;',
            options: [
              {
                skipBigInt: false,
              },
            ],
            errors: 1,
          },
          {
            code: 'const foo = 0X100n;',
            output: 'const foo = 256n;',
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
