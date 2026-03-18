function def(abc) {
  return 0xff;
}

function defBigInt(abc) {
  return 0xffn;
}

const a = 0x1;
const b = 256;
const c = 0x101;
const d = 512n;

def(0x100);
defBigInt(0x100n);

const e = -0x10_0;
const f = -0x10_0n;

// prettier-ignore
const g = 0X10_2;
// prettier-ignore
const h = 0X10_2n;

const i = 0x1_0;
const j = 0x1_0n;
