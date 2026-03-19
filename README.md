# eslint-plugin-hex-under

Sometimes it's really hard for humans to read hexadecimal numbers and know the exact decimal value.

## hex-under

This ESLint plugin proves, if you use hexadecimal numbers in your code, that its value is less than or equal a specified value (default: 255). If you use a hexadecimal number greater than this specified value, it will be transformed to its decimal value.

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
