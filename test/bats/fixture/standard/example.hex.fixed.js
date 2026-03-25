const total = 0x10 + 0x1f + 768;

const obj = {
  small: 0x0a,
  medium: 0xff,
  large: 291,
  bigIntSmall: 0xfen,
  bigIntLarge: 291n,
};

const arr = [0x5, 0x10, 291, 0xabn];

let foo = 2308796;

const bar = 16772829;

const baz = 1051324;

const qux = 1048576;

const quux = 1048576n;

const a = -0x1a;
const b = -0xf_f;
const c = -65536;
const d = -65536n;

function add(x, y) {
  return x + y;
}

add(0xa, 0xff);
add(256, 0x1n);

const e = 0x1;
const f = 256;
const g = 0xff;
const h = 512n;

function functionA(integer) {
  return 0x13n;
}

functionA(4660);

const i = 74565;

const func = () => 1193046;

var x = 36980070n;

/* prettier-ignore */
function abc(def) {
  return 16711680;
}

const y = 511;
