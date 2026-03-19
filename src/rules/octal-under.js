const OCTAL_REGEX = /^0[oO]?[0-7_]+$/;
const OCTAL_REGEX_BIGINT = /^0[oO]?[0-7_]+n$/;

export default {
  meta: {
    version: '0.1.0',
    type: 'suggestion',
    docs: {
      description: 'Ensures octal numbers do not exceed a limit.',
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
        'Octal number {{ raw }} ({{ value }}) exceeds the limit of {{ limit }}.',
    },
  },

  create(context) {
    const [{ limit = 511, skipBigInt = false } = {}] = context.options;

    return {
      'Literal[raw=/^0[oO]?[0-7_]+n?$/]'(node) {
        const raw = node.raw;

        if (
          raw.startsWith('0') &&
          !raw.startsWith('0o') &&
          !raw.startsWith('0O')
        ) {
          return;
        }

        const isBigInt = OCTAL_REGEX_BIGINT.test(raw);
        const isOctal = OCTAL_REGEX.test(raw);

        if (skipBigInt && isBigInt) return;

        const normalized = raw.replace(/_/g, '').replace(/n$/, '');
        let value = null;

        if (isBigInt) {
          value = BigInt(normalized);
          if (value <= BigInt(limit)) return;
        }

        if (isOctal) {
          value = parseInt(normalized.slice(2), 8);
          if (Number.isNaN(value) || value <= limit) return;
        }

        context.report({
          node,
          messageId: 'valueOver',
          data: { raw, value, limit },
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
