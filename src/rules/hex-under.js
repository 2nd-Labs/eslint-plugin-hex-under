const HEX_REGEX = /^0[xX][0-9a-fA-F_]+$/;
const HEX_REGEX_BIGINT = /^0[xX][0-9a-fA-F_]+n$/;

export default {
  meta: {
    type: 'suggestion',
    version: '0.5.0',
    defaultOptions: [
      {
        limit: 255,
        skipBigInt: false,
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
          skipBigInt: {
            type: 'boolean',
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
    const [{ limit = 255, skipBigInt = false } = {}] = context.options;
    let comments = [];
    return {
      Program(node) {
        comments = node.comments || [];
      },
      'Literal[raw=/^0[xX][0-9a-fA-F_]+n?$/]'(node) {
        const raw = node.raw;

        const ignore = comments.some((c) => {
          const line = c.loc.end.line;
          return (
            (line === node.loc.start.line - 1 || line === node.loc.end.line) &&
            c.value.trim() === 'ignore-hex-under'
          );
        });
        if (ignore) return;

        const isHexBigInt = HEX_REGEX_BIGINT.test(raw);
        const isHex = HEX_REGEX.test(raw);

        if (skipBigInt && isHexBigInt) return;

        const normalized = raw.replace(/_/g, '').replace(/n$/, '');
        let value = null;
        if (isHexBigInt) {
          value = BigInt(normalized);
          if (value <= BigInt(limit)) return;
        }
        if (isHex) {
          value = Number(normalized);
          if (Number.isNaN(value) || value <= limit) return;
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
