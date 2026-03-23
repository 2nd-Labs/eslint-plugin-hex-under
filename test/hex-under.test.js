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
    ])('%s should be valid', (testCase) => {
      expect.hasAssertions();

      valid(testCase);
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

  describe('default cases (comments)', () => {
    it.each([
      'const foo = 0x100; // ignore-hex-under',
      'const foo = 0x100n; // ignore-hex-under',
      'const foo = 0x100n; const bar = 0x100; // ignore-hex-under',
    ])(
      'should be valid with comment after the line',
      (testCaseWithComments) => {
        expect.hasAssertions();

        valid(testCaseWithComments);
      },
    );

    it.each([
      '// ignore-hex-under\nconst foo = 0x100;',
      '// ignore-hex-under\nconst foo = 0x100n;',
      '// ignore-hex-under\nconst foo = 0x100n; const bar = 0x100;',
    ])(
      'should be valid with comment above the line',
      (testCaseWithComments) => {
        expect.hasAssertions();

        valid(testCaseWithComments);
      },
    );

    it('should be valid with "ignore-all-hex-under" block comment at very first line', () => {
      expect.hasAssertions();

      valid(
        '/* ignore-all-hex-under */\n\nconst foo = 0x100;\nconst bar = 0xfff;',
      );
    });

    it('should be valid with "ignore-hex-under" block comment', () => {
      expect.hasAssertions();

      valid(
        '// This should be ignored by hex-under rule because of the comment.\n\n/* ignore-hex-under */\n\nconst foo = 0x111111111111111111111111;\nconst bar = 0x1000000000000000000000000;',
      );
    });

    it('should be invalid with "ignore-hex-under" line comment', async () => {
      expect.hasAssertions();

      const { result } = await invalid({
        code: 'const bar = 0x100; // ignore-hex-under\nconst foo = 0x100n;',
        errors: 1,
      });

      expect(result.output).toBe(
        'const bar = 0x100; // ignore-hex-under\nconst foo = 256n;',
      );
      expect(result.fixed).toBe(true);
    });

    it('should fail with "ignore-binary-under" line comment', async () => {
      expect.hasAssertions();

      const { result } = await invalid({
        code: 'const bar = 0x100; // ignore-binary-under\nconst foo = 0x100n;',
        errors: 2,
      });

      expect(result.output).toBe(
        'const bar = 256; // ignore-binary-under\nconst foo = 256n;',
      );
      expect(result.fixed).toBe(true);
    });

    it('should fail with "ignore-octal-under" line comment', async () => {
      expect.hasAssertions();

      const { result } = await invalid({
        code: 'const bar = 0x100; // ignore-octal-under\nconst foo = 0x100n;',
        errors: 2,
      });

      expect(result.output).toBe(
        'const bar = 256; // ignore-octal-under\nconst foo = 256n;',
      );
      expect(result.fixed).toBe(true);
    });

    it('should fail with "ignore-all-hex-under" block comment not on the very first line', async () => {
      expect.hasAssertions();

      const { result } = await invalid({
        code: '// This should fail.\n/* ignore-all-hex-under */\n\nconst foo = 0x100;\nconst bar = 0x101;',
        errors: 2,
      });

      expect(result.output).toBe(
        '// This should fail.\n/* ignore-all-hex-under */\n\nconst foo = 256;\nconst bar = 257;',
      );
      expect(result.fixed).toBe(true);
    });

    it('should fail with "ignore-binary-under" and "ignore-octal-under" block comments', async () => {
      expect.hasAssertions();

      const { result } = await invalid({
        code: '// This should fail.\n/* ignore-octal-under */\n\n/* ignore-binary-under */\nconst foo = 0b10000;\nconst bar = 0b10001;\nconst bat = 0x100;\nlet octalFoo = 0o1000;',
        errors: 1,
      });

      expect(result.output).toBe(
        '// This should fail.\n/* ignore-octal-under */\n\n/* ignore-binary-under */\nconst foo = 0b10000;\nconst bar = 0b10001;\nconst bat = 256;\nlet octalFoo = 0o1000;',
      );
      expect(result.fixed).toBe(true);
    });
  });
});
