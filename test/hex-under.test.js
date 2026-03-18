import { describe, expect, it } from 'vitest';
import { RuleTester } from 'eslint';
import hexUnderRule from '../src/rules/hex-under.js';

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2025 },
});

describe('hex-under rule', () => {
  describe('valid cases', () => {
    describe('with limit option', () => {
      it('allows hex under limit', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [
            {
              options: [{ limit: 255 }],
              code: 'const foo = 0xff;',
            },
          ],
          invalid: [],
        });
      });

      it('allows small hex under custom limit', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [
            {
              options: [{ limit: 15 }],
              code: 'const foo = 0xf;',
            },
          ],
          invalid: [],
        });
      });

      it('allows hex equal to limit boundary', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [
            {
              options: [{ limit: 256 }],
              code: 'const foo = 0x100;',
            },
          ],
          invalid: [],
        });
      });
    });

    describe('different declarations', () => {
      it('allows const declaration', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [{ options: [{ limit: 255 }], code: 'const foo = 0xff;' }],
          invalid: [],
        });
      });

      it('allows let declaration', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [{ options: [{ limit: 255 }], code: 'let foo = 0xff;' }],
          invalid: [],
        });
      });

      it('allows var declaration', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [{ options: [{ limit: 256 }], code: 'var foo = 0xff;' }],
          invalid: [],
        });
      });
    });

    describe('different contexts', () => {
      it('allows hex in function return', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [{ code: 'function func() {\n  return 0xff;\n}' }],
          invalid: [],
        });
      });

      it('allows hex as function argument', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [{ code: 'functionA(0xef);' }],
          invalid: [],
        });
      });

      it('allows hex in arrow function', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [{ code: 'const func = () => 0xab;' }],
          invalid: [],
        });
      });

      it('ignores hex-like string', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [{ code: "const str = '0x100';" }],
          invalid: [],
        });
      });

      it('ignores hex-like template string', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [{ code: '`value: 0x100`' }],
          invalid: [],
        });
      });
    });

    describe('uppercase 0X valid cases', () => {
      it('allows uppercase hex under limit', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [
            {
              options: [{ limit: 255 }],
              code: 'const foo = 0Xff;',
            },
          ],
          invalid: [],
        });
      });

      it('allows uppercase hex equal to limit', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [
            {
              options: [{ limit: 256 }],
              code: 'const foo = 0X100;',
            },
          ],
          invalid: [],
        });
      });
    });
  });

  describe('invalid cases', () => {
    describe('basic replacements', () => {
      it('replaces hex with decimal', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'const foo = 0x100;',
              output: 'const foo = 256;',
              errors: 1,
            },
          ],
        });
      });

      it('replaces hex in let declaration', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'let foo = 0x100;',
              output: 'let foo = 256;',
              errors: 1,
            },
          ],
        });
      });

      it('replaces hex in var declaration', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'var foo = 0x100;',
              output: 'var foo = 256;',
              errors: 1,
            },
          ],
        });
      });
    });

    describe('different code contexts', () => {
      it('replaces hex in function return', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'function func() {\n  return 0x100;\n}',
              output: 'function func() {\n  return 256;\n}',
              errors: 1,
            },
          ],
        });
      });

      it('replaces hex in function call', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'functionA(0x1234);',
              output: 'functionA(4660);',
              errors: 1,
            },
          ],
        });
      });

      it('replaces hex in arrow function', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'const func = () => 0xabc;',
              output: 'const func = () => 2748;',
              errors: 1,
            },
          ],
        });
      });
    });

    describe('uppercase 0X invalid cases', () => {
      it('replaces uppercase hex with decimal', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'const foo = 0X100;',
              output: 'const foo = 256;',
              errors: 1,
            },
          ],
        });
      });

      it('handles uppercase hex in expressions', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'if (0XABC > 0) {}',
              output: 'if (2748 > 0) {}',
              errors: 1,
            },
          ],
        });
      });

      it('handles negative uppercase hex', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'const foo = -0X100;',
              output: 'const foo = -256;',
              errors: 1,
            },
          ],
        });
      });

      it('handles mixed case hex digits with 0X', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'const foo = 0XaBc;',
              output: 'const foo = 2748;',
              errors: 1,
            },
          ],
        });
      });
    });

    describe('number formats', () => {
      it('handles uppercase hex', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'const foo = 0xABC;',
              output: 'const foo = 2748;',
              errors: 1,
            },
          ],
        });
      });

      it('handles negative hex', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'const foo = -0x100;',
              output: 'const foo = -256;',
              errors: 1,
            },
          ],
        });
      });

      it('handles numeric separators', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'const foo = 0x1_00;',
              output: 'const foo = 256;',
              errors: 1,
            },
          ],
        });
      });
    });

    describe('expressions and structures', () => {
      it('replaces hex in condition', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'if (0x100 > 5) {}',
              output: 'if (256 > 5) {}',
              errors: 1,
            },
          ],
        });
      });

      it('replaces hex in array', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'const arr = [0x100];',
              output: 'const arr = [256];',
              errors: 1,
            },
          ],
        });
      });

      it('replaces hex in object', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'const obj = { a: 0x100 };',
              output: 'const obj = { a: 256 };',
              errors: 1,
            },
          ],
        });
      });

      it('handles multiple hex numbers', () => {
        expect.assertions(0);

        ruleTester.run('hex-under', hexUnderRule, {
          valid: [],
          invalid: [
            {
              code: 'const a = 0x100; const b = 0x200;',
              output: 'const a = 256; const b = 512;',
              errors: 2,
            },
          ],
        });
      });
    });
  });
});
