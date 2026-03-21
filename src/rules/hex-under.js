const HEX_REGEX = /^0[xX][0-9a-fA-F_]+$/;
const HEX_REGEX_BIGINT = /^0[xX][0-9a-fA-F_]+n$/;

export default {
  meta: {
    type: 'suggestion',
    version: '0.6.0',
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
            description: 'The maximum allowed value for hexadecimal literals.',
          },
          skipBigInt: {
            type: 'boolean',
            description: 'Whether to skip BigInt literals.',
          },
        },
        description: 'Options for hex-under rule',
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
    return {
      'Literal[raw=/^0[xX][0-9a-fA-F_]+n?$/]'(node) {
        const raw = node.raw;

        const sourceCode = context.sourceCode;
        const line = node.loc.end.line;
        const ignore =
          sourceCode.lines[line - 2]?.startsWith('// ignore-hex-under') ||
          /\/\/\s(ignore-hex-under)/.test(sourceCode.lines[line - 1]);
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
