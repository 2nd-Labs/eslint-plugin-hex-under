function def(abc) {
  return 255;
}

function defBigInt(abc) {
  return 255n;
}

const a = 0x1;
const b = 256;
const c = 257;
const d = 512n;

def(256);
defBigInt(256n);

const e = -256;
const f = -256n;

// prettier-ignore
const g = 258;
// prettier-ignore
const h = 258n;

const i = 0x1_0;
const j = 0x1_0n;
