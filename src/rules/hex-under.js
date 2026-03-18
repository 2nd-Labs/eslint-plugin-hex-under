const HEX_REGEX = /^0[xX][0-9a-fA-F_]+$/;
const HEX_REGEX_BIGINT = /^0[xX][0-9a-fA-F_]+n$/;

export default {
  meta: {
    type: 'suggestion',
    version: '0.5.0',
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
    const [{ limit = 255 } = {}] = context.options;

    return {
      'Literal[raw=/^0[xX]/]'(node) {
        if (typeof node.value !== 'number' && typeof node.value !== 'bigint')
          return;
        if (typeof node.raw !== 'string') return;

        const raw = node.raw;
        const isHexBigInt = HEX_REGEX_BIGINT.test(raw);
        const isHex = HEX_REGEX.test(raw);

        if (!isHex && !isHexBigInt) return;

        const normalized = raw.replace(/_/g, '').replace(/n$/, '');
        let value = null;
        if (isHexBigInt) {
          value = BigInt(normalized);
          if (value <= BigInt(limit)) return;
        } else if (isHex) {
          value = Number(normalized);
          if (Number.isNaN(value) || value <= limit) return;
        } else {
          return;
        }

        context.report({
          node,
          messageId: 'valueOverGeneral',
          data: {
            raw,
            value,
            limit,
          },
          fix(fixer) {
            return fixer.replaceText(
              node,
              isHexBigInt ? `${String(BigInt(value))}n` : String(value),
            );
          },
        });
      },
    };
  },
};
