# eslint-plugin-hex-under

[![CI](https://github.com/2nd-Labs/eslint-plugin-hex-under/actions/workflows/build-and-test.yml/badge.svg?branch=main)](https://github.com/2nd-Labs/eslint-plugin-hex-under/actions/workflows/build-and-test.yml)

An ESLint plugin that keeps hexadecimal, binary, and octal numeric literals readable by enforcing configurable value limits.

When a non-decimal numeric literal exceeds its configured limit, the rule reports an error and provides an automatic ESLint fix that converts the value to decimal.

## Why?

Non-decimal numeric literals such as 0xfff or 0b101010101 can be compact, but they are not always easy to read or reason about at a glance.

This can lead to:

- Reduced code readability
- Slower code reviews
- Hard-to-understand magic numbers
- Unnecessary cognitive overhead when reading bitwise operations

`eslint-plugin-hex-under` lets you keep smaller, meaningful non-decimal literals while encouraging decimal notation for larger values.

## How it works

The plugin provides three independent rules:

| Rule                   | Format      | Default limit |
| ---------------------- | ----------- | ------------- |
| hex-under/hex-under    | Hexadecimal | 0xff (255)    |
| hex-under/binary-under | Binary      | 0b1111 (15)   |
| hex-under/octal-under  | Octal       | 0o777 (511)   |

The configured limit is inclusive.

For example, with the default hexadecimal limit of 255:

```js
const a = 0xff; // OK: 255
const b = 0x100; // Error: 256
```

## Installation

Requires ESLint v9+ with flat config.

```bash
npm install --save-dev eslint-plugin-hex-under
```

## Configuration

Add the plugin to your eslint.config.js:

```js
import eslintPluginHexUnder from 'eslint-plugin-hex-under';

export default [
  {
    files: ['**/*.js'],
    plugins: {
      'hex-under': eslintPluginHexUnder,
    },
    rules: {
      'hex-under/hex-under': ['error', { limit: 255, checkBigInt: true }],
      'hex-under/octal-under': ['error', { limit: 511, checkBigInt: true }],
      'hex-under/binary-under': ['error', { limit: 15, checkBigInt: true }],
    },
  },
];
```

You can enable only the formats you need.

For example:

```js
rules: {
  'hex-under/hex-under': ['error', { limit: 255 }],
}
```

### Examples

Valid with default limits

```js
const signal = 0xef; // 239

const func = () => 0xab; // 171

function add(a, b) {
  return a + b + 0x1f; // 31
}

const binary = 0b1111; // 15

const octal = 0o377; // 255

Invalid with default limits
const signal = 0x21b; // 539

const func = () => 0xabc; // 2748

function add(a, b) {
  return a + b + 0x100; // 256
}

const d = 0xaa_ffn;

const binary = 0b1_0000_0000; // 256

const octal = 0o1000; // 512
```

### Auto-fix

The rules are automatically fixable with ESLint's --fix option.

For example:

```js
const signal = 0x21b;

const func = () => 0xabc;

function add(a, b) {
  return a + b + 0x100;
}

const binary = 0b1_0000_0000;

const octal = 0o1000;
```

Running:

```bash
eslint . --fix
```

converts the values to decimal:

```js
const signal = 539;

const func = () => 2748;

function add(a, b) {
  return a + b + 256;
}

const binary = 256;

const octal = 512;
```

The source code is not modified during normal linting. Conversion only happens when ESLint's auto-fix functionality is used.

### Ignoring individual literals

You can disable a rule for a specific line using ESLint's standard inline comments:

```js
// eslint-disable-next-line hex-under/hex-under
const hexTooBig = 0xfffff;

// eslint-disable-next-line hex-under/binary-under
const binTooBig = 0b1000_0000_0000;

// eslint-disable-next-line hex-under/octal-under
const octalTooBig = 0o777777;
```

### BigInt

BigInt literals can optionally be checked using the checkBigInt option.

By default:

```js
checkBigInt: true;
```

For example:

```js
const mask = 0xdead_beefn;
```

With checkBigInt: true, this literal is checked against the configured limit.

If you don't want BigInt literals to be checked, set:

```js
checkBigInt: false;
```

For example:

```js
rules: {
  'hex-under/hex-under': [
    'error',
    {
      limit: 255,
      checkBigInt: false,
    },
  ],
}
```

This allows:

```js
const mask = 0xdead_beefn;
```

## Rules

| Rule                   | Description                         |
| ---------------------- | ----------------------------------- |
| hex-under/hex-under    | Limits hexadecimal numeric literals |
| hex-under/binary-under | Limits binary numeric literals      |
| hex-under/octal-under  | Limits octal numeric literals       |

Each rule can be configured independently.

## Options

| Option      | Type    | Default         | Description                               |
| ----------- | ------- | --------------- | ----------------------------------------- |
| limit       | number  | Format-specific | Maximum allowed numeric value             |
| checkBigInt | boolean | true            | Whether BigInt literals should be checked |

The limit is inclusive. A literal equal to the limit is valid; a literal greater than the limit is reported.

## Testing & Code Coverage

This project uses Vitest as its test runner and ESLint's RuleTester for validating rule behavior.

The project also uses bats to test the output of ESLint's --fix command.

## Running tests

### Run all tests:

```bash
npm run test:all
```

### Run Vitest:

```bash
npm run test
```

### Run Vitest in watch mode:

```bash
npm run test:watch
```

### Run tests with coverage:

```bash
npm run coverage
```

### Run bats tests:

```bash
npm run test:bats
```
