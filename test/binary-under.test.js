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

  describe('comments', () => {
    it('should be valid with line comment above the code', async () => {
      expect.hasAssertions();

      const { result } = await valid({
        code: '// eslint-disable-next-line\nconst binaryTooBig = 0b100000000;',
      });

      expect(result.output).toBe(
        '// eslint-disable-next-line\nconst binaryTooBig = 0b100000000;',
      );
      expect(result.fixed).toBe(false);
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
