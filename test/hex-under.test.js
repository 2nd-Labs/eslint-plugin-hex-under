import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import hexUnderRule from "../src/rules/hex-under.js";

describe("hex-under", () => {
  const ruleTester = new RuleTester({
    languageOptions: { ecmaVersion: 2022 },
  });

  it("should pass all valid and invalid cases", () => {
    ruleTester.run("hex-under", hexUnderRule, {
      valid: [
        {
          options: [{ limit: 255 }],
          code: "const foo = 0xff;",
        },
        {
          options: [{ limit: 15 }],
          code: "const foo = 0xf;",
        },
        {
          options: [{ limit: 256 }],
          code: "const foo = 0x100;",
        },
        {
          options: [{ limit: 255 }],
          code: "let foo = 0xff;",
        },
        {
          options: [{ limit: 256 }],
          code: "var foo = 0xff;",
        },
        {
          code: "function func() {\n  return 0xff;\n}",
        },
        {
          code: "functionA(0xef);",
        },
        {
          code: "const func = () => 0xab;",
        },
      ],
      invalid: [
        {
          code: "const foo = 0x100;",
          output: "const foo = 256;",
          errors: 1,
        },
        {
          code: "let foo = 0x100;",
          output: "let foo = 256;",
          errors: 1,
        },
        {
          code: "var foo = 0x100;",
          output: "var foo = 256;",
          errors: 1,
        },
        {
          code: "function func() {\n  return 0x100;\n}",
          output: "function func() {\n  return 256;\n}",
          errors: 1,
        },
        {
          code: "functionA(0x1234);",
          output: "functionA(4660);",
          errors: 1,
        },
        {
          code: "const func = () => 0xabc;",
          output: "const func = () => 2748;",
          errors: 1,
        },
      ],
    });
  });
});
