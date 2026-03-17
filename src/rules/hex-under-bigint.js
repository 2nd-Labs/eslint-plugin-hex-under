export default {
  meta: {
    type: 'suggestion',
    version: '0.1.0',
    defaultOptions: [
      {
        limit: 255,
      },
    ],
    docs: {
      description:
        'Ensures that a hexadecimal bigint does not exceed a specified value (default: 255).',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            minimum: 0,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      valueOverGeneralBigInt:
        'Hex number {{ raw }} ({{ value }}) exceeds the limit of {{ limit }}.',
    },
  },
  create(context) {
    const { limit = 255 } = context.options[0] ?? {};
    const HEX_REGEX = /^0[Xx][0-9a-fA-F_]+n$/;

    return {
      Literal(node) {
        if (typeof node.raw !== 'string') return;

        const raw = node.raw;

        if (!HEX_REGEX.test(raw)) return;

        const value = BigInt(node.raw.slice(0, -1).replace(/_/g, ''));

        if (value <= BigInt(limit)) return;

        context.report({
          node,
          messageId: 'valueOverGeneralBigInt',
          data: {
            raw,
            value,
            limit,
          },
          fix(fixer) {
            return fixer.replaceText(node, `${String(BigInt(value))}n`);
          },
        });
      },
    };
  },
};
