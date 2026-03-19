# Testcases

## hex-under

### Standard (limit: 255, skipBigInt: false)

#### valid

```js
const foo = 0xff;
// prettier-ignore
const foo = 0Xff;

const foo = 0xffn;
// prettier-ignore
const foo = 0Xffn;

// prettier-ignore
const foo = 0xFF;
// prettier-ignore
const foo = 0XFF;

// prettier-ignore
const foo = 0xFFn;
// prettier-ignore
const foo = 0XFFn;

// prettier-ignore
const foo = 0xFf;
// prettier-ignore
const foo = 0XFf;

// prettier-ignore
const foo = 0xFfn;
// prettier-ignore
const foo = 0XFfn;

// prettier-ignore
const foo = 0xF_f;
// prettier-ignore
const foo = 0XF_f;

// prettier-ignore
const foo = 0xF_fn;
// prettier-ignore
const foo = 0XF_fn;
```

#### invalid

```js
const foo = 0x100;
// prettier-ignore
const foo = 0X100;

const foo = 0x100n;
// prettier-ignore
const foo = 0X100n;

// prettier-ignore
const foo = 0x100;
// prettier-ignore
const foo = 0X100;

// prettier-ignore
const foo = 0x100n;
// prettier-ignore
const foo = 0X100n;
```

This will all be fixed to:

```js
const foo = 256; // or 256n;
```

### Limit (limit: 15, skipBigInt: false)

#### valid

With option `{ limit: 15 }` this will be valid:

```js
const foo = 0xf;
// prettier-ignore
const foo = 0Xf;

const foo = 0xfn;
// prettier-ignore
const foo = 0Xfn;

// prettier-ignore
const foo = 0xF;
// prettier-ignore
const foo = 0XF;

// prettier-ignore
const foo = 0xFn;
// prettier-ignore
const foo = 0XFn;
```

#### invalid

With option `{ limit: 15 }` this will be invalid:

```js
const foo = 0x10;
// prettier-ignore
const foo = 0X10;

const foo = 0x10n;
// prettier-ignore
const foo = 0X10n;

// prettier-ignore
const foo = 0x10;
// prettier-ignore
const foo = 0X10;

// prettier-ignore
const foo = 0x10n;
// prettier-ignore
const foo = 0X10n;
```

This will all be fixed to:

```js
const foo = 16;
```

### SkipBigInt (limit: 255, skipBigInt: true)

#### valid

With option `{ skipBigInt: true }` this will be valid:

```js
const foo = 0xff;
// prettier-ignore
const foo = 0Xff;

const foo = 0xffffn;
// prettier-ignore
const foo = 0Xffffn;

// prettier-ignore
const foo = 0xFF;
// prettier-ignore
const foo = 0XFF;

// prettier-ignore
const foo = 0xFFFFn;
// prettier-ignore
const foo = 0XFFFFn;
```

## octal-under

### Standard (limit: 511, skipBigInt: false)

#### valid

```js
const foo = 0o777;
// prettier-ignore
const foo = 0O777;

const foo = 0o777n;
// prettier-ignore
const foo = 0O777n;

// prettier-ignore
const foo = 0o7_77;
// prettier-ignore
const foo = 0O7_77;

// prettier-ignore
const foo = 0o7_77n;
// prettier-ignore
const foo = 0O7_77n;
```

#### invalid

```js
const foo = 0o1000;
// prettier-ignore
const foo = 0O1000;

const foo = 0o1000n;
// prettier-ignore
const foo = 0O1000n;

// prettier-ignore
const foo = 0o1_000;
// prettier-ignore
const foo = 0O1_000;

// prettier-ignore
const foo = 0o1_000n;
// prettier-ignore
const foo = 0O1_000n;
```

This all will be fixed to:

```js
const foo = 512; // or 512n;
```

### Limit (limit: 7, skipBigInt: false)

#### valid

With option `{ limit: 7 }` this will be valid:

```js
const foo = 0o7;
// prettier-ignore
const foo = 0O7;

const foo = 0o7n;
// prettier-ignore
const foo = 0O7n;
```

#### invalid

With option `{ limit: 7 }` this will be invalid:

```js
const foo = 0o10;
// prettier-ignore
const foo = 0O10;

const foo = 0o10n;
// prettier-ignore
const foo = 0O10n;
```

This all will be fixed to:

```js
const foo = 8; // or 8n;
```

### SkipBigInt (limit: 511, skipBigInt: true)

#### valid

With option `{ skipBigInt: true }` this will be valid:

```js
const foo = 0o777;
// prettier-ignore
const foo = 0O777;

const foo = 0o1000n;
// prettier-ignore
const foo = 0O1000n;
```

## binary-under

### Standard

### Limit

### SkipBigInt
