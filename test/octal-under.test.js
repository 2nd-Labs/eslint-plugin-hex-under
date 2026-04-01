import { createRuleTester } from 'eslint-vitest-rule-tester';
import { describe, expect, it } from 'vitest';
import rule from '../src/rules/octal-under.js';

describe('hex-under/octal-under', () => {
  const { valid, invalid } = createRuleTester({
    name: 'hex-under/octal-under',
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
    ])('%s should be valid', async (testCase) => {
      expect.hasAssertions();

      const { result } = await valid({
        code: testCase,
      });

      expect(result.output).toBe(testCase);
      expect(result.fixed).toBe(false);
    });

    it.each([
      ['const foo = 0o1000;', 'const foo = 512;'],
      ['const foo = 0O1000;', 'const foo = 512;'],
      ['const foo = 0o1000n;', 'const foo = 512n;'],
      ['const foo = 0O1000n;', 'const foo = 512n;'],
      ['const foo = 0o1_000;', 'const foo = 512;'],
      ['const foo = 0O1_000;', 'const foo = 512;'],
      ['const foo = 0o1_000n;', 'const foo = 512n;'],
      ['const foo = 0O1_000n;', 'const foo = 512n;'],
      ['const foo = -0O1_000n;', 'const foo = -512n;'],
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

  describe('old style octals', () => {
    const { valid: validOld } = createRuleTester({
      name: 'hex-under/octal-under',
      rule,
      configs: {
        languageOptions: {
          ecmaVersion: 2025,
          sourceType: 'script',
        },
      },
    });

    it.each([
      'const foo = 0777;',
      'const foo = 0101234;',
      'const foo = 028395;',
    ])('should be valid with old style octal literal', async (testCase) => {
      expect.hasAssertions();

      const { result } = await validOld({
        code: testCase,
      });

      expect(result.output).toBe(testCase);
      expect(result.fixed).toBe(false);
    });
  });

  describe('with custom limit', () => {
    it.each([
      ['const foo = 0o7;', 7],
      ['const foo = 0O7;', 7],
      ['const foo = 0o7n;', 7],
      ['const foo = 0O7n;', 7],
      ['const foo = 0o77_7', 511],
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
      ['const foo = 0o10;', 'const foo = 8;', 7],
      ['const foo = 0O10;', 'const foo = 8;', 7],
      ['const foo = 0o10n;', 'const foo = 8n;', 7],
      ['const foo = 0O10n;', 'const foo = 8n;', 7],
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
      ['const foo = 0o777;', true],
      ['const foo = 0O777;', true],
      ['const foo = 0o1000n;', true],
      ['const foo = 0O1000n;', true],
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
      ['const foo = 0o1000n;', 'const foo = 512n;', false],
      ['const foo = 0O1000n;', 'const foo = 512n;', false],
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
