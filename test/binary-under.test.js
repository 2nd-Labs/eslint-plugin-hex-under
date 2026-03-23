import { createRuleTester } from 'eslint-vitest-rule-tester';
import { describe, expect, it } from 'vitest';
import rule from '../src/rules/binary-under.js';

describe('hex-under/binary-under', () => {
  const { valid, invalid } = createRuleTester({
    name: 'hex-under/binary-under',
    rule,
    configs: {
      languageOptions: {
        parserOptions: {
          ecmaVersion: 2025,
          sourceType: 'module',
        },
      },
    },
  });

  describe('default cases', () => {
    it.each([
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
    ])('%s should be valid', async (testCase) => {
      expect.hasAssertions();

      const { result } = await valid({
        code: testCase,
      });

      expect(result.output).toBe(testCase);
      expect(result.fixed).toBe(false);
    });

    it.each([
      ['const foo = 0b1_0000_0000;', 'const foo = 256;'],
      ['const foo = 0B1_0000_0000;', 'const foo = 256;'],
      ['const foo = 0b100000000;', 'const foo = 256;'],
      ['const foo = 0B100000000;', 'const foo = 256;'],
      ['const foo = 0b1_0000_0000n;', 'const foo = 256n;'],
      ['const foo = 0B1_0000_0000n;', 'const foo = 256n;'],
      ['const foo = 0b100000000n;', 'const foo = 256n;'],
      ['const foo = 0B100000000n;', 'const foo = 256n;'],
      ['const foo = -0B100000000n;', 'const foo = -256n;'],
    ])('%s should be invalid', async (testCase, output) => {
      expect.hasAssertions();

      const { result } = await invalid({
        code: testCase,
        errors: 1,
      });

      expect(result.output).toBe(output);
      expect(result.fixed).toBe(true);
    });
  });

  describe('default cases - comments', () => {
    it('should be valid with "ignore-all-hex-under" block comment on the very first line', async () => {
      expect.hasAssertions();

      const { result } = await valid({
        code: '/* ignore-all-hex-under */\n\nconst foo = 0b10000;\nconst bar = 0b10001;',
      });

      expect(result.output).toBe(
        '/* ignore-all-hex-under */\n\nconst foo = 0b10000;\nconst bar = 0b10001;',
      );
      expect(result.fixed).toBe(false);
    });

    it('should be valid with "ignore-binary-under" block comment', async () => {
      expect.hasAssertions();

      const { result } = await valid({
        code: '// This should be ignored by binary-under rule because of the comment.\n\n/* ignore-binary-under */\n\nconst foo = 0b111111111111111111111111;\nconst bar = 0b1000000000000000000000000;',
      });

      expect(result.output).toBe(
        '// This should be ignored by binary-under rule because of the comment.\n\n/* ignore-binary-under */\n\nconst foo = 0b111111111111111111111111;\nconst bar = 0b1000000000000000000000000;',
      );
      expect(result.fixed).toBe(false);
    });

    it.each([
      '// ignore-binary-under\nconst foo = 0b10000;',
      '// ignore-binary-under\nconst foo = 0b10000n;',
      '// ignore-binary-under\nconst foo = 0b10000n; const bar = 0b1000;',
    ])('should be valid with comment above', async (testCase) => {
      expect.hasAssertions();

      const { result } = await valid({
        code: testCase,
      });

      expect(result.output).toBe(testCase);
      expect(result.fixed).toBe(false);
    });

    it.each([
      'const foo = 0b10000; // ignore-binary-under',
      'const foo = 0b10000n; // ignore-binary-under',
      'const foo = 0b10000n; const bar = 0b10000; // ignore-binary-under',
    ])('should be valid with comment on the same line', async (testCase) => {
      expect.hasAssertions();

      const { result } = await valid({
        code: testCase,
      });

      expect(result.output).toBe(testCase);
      expect(result.fixed).toBe(false);
    });

    it.each([
      [
        'ignore-binary-under',
        1,
        'const bar = 0b10000; // ignore-binary-under\nconst foo = 0b10000n;',
        'const bar = 0b10000; // ignore-binary-under\nconst foo = 16n;',
      ],
      [
        'ignore-octal-under',
        2,
        'const bar = 0b10000; // ignore-octal-under\nconst foo = 0b10000n;',
        'const bar = 16; // ignore-octal-under\nconst foo = 16n;',
      ],
      [
        'ignore-hex-under',
        2,
        'const bar = 0b10000; // ignore-hex-under\nconst foo = 0b10000n;',
        'const bar = 16; // ignore-hex-under\nconst foo = 16n;',
      ],
    ])(
      'should fail with ignore rule %s and %d error(s)',
      async (_rule, errors, testCase, output) => {
        expect.hasAssertions();

        const { result } = await invalid({
          code: testCase,
          errors: errors,
        });

        expect(result.output).toBe(output);
        expect(result.fixed).toBe(true);
      },
    );

    it('should fail with "ignore-all-hex-under" block comment not on the very first line', async () => {
      expect.hasAssertions();

      const { result } = await invalid({
        code: '// This should fail.\n/* ignore-all-hex-under */\n\nconst foo = 0b10000;\nconst bar = 0b10001;',
        errors: 2,
      });

      expect(result.output).toBe(
        '// This should fail.\n/* ignore-all-hex-under */\n\nconst foo = 16;\nconst bar = 17;',
      );
      expect(result.fixed).toBe(true);
    });

    it('should fail with "ignore-hex-under" and "ignore-octal-under" block comments', async () => {
      expect.hasAssertions();

      const { result } = await invalid({
        code: '// This should fail.\n/* ignore-octal-under */\n\n/* ignore-hex-under */\nconst foo = 0b10000;\nconst bar = 0b10001;\nconst bat = 0x100;\nlet octalFoo = 0o1000;',
        errors: 2,
      });

      expect(result.output).toBe(
        '// This should fail.\n/* ignore-octal-under */\n\n/* ignore-hex-under */\nconst foo = 16;\nconst bar = 17;\nconst bat = 0x100;\nlet octalFoo = 0o1000;',
      );
      expect(result.fixed).toBe(true);
    });
  });

  describe('with custom limit', () => {
    it.each([
      ['const foo = 0b1;', 1],
      ['const foo = 0B1;', 1],
      ['const foo = 0b1n;', 1],
      ['const foo = 0B1n;', 1],
      ['const foo = 0b1111;', 15],
      ['const foo = 0b1111_1111', 255],
    ])('%s should be valid', async (testCase, limit) => {
      expect.hasAssertions();

      const { result } = await valid({
        code: testCase,
        options: {
          limit: limit,
        },
      });

      expect(result.output).toBe(testCase);
      expect(result.fixed).toBe(false);
    });

    it.each([
      ['const foo = 0b10;', 'const foo = 2;', 1],
      ['const foo = 0B10;', 'const foo = 2;', 1],
      ['const foo = 0b10n;', 'const foo = 2n;', 1],
      ['const foo = 0B10n;', 'const foo = 2n;', 1],
    ])('%s should fail with limit %d', async (testCase, output, limit) => {
      expect.hasAssertions();

      const { result } = await invalid({
        code: testCase,
        options: {
          limit: limit,
        },
        errors: 1,
      });

      expect(result.output).toBe(output);
      expect(result.fixed).toBe(true);
    });
  });

  describe('with option skipBigInt', () => {
    it.each([
      ['const foo = 0b1111;', true],
      ['const foo = 0B1111;', true],
      ['const foo = 0b100000000n;', true],
      ['const foo = 0B100000000n;', true],
    ])(
      '%s should be valid with skipBigInt=%s',
      async (testCase, skipBigInt) => {
        expect.hasAssertions();

        const { result } = await valid({
          code: testCase,
          options: {
            skipBigInt: skipBigInt,
          },
        });

        expect(result.output).toBe(testCase);
        expect(result.fixed).toBe(false);
      },
    );

    it.each([
      ['const foo = 0b100000000n;', 'const foo = 256n;', false],
      ['const foo = 0B100000000n;', 'const foo = 256n;', false],
    ])(
      '%s should fail with skipBigInt=false',
      async (testCase, output, skipBigInt) => {
        expect.hasAssertions();

        const { result } = await invalid({
          code: testCase,
          options: {
            skipBigInt: skipBigInt,
          },
          errors: 1,
        });

        expect(result.output).toBe(output);
        expect(result.fixed).toBe(true);
      },
    );
  });
});
