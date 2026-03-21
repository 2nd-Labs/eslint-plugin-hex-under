const foo = 0o777777; // ignore-octal-under

// ignore-octal-under
const bar = 0o1000;

const fooBar = 0o1000;

const hexFoo = 0xff0000; // ignore-hex-under

// ignore-hex-under
const hexBar = 0x1000000;

const hex_fooBar = 0x1000000; // ignore-hex-under
const hexFoo_Bar = 0x100;

const hexFooBar = 0x100;

const binaryFoo = 0b111111111111111111111111; // ignore-binary-under

// ignore-binary-under
const binaryBar = 0b1000000000000000000000000;

const binaryFooBar = 0b10000;
