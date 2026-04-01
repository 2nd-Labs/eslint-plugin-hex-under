import { createRuleTester } from 'eslint-vitest-rule-tester';
import { describe, expect, it } from 'vitest';
import rule from '../src/rules/hex-under.js';

describe('hex-under/hex-under', () => {
  const { valid, invalid } = createRuleTester({
    name: 'hex-under/hex-under',
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
    ])('%s should be valid', async (testCase) => {
      expect.hasAssertions();

      const { result } = await valid({
        code: testCase,
      });

      expect(result.output).toBe(testCase);
      expect(result.fixed).toBe(false);
    });

    it.each(['const foo = 0x100;', 'const foo = 0X100;'])(
      '%s should be invalid',
      async (testCase) => {
        expect.hasAssertions();

        const { result } = await invalid({
          code: testCase,
          errors: 1,
        });

        expect(result.output).toBe('const foo = 256;');
        expect(result.fixed).toBe(true);
      },
    );

    it.each(['const foo = 0x100n;', 'const foo = 0X100n;'])(
      '%s should be invalid (bigint)',
      async (testCase) => {
        expect.hasAssertions();

        const { result } = await invalid({
          code: testCase,
          errors: 1,
        });

        expect(result.output).toBe('const foo = 256n;');
        expect(result.fixed).toBe(true);
      },
    );

    it('should be invalid with multiple errors in one line', async () => {
      expect.hasAssertions();

      const { result } = await invalid({
        code: 'const foo = -0X100n;\nconst bar = -0x100;',
        errors: 2,
      });

      expect(result.output).toBe('const foo = -256n;\nconst bar = -256;');
      expect(result.fixed).toBe(true);
    });
  });

  describe('comments', () => {
    it('should be valid with line comment above the code', async () => {
      expect.hasAssertions();

      const { result } = await valid({
        code: '// eslint-disable-next-line\nconst hexTooBig = 0xfffff;',
      });

      expect(result.output).toBe(
        '// eslint-disable-next-line\nconst hexTooBig = 0xfffff;',
      );
      expect(result.fixed).toBe(false);
    });
  });

  describe('with custom limit', () => {
    it.each([
      ['const foo = 0xf;', 15],
      ['const foo = 0Xf;', 15],
      ['const foo = 0xfn;', 15],
      ['const foo = 0Xfn;', 15],
      ['const foo = 0xF;', 15],
      ['const foo = 0XF;', 15],
      ['const foo = 0xFn;', 15],
      ['const foo = 0XFn;', 15],
      ['const foo = 0xFF_FF', 65535],
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
      ['const foo = 0x10;', 'const foo = 16;', 15],
      ['const foo = 0X10;', 'const foo = 16;', 15],
      ['const foo = 0x10n;', 'const foo = 16n;', 15],
      ['const foo = 0X10n;', 'const foo = 16n;', 15],
      ['const foo = 0xff_FF;', 'const foo = 65535;', 65534],
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

  describe('with option "skipBigInt"', () => {
    it.each([
      ['const foo = 0xff;', true],
      ['const foo = 0Xff;', true],
      ['const foo = 0xffffn;', true],
      ['const foo = 0Xffffn;', true],
      ['const foo = 0xFF;', true],
      ['const foo = 0XFF;', true],
      ['const foo = 0xFFFFn;', true],
      ['const foo = 0XFFFFn;', true],
      ['const foo = 0xff_ffn', true],
      ['const foo = 0xFfn', false],
      ['const foo = 0xFf_Ffn', true],
      ['const foo = 0xabn', false],
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
  });

  it.each([
    ['const foo = 0x100n;', 'const foo = 256n;'],
    ['const foo = 0X100n;', 'const foo = 256n;'],
  ])('%s should fail with skipBigInt=false', async (testCase, output) => {
    expect.hasAssertions();

    const { result } = await invalid({
      code: testCase,
      options: {
        skipBigInt: false,
      },
      errors: 1,
    });

    expect(result.output).toBe(output);
    expect(result.fixed).toBe(true);
  });
});
