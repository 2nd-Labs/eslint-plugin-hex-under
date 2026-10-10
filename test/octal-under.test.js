import { createRuleTester } from 'eslint-vitest-rule-tester';
import { describe, expect, it } from 'vitest';
import rule from '../src/rules/octal-under.js';

function expectRuleError(result, code, output, limit) {
  const raw = code.match(/0[oO][0-7_]+n?/)?.[0];
  const value = output.match(/=\s*-?(\d+)n?/)?.[1];

  expect(result.messages).toHaveLength(1);
  expect(result.messages[0]).toMatchObject({
    messageId: 'valueOver',
    message: `Octal number ${raw} (${value}) exceeds the limit of ${limit}.`,
  });
}

describe('hex-under/octal-under', () => {
  it('defines the rule defaults, option schema, and diagnostic', () => {
    expect.assertions(1);

    expect(rule.meta).toMatchObject({
      docs: {
        description: 'Ensures octal numbers do not exceed a limit.',
        recommended: false,
      },
      languages: ['js/js'],
      fixable: 'code',
      defaultOptions: [{ limit: 511, checkBigInt: true }],
      schema: [
        {
          type: 'object',
          properties: {
            limit: {
              type: 'integer',
              minimum: 0,
              description: 'The maximum allowed value for octal literals.',
            },
            checkBigInt: {
              type: 'boolean',
              description: 'Whether to check BigInt literals.',
            },
          },
          description: 'Options for octal-under rule',
          additionalProperties: false,
        },
      ],
      messages: {
        valueOver:
          'Octal number {{ raw }} ({{ value }}) exceeds the limit of {{ limit }}.',
      },
    });
  });

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

      expect(result.messages).toHaveLength(0);
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

      expectRuleError(result, testCase, output, 511);

      expect(result.messages[0].fix).toBeDefined();
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

      expect(result.messages).toHaveLength(0);
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

      expect(result.messages).toHaveLength(0);
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

      expectRuleError(result, testCase, output, limit);

      expect(result.messages[0].fix).toBeDefined();
      expect(result.output).toBe(output);
      expect(result.fixed).toBe(true);
    });
  });

  describe('with option checkBigInt', () => {
    it.each([
      ['const foo = 0o777;', false],
      ['const foo = 0O777;', false],
      ['const foo = 0o1000n;', false],
      ['const foo = 0O1000n;', false],
    ])(
      '%s should be valid with checkBigInt=%s',
      async (testCase, checkBigInt) => {
        expect.hasAssertions();

        const { result } = await valid({
          code: testCase,
          options: {
            checkBigInt: checkBigInt,
          },
        });

        expect(result.messages).toHaveLength(0);
        expect(result.output).toBe(testCase);
        expect(result.fixed).toBe(false);
      },
    );

    it.each([
      ['const foo = 0o1000n;', 'const foo = 512n;', true],
      ['const foo = 0O1000n;', 'const foo = 512n;', true],
    ])(
      '%s should fail with checkBigInt=true',
      async (testCase, output, checkBigInt) => {
        expect.hasAssertions();

        const { result } = await invalid({
          code: testCase,
          options: {
            checkBigInt: checkBigInt,
          },
          errors: 1,
        });

        expectRuleError(result, testCase, output, 511);

        expect(result.messages[0].fix).toBeDefined();
        expect(result.output).toBe(output);
        expect(result.fixed).toBe(true);
      },
    );
  });
});
