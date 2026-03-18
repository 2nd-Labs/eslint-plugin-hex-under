import { describe, expect, it } from 'vitest';
import { RuleTester } from 'eslint';
import octalUnder from '../src/rules/octal-under.js';

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2025 },
});

describe('hex-under rule', () => {
  describe('valid cases', () => {
    describe('with limit option', () => {
      it('allows octal under limit', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              options: [{ limit: 511 }],
              code: 'const foo = 0o747;',
            },
          ],
          invalid: [],
        });
      });

      it('allows octal equal to limit boundary', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              options: [{ limit: 511 }],
              code: 'const foo = 0o777;',
            },
          ],
          invalid: [],
        });
      });
    });

    describe('different declarations', () => {
      it('allows const declaration', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              options: [
                {
                  limit: 511,
                },
              ],
              code: 'const foo = 0o777;',
            },
          ],
          invalid: [],
        });
      });

      it('allows let declaration', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              options: [
                {
                  limit: 511,
                },
              ],
              code: 'let foo = 0o777;',
            },
          ],
          invalid: [],
        });
      });

      it('allows var declaration', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              options: [
                {
                  limit: 511,
                },
              ],
              code: 'var foo = 0o777;',
            },
          ],
          invalid: [],
        });
      });
    });

    describe('different contexts', () => {
      it('allows octal in function return', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              code: 'function func() {\n  return 0o777;\n}',
            },
          ],
          invalid: [],
        });
      });

      it('allows octal as function argument', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              code: 'functionA(0o777);',
            },
          ],
          invalid: [],
        });
      });

      it('allows octal in arrow function', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              code: 'const func = () => 0o777;',
            },
          ],
          invalid: [],
        });
      });

      it('ignores octal-like string', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              code: "const str = '0o777';",
            },
          ],
          invalid: [],
        });
      });

      it('ignores octal-like template string', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              code: '`value: 0o777`',
            },
          ],
          invalid: [],
        });
      });
    });

    describe('uppercase 0O valid cases', () => {
      it('allows uppercase octal under limit', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              options: [
                {
                  limit: 511,
                },
              ],
              code: 'const foo = 0O777;',
            },
          ],
          invalid: [],
        });
      });

      it('allows uppercase octal equal to limit', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              options: [
                {
                  limit: 511,
                },
              ],
              code: 'const foo = 0O777;',
            },
          ],
          invalid: [],
        });
      });
    });

    describe('bigint - valid cases', () => {
      it('allows octal bigint under limit (511)', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              options: [
                {
                  limit: 511,
                },
              ],
              code: 'const foo = 0o777n;',
            },
          ],
          invalid: [],
        });
      });

      it('allows octal bigint under small limit', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [
            {
              options: [
                {
                  limit: 8,
                },
              ],
              code: 'const foo = 0o7n;',
            },
          ],
          invalid: [],
        });
      });
    });
  });

  describe('invalid cases', () => {
    describe('basic replacements', () => {
      it.todo('replaces octal with decimal', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [],
          invalid: [
            {
              code: 'const foo = 0o100;',
              output: 'const foo = 64;',
              errors: 1,
            },
          ],
        });
      });
    });

    describe('different code contexts', () => {
      it.todo('replaces octal in function return', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [],
          invalid: [
            {
              code: 'function func() {\n  return 0o100;\n}',
              output: 'function func() {\n  return 64;\n}',
              errors: 1,
            },
          ],
        });
      });
    });

    describe('uppercase 0O invalid cases', () => {
      it.todo('replaces uppercase octal with decimal', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [],
          invalid: [
            {
              code: 'const foo = 0O100;',
              output: 'const foo = 64;',
              errors: 1,
            },
          ],
        });
      });

      it('handles uppercase octal in expressions', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [],
          invalid: [
            {
              code: 'if (0O1000 > 0) {}',
              output: 'if (512 > 0) {}',
              errors: 1,
            },
          ],
        });
      });

      it.todo('handles negative uppercase octal', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [],
          invalid: [
            {
              code: 'const foo = -0O100;',
              output: 'const foo = -64;',
              errors: 1,
            },
          ],
        });
      });
    });

    describe('number formats', () => {
      it.todo('handles negative octal', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [],
          invalid: [
            {
              code: 'const foo = -0o100;',
              output: 'const foo = -64;',
              errors: 1,
            },
          ],
        });
      });

      it.todo('handles numeric separators', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [],
          invalid: [
            {
              code: 'const foo = 0o1_00;',
              output: 'const foo = 64;',
              errors: 1,
            },
          ],
        });
      });
    });

    describe('expressions and structures', () => {
      it.todo('replaces octal in array', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [],
          invalid: [
            {
              code: 'const arr = [0o100];',
              output: 'const arr = [64];',
              errors: 1,
            },
          ],
        });
      });

      it.todo('replaces octal in object', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [],
          invalid: [
            {
              code: 'const obj = { a: 0o100 };',
              output: 'const obj = { a: 64 };',
              errors: 1,
            },
          ],
        });
      });

      it.todo('handles multiple octal numbers', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [],
          invalid: [
            {
              code: 'const a = 0o100; const b = 0o200;',
              output: 'const a = 64; const b = 128;',
              errors: 2,
            },
          ],
        });
      });
    });

    describe('invalid cases - skipBigInt option', () => {
      it('still reports bigint by default (skipBigInt = false)', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [],
          invalid: [
            {
              code: 'const foo = 0o1000n;',
              output: 'const foo = 512n;',
              errors: 1,
            },
          ],
        });
      });

      it.todo('skip bigint when skipBigInt is true', () => {
        expect.assertions(0);

        ruleTester.run('octal-under', octalUnder, {
          valid: [],
          invalid: [
            {
              code: 'const foo = 0o1000n;',
              options: [
                {
                  limit: 511,
                  skipBigInt: true,
                },
              ],
              output: 'const foo = 512n;',
              errors: 1,
            },
          ],
        });
      });
    });
  });
});
