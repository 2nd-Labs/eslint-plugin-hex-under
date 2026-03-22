const OCTAL_REGEX = /^0[oO]?[0-7_]+$/;
const OCTAL_REGEX_BIGINT = /^0[oO]?[0-7_]+n$/;

export default {
  meta: {
    version: '0.3.1',
    type: 'suggestion',
    docs: {
      description: 'Ensures octal numbers do not exceed a limit.',
      recommended: false,
    },
    defaultOptions: [
      {
        limit: 511,
        skipBigInt: false,
      },
    ],
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          limit: {
            type: 'integer',
            minimum: 0,
            description: 'The maximum allowed value for octal literals.',
          },
          skipBigInt: {
            type: 'boolean',
            description: 'Whether to skip BigInt literals.',
          },
        },
        description: 'Options for octal-under rule',
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

        const sourceCode = context.sourceCode;
        if (sourceCode.lines[0] === '/* ignore-all-hex-under */') {
          return;
        }
        const line = node.loc.end.line;
        const ignore =
          sourceCode.lines[line - 2]?.startsWith('// ignore-octal-under') ||
          /\/\/\s(ignore-octal-under)/.test(sourceCode.lines[line - 1]);
        if (ignore) return;

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
