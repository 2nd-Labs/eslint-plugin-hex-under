import { describe, expect, it } from 'vitest';
import binaryRule from '../src/rules/binary-under.js';
import hexRule from '../src/rules/hex-under.js';
import octalRule from '../src/rules/octal-under.js';

const rules = [
  {
    name: 'binary',
    rule: binaryRule,
    prefix: '0b',
    radix: 2,
    limit: 15,
  },
  {
    name: 'hexadecimal',
    rule: hexRule,
    prefix: '0x',
    radix: 16,
    limit: 255,
  },
  {
    name: 'octal',
    rule: octalRule,
    prefix: '0o',
    radix: 8,
    limit: 511,
  },
];

function runRule(rule, raw, options = {}) {
  const reports = [];
  const listeners = rule.create({
    options: [options],
    report: (report) => reports.push(report),
  });
  const listenerKey = Object.keys(listeners).find((key) =>
    key.startsWith('Literal['),
  );
  const node = { raw };

  expect(listeners[listenerKey]).toBeTypeOf('function');

  listeners[listenerKey](node);

  return { node, reports };
}

describe.each(rules)(
  '$name rule execution',
  ({ rule, prefix, radix, limit }) => {
    it('compares numeric literals to the inclusive limit and reports over-limit values', () => {
      expect.assertions(5);

      const atLimit = runRule(rule, `${prefix}${limit.toString(radix)}`);

      expect(atLimit.reports).toHaveLength(0);

      const aboveLimit = runRule(
        rule,
        `${prefix}${(limit + 1).toString(radix)}`,
      );

      expect(aboveLimit.reports).toHaveLength(1);
      expect(aboveLimit.reports[0]).toMatchObject({
        node: aboveLimit.node,
        messageId: 'valueOver',
        data: {
          raw: aboveLimit.node.raw,
          value: limit + 1,
          limit,
        },
      });
    });

    it('compares BigInt literals to the inclusive limit and preserves the BigInt fix suffix', () => {
      expect.assertions(6);

      const atLimit = runRule(rule, `${prefix}${limit.toString(radix)}n`);

      expect(atLimit.reports).toHaveLength(0);

      const aboveLimit = runRule(
        rule,
        `${prefix}${(limit + 1).toString(radix)}n`,
      );

      expect(aboveLimit.reports).toHaveLength(1);
      expect(aboveLimit.reports[0]).toMatchObject({
        node: aboveLimit.node,
        messageId: 'valueOver',
        data: {
          raw: aboveLimit.node.raw,
          value: BigInt(limit + 1),
          limit,
        },
      });
      expect(
        aboveLimit.reports[0].fix({
          replaceText: (node, text) => ({ node, text }),
        }),
      ).toStrictEqual({ node: aboveLimit.node, text: `${limit + 1}n` });
    });

    it('honors checkBigInt and removes numeric separators before parsing', () => {
      expect.assertions(7);

      const ignoredBigInt = runRule(
        rule,
        `${prefix}${(limit + 1).toString(radix)}n`,
        { limit, checkBigInt: false },
      );

      expect(ignoredBigInt.reports).toHaveLength(0);

      const reportedBigInt = runRule(
        rule,
        `${prefix}${(limit + 1).toString(radix)}n`,
        { limit, checkBigInt: true },
      );

      expect(reportedBigInt.reports).toHaveLength(1);

      const digits = (limit + 1).toString(radix);
      const separatedDigits = `${digits.slice(0, 1)}_${digits.slice(1)}`;
      const separated = runRule(rule, `${prefix}${separatedDigits}`);

      expect(separated.reports).toHaveLength(1);
      expect(separated.reports[0].data.value).toBe(limit + 1);
    });
  },
);
