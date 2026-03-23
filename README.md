# eslint-plugin-hex-under

Improve readability by enforcing limits on non-decimal numeric literals (hex, binary, octal).

This plugin helps prevent hard-to-read numeric literals by automatically converting large values into their decimal representation or raising an error.

## Why?

Numeric literals like `0xfff` or `0b101010101` are compact, but often hard to read and reason about.

## hex-under

This ESLint plugin ensures that numeric literals written in non-decimal formats (hexadecimal, binary, or octal) do not exceed a specified maximum value. By default, the limit corresponds to the largest commonly used value for each format (`255` for hexadecimal, `15` for binary, and `511` for octal). Values exceeding the limit are automatically converted to their decimal representation.

## When should I use this?

Use this plugin if:

- You care about code readability
- Your team avoids "magic numbers"
- You review low-level or bitwise-heavy code

### Example

```js
// valid with { limit: 255 }
const signal = 0xef;

let func = () => 0xab;

function add(a, b) {
  return a + b + 0x1f;
}

const binary = 0b1111_1111;

const octal = 0o377;

/* You can also turn off the rule with a comment, see next examples */
// ignore-hex-under
const hexTooBig = 0xfffff;
const binTooBig = 0b1000_0000_0000; // ignore-binary-under
// ignore-octal-under
const octalTooBig = 0o777777;

// valid with { limit: 255, skipBigInt: true }
const mask = 0xdead_beefn;

// invalid with { limit: 255 }
const signal = 0x21b;

let func = () => 0xabc;

function add(a, b) {
  return a + b + 0x100;
}

let d = 0xaa_ffn;

const binary = 0b1_0000_0000;

const octal = 0o400;

// This can be transformed to:
const signal = 539;

let func = () => 2748;

function add(a, b) {
  return a + b + 256;
}

let d = 43775;

const binary = 256;

const octal = 256;
```

If you want to disable all rules, you can paste a special block comment at the very first line of the file.

```js
/* ignore-all-hex-under */

// this all will be ignored
const foo = 0xffff;

const bar = 0b10100010101;
```

Or you disable every rule separately with a block comment before the code, e.g.:

```js
// This should be ignore all hex numbers but not octal or binary numbers.

/* ignore-hex-under */

const hex = 0x100; // This should stay 0x100
const octal = 0o1000; // This should be fixed to 512
const binary = 0b10000; // This should be fixed to 16
```

## Integration

```sh
npm install --save-dev eslint-plugin-hex-under
```

```js
// eslint.config.js

import eslintPluginHexUnder from 'eslint-plugin-hex-under';

export default [
  {
    files: ['*.js'],
    plugins: {
      'hex-under': eslintPluginHexUnder,
    },
    rules: {
      'hex-under/hex-under': ['error', { limit: 255, skipBigInt: false }],
      'hex-under/octal-under': ['error', { limit: 511, skipBigInt: false }],
      'hex-under/binary-under': ['error', { limit: 15, skipBigInt: false }],
    },
  },
];
```

## Configuration

| Option       | Type    | Default         | Description           |
| ------------ | ------- | --------------- | --------------------- |
| `limit`      | number  | format-specific | Maximum allowed value |
| `skipBigInt` | boolean | false           | Ignore BigInt values  |

## Testing & Code Coverage

This project uses **Vitest** as its test runner with comprehensive code coverage tracking. All tests are written using Vitest's modern testing framework and ESLint's RuleTester for validating rule behavior.
Additionally this project uses bats to test the `eslint --fix` command's output.

### Running Tests

```sh
# Run all tests once
npm run test:all

# Run vitest tests
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run coverage

# Run bats tests
npm run test:bats
```
