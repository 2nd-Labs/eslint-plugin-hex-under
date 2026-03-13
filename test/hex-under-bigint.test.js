import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import hexUnderBigintRule from "../src/rules/hex-under-bigint.js";

describe("hex-under-bigint", () => {
  const ruleTester = new RuleTester({
    languageOptions: {
      ecmaVersion: 2022,
    },
  });

  it("should pass all valid and invalid cases", () => {
    ruleTester.run("hex-under-bigint", hexUnderBigintRule, {
      valid: [
        {
          options: [{ limit: 255 }],
          code: "const foo = 0xffn;",
        },
        {
          options: [{ limit: 15 }],
          code: "const foo = 0xfn;",
        },
        {
          options: [{ limit: 256 }],
          code: "const foo = 0x100n;",
        },
        {
          options: [{ limit: 255 }],
          code: "let foo = 0xffn;",
        },
        {
          options: [{ limit: 256 }],
          code: "var foo = 0xffn;",
        },
        {
          code: "function func() {\n  return 0xffn;\n}",
        },
        {
          code: "functionA(0xefn);",
        },
        {
          code: "const func = () => 0xabn;",
        },
      ],
      invalid: [
        {
          code: "const foo = 0x100n;",
          output: "const foo = 256n;",
          errors: 1,
        },
        {
          code: "let bar = 0x1ffn;",
          output: "let bar = 511n;",
          options: [{ limit: 300 }],
          errors: 1,
        },
        {
          code: "const big = 0x12345n;",
          output: "const big = 74565n;",
          options: [{ limit: 70000 }],
          errors: 1,
        },
      ],
    });
  });
});
