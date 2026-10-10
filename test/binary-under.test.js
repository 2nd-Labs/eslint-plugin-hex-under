import { createRuleTester } from 'eslint-vitest-rule-tester';
import { describe, expect, it } from 'vitest';
import rule from '../src/rules/binary-under.js';

function expectRuleError(result, code, output, limit) {
  const raw = code.match(/0[bB][01_]+n?/)?.[0];
  const value = output.match(/=\s*-?(\d+)n?/)?.[1];

  expect(result.messages).toHaveLength(1);
  expect(result.messages[0]).toMatchObject({
    messageId: 'valueOver',
    message: `Binary number ${raw} (${value}) exceeds the limit of ${limit}.`,
  });
}

describe('hex-under/binary-under', () => {
  it('defines the rule defaults, option schema, and diagnostic', () => {
    expect.assertions(1);

    expect(rule.meta).toMatchObject({
      docs: {
        description: 'Ensures binary numbers do not exceed a limit.',
        recommended: false,
      },
      languages: ['js/js'],
      fixable: 'code',
      defaultOptions: [{ limit: 15, checkBigInt: true }],
      schema: [
        {
          type: 'object',
          properties: {
            limit: {
              type: 'integer',
              minimum: 0,
              description: 'The maximum allowed value for binary literals.',
            },
            checkBigInt: {
              type: 'boolean',
              description: 'Whether to check BigInt literals.',
            },
          },
          description: 'Options for binary-under rule',
          additionalProperties: false,
        },
      ],
      messages: {
        valueOver:
          'Binary number {{ raw }} ({{ value }}) exceeds the limit of {{ limit }}.',
      },
    });
  });

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

      expect(result.messages).toHaveLength(0);
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

      expectRuleError(result, testCase, output, 15);

      expect(result.messages[0].fix).toBeDefined();
      expect(result.output).toBe(output);
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

      expect(result.messages).toHaveLength(0);
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

      expectRuleError(result, testCase, output, limit);

      expect(result.messages[0].fix).toBeDefined();
      expect(result.output).toBe(output);
      expect(result.fixed).toBe(true);
    });
  });

  describe('with option checkBigInt', () => {
    it.each([
      ['const foo = 0b1111;', false],
      ['const foo = 0B1111;', false],
      ['const foo = 0b100000000n;', false],
      ['const foo = 0B100000000n;', false],
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
      ['const foo = 0b100000000n;', 'const foo = 256n;', true],
      ['const foo = 0B100000000n;', 'const foo = 256n;', true],
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

        expectRuleError(result, testCase, output, 15);

        expect(result.messages[0].fix).toBeDefined();
        expect(result.output).toBe(output);
        expect(result.fixed).toBe(true);
      },
    );
  });
});
