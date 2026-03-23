# eslint-plugin-hex-under

Enforce readability by limiting non-decimal numeric literals (hex, binary, octal) in JavaScript.

Automatically converts large non-decimal literals into readable decimal values or reports them as errors.

## Why?

Numeric literals like `0xfff` or `0b101010101` are compact, but often hard to read and reason about—especially for developers unfamiliar with bitwise operations.

This can lead to:

- Reduced code readability
- Slower code reviews
- Hidden "magic numbers"

This plugin enforces limits to keep numeric literals understandable at a glance.

## hex-under

This ESLint plugin ensures that numeric literals written in non-decimal formats (hexadecimal, binary, or octal) do not exceed a specified maximum value.
By default, the limits are:

- Hexadecimal: `0xff` (255)
- Binary: `0b1111` (15)
- Octal: `0o777` (511)

Values exceeding these limits are automatically converted to decimal.

## When should I use this?

Use this plugin if:

- You want to improve code readability in your codebase
- Your team avoids hard-to-read numeric literals ("magic numbers")
- You work with bitwise operations but want to keep them understandable
- You review code where non-decimal formats are frequently used

### Examples

#### valid with default limits

```js
const signal = 0xef; // OK: below default hex limit (255)

let func = () => 0xab;

function add(a, b) {
  return a + b + 0x1f;
}

const binary = 0b1111_1111;

const octal = 0o377;
```

#### Invalid with default limits

```js
const signal = 0x21b;

let func = () => 0xabc;

function add(a, b) {
  return a + b + 0x100;
}

let d = 0xaa_ffn;

const binary = 0b1_0000_0000;

const octal = 0o400;
```

#### Auto-fixable

```js
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

#### Ignore with line comments

```js
// ignore-hex-under
const hexTooBig = 0xfffff;

const binTooBig = 0b1000_0000_0000; // ignore-binary-under

// ignore-octal-under
const octalTooBig = 0o777777;
```

#### Ignore Bigint values

```js
// valid with { limit: 255, skipBigInt: true }
const mask = 0xdead_beefn;
```

#### Disable rules globally

```js
/* ignore-all-hex-under */

// ignore-all-hex-under must be the very first line and a block comment.
// This will ignore all of the whole file.
const foo = 0xffff;
const bar = 0b10100010101;
```

#### Disable specific formats

```js
// This should ignore all hex numbers but not octal or binary numbers.

/* ignore-hex-under */

const hex = 0x100; // stays 0x100
const octal = 0o1000; // fixed to 512
const binary = 0b10000; // fixed to 16
```

## Integration

Requires ESLint v9+ (flat config)

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

## Rules

| Rule                     | Description                 |
| ------------------------ | --------------------------- |
| `hex-under/hex-under`    | Limits hexadecimal literals |
| `hex-under/binary-under` | Limits binary literals      |
| `hex-under/octal-under`  | Limits octal literals       |

## Configuration

| Option       | Type    | Default         | Description           |
| ------------ | ------- | --------------- | --------------------- |
| `limit`      | number  | format-specific | Maximum allowed value |
| `skipBigInt` | boolean | false           | Ignore BigInt values  |

### Ignoring rules

You can disable rules using inline comments:

- `ignore-hex-under`
- `ignore-binary-under`
- `ignore-octal-under`

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
