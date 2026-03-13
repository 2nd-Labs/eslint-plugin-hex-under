# eslint-plugin-hex-under

Sometimes it's really hard for humans to read hexadecimal numbers and know the exact decimal value.

## Testing & Code Coverage

This project uses **Vitest** as its test runner with comprehensive code coverage tracking. All tests are written using Vitest's modern testing framework and ESLint's RuleTester for validating rule behavior.

### Running Tests

```sh
# Run all tests once
npm run test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run coverage
```

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

// invalid with { limit: 255 }
const signal = 0x21b;

let func = () => 0xabc;

function add(a, b) {
  return a + b + 0x100;
}

// This can be transformed to:
const signal = 539;

let func = () => 2748;

function add(a, b) {
  return a + b + 256;
}
```

## Integration

```sh
npm install --save-dev eslint-plugin-hex-under
```

```js
// eslint.config.js

const eslintPluginHexUnder = require("eslint-plugin-hex-under");

module.exports = [
  {
    files: ["*.js"],
    plugins: {
      "hex-under": eslintPluginHexUnder,
    },
    rules: {
      "hex-under/hex-under": ["error", { limit: 255 }],
    },
  },
];
```

#### Experimental BigInteger Support

There is a similar rule to prove for BigInteger hexadecimal numbers. You can enable it similar to the `hex-under` rule. The default limit is 255.

```js
// eslint.config.js

const eslintPluginHexUnder = require("eslint-plugin-hex-under");

module.exports = [
  {
    files: ["*.js"],
    plugins: {
      "hex-under": eslintPluginHexUnder,
    },
    rules: {
      "hex-under/hex-under-bigint": "warn",
    },
  },
];
```
