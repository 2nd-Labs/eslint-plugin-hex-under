import { RuleTester } from 'eslint';
import { describe, expect, it } from 'vitest';
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

          'const foo = -0b1111;',
          'const foo = -0B1111n;',

          'const foo = 0b11_11;',
          'const foo = 0B11_11;',

          'const foo = 0b11_11n;',
          'const foo = 0B11_11n;',
        ],
        invalid: [],
      });
    });

    it('valid cases - comments', () => {
      expect.assertions(0);

      ruleTester.run('binary-under', rule, {
        valid: [
          'const foo = 0b1000; // ignore-binary-under',
          '// ignore-binary-under\nconst foo = 0b1000;',
          'const foo = 0b1000n; // ignore-binary-under',
          '// ignore-binary-under\nconst foo = 0b1000n;',
          '// ignore-binary-under\nconst foo = 0b1000n; const bar = 0b1000;',
          'const foo = 0b1000n; const bar = 0b1000; // ignore-binary-under',

          '/* ignore-all-hex-under */\n\nconst foo = 0b10000;\nconst bar = 0b10001;',

          '// This should be ignored by binary-under rule because of the comment.\n\n/* ignore-binary-under */\n\nconst foo = 0b111111111111111111111111;\nconst bar = 0b1000000000000000000000000;',
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
          {
            code: 'const foo = -0B100000000n;',
            output: 'const foo = -256n;',
            errors: 1,
          },
        ],
      });
    });

    it('invalid cases - comments', () => {
      expect.assertions(0);

      ruleTester.run('binary-under', rule, {
        valid: [],
        invalid: [
          {
            code: 'const bar = 0b10000; // ignore-binary-under\nconst foo = 0b10000n;',
            output:
              'const bar = 0b10000; // ignore-binary-under\nconst foo = 16n;',
            errors: 1,
          },
          {
            code: 'const bar = 0b10000; // ignore-octal-under\nconst foo = 0b10000n;',
            output: 'const bar = 16; // ignore-octal-under\nconst foo = 16n;',
            errors: 2,
          },
          {
            code: 'const bar = 0b10000; // ignore-hex-under\nconst foo = 0b10000n;',
            output: 'const bar = 16; // ignore-hex-under\nconst foo = 16n;',
            errors: 2,
          },
          {
            code: '// This should fail.\n/* ignore-all-hex-under */\n\nconst foo = 0b10000;\nconst bar = 0b10001;',
            output:
              '// This should fail.\n/* ignore-all-hex-under */\n\nconst foo = 16;\nconst bar = 17;',
            errors: 2,
          },
          {
            code: '// This should fail.\n/* ignore-octal-under */\n\n/* ignore-hex-under */\nconst foo = 0b10000;\nconst bar = 0b10001;\nconst bat = 0x100;\nlet octalFoo = 0o1000;',
            output:
              '// This should fail.\n/* ignore-octal-under */\n\n/* ignore-hex-under */\nconst foo = 16;\nconst bar = 17;\nconst bat = 0x100;\nlet octalFoo = 0o1000;',
            errors: 2,
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

    it('invalid cases', () => {
      expect.assertions(0);

      ruleTester.run('binary-under', rule, {
        valid: [],
        invalid: [
          {
            code: 'const foo = 0b100000000n;',
            output: 'const foo = 256n;',
            options: [{ skipBigInt: false }],
            errors: 1,
          },
          {
            code: 'const foo = 0B100000000n;',
            output: 'const foo = 256n;',
            options: [{ skipBigInt: false }],
            errors: 1,
          },
        ],
      });
    });
  });
});
