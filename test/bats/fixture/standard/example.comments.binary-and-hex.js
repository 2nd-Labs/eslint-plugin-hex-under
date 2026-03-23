// This should be ignored by binary-under and hex-under rules because of the comment.

/* ignore-binary-under */
/* ignore-hex-under */

const foo = 0b111111111111111111111111;

const bar = 0b1000000000000000000000000;

const fooBar = 0b10000;

const hexFoo = 0x100;

const octalFoo = 0o1000;

const bigIntFoo = 0b111111111111111111111111n;

const bigIntBar = 0b1000000000000000000000000n;

const bigIntFooBar = 0b10000n;

const bigIntHexFoo = 0x100n;
