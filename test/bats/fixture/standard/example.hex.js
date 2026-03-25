const total = 0x10 + 0x1f + 0x300;

const obj = {
  small: 0x0a,
  medium: 0xff,
  large: 0x123,
  bigIntSmall: 0xfen,
  bigIntLarge: 0x123n,
};

const arr = [0x5, 0x10, 0x123, 0xabn];

let foo = 0x233abc;

const bar = 0xff_ee_dd;

const baz = 0x100_abc;

const qux = 0x1_00_000;

const quux = 0x1_00_000n;

const a = -0x1a;
const b = -0xf_f;
const c = -0x1_0000;
const d = -0x1_0000n;

function add(x, y) {
  return x + y;
}

add(0xa, 0xff);
add(0x100, 0x1n);

const e = 0x1;
const f = 0x100;
const g = 0xff;
const h = 0x200n;

function functionA(integer) {
  return 0x13n;
}

functionA(0x1234);

const i = 0x12345;

const func = () => 0x123456;

var x = 0x2344566n;

/* prettier-ignore */
function abc(def) {
  return 0XFf0000;
}

const y = 0x1_f_f;
