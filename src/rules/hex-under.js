export default {
  meta: {
    type: 'suggestion',
    version: '0.4.0',
    defaultOptions: [
      {
        limit: 255,
      },
    ],
    docs: {
      description:
        'Ensures that a hexadecimal number does not exceed a specified value (default: 255).',
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
      valueOverGeneral:
        'Hex number {{ raw }} ({{ value }}) exceeds the limit of {{ limit }}.',
    },
  },

  create(context) {
    const { limit = 255 } = context.options[0] ?? {};
    const HEX_REGEX = /^0[Xx][0-9a-fA-F_]+$/;

    return {
      Literal(node) {
        if (typeof node.value !== 'number' || typeof node.raw !== 'string')
          return;

        const raw = node.raw;

        if (!HEX_REGEX.test(raw)) return;

        const value = node.value;
        if (Number.isNaN(value)) return;

        if (value <= limit) return;

        context.report({
          node,
          messageId: 'valueOverGeneral',
          data: {
            raw,
            value,
            limit,
          },
          fix(fixer) {
            return fixer.replaceText(node, String(value));
          },
        });
      },
    };
  },
};
