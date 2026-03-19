const BINARY_REGEX = /^0[bB][01_]+$/;
const BINARY_REGEX_BIGINT = /^0[bB][01_]+n$/;

export default {
  meta: {
    version: '0.1.0',
    type: 'suggestion',
    docs: {
      description: 'Ensures binary numbers do not exceed a limit.',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 0 },
          skipBigInt: { type: 'boolean' },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      valueOver:
        'Binary number {{ raw }} ({{ value }}) exceeds the limit of {{ limit }}.',
    },
  },

  create(context) {
    const [{ limit = 15, skipBigInt = false } = {}] = context.options;

    return {
      'Literal[raw=/^0[bB][01_]+n?$/]'(node) {
        const raw = node.raw;
        const isBigInt = BINARY_REGEX_BIGINT.test(raw);
        const isBinary = BINARY_REGEX.test(raw);

        if (skipBigInt && isBigInt) return;

        const normalized = raw.replace(/_/g, '').replace(/n$/, '');
        let value = null;

        if (isBigInt) {
          value = BigInt(normalized);
          if (value <= BigInt(limit)) return;
        }

        if (isBinary) {
          value = parseInt(normalized.slice(2), 2);
          if (Number.isNaN(value) || value <= limit) return;
        }

        context.report({
          node,
          messageId: 'valueOver',
          data: {
            raw: raw,
            value: value,
            limit: limit,
          },
          fix(fixer) {
            return fixer.replaceText(
              node,
              isBigInt ? `${String(value)}n` : String(value),
            );
          },
        });
      },
    };
  },
};
