const BINARY_REGEX = /^0[bB][01_]+$/;
const BINARY_REGEX_BIGINT = /^0[bB][01_]+n$/;

export default {
  meta: {
    version: '0.4.0',
    type: 'suggestion',
    docs: {
      description: 'Ensures binary numbers do not exceed a limit.',
      recommended: false,
    },
    defaultOptions: [
      {
        limit: 15,
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
            description: 'The maximum allowed value for binary literals.',
          },
          skipBigInt: {
            type: 'boolean',
            description: 'Whether to skip BigInt literals.',
          },
        },
        description: 'Options for binary-under rule',
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

        const sourceCode = context.sourceCode;
        if (sourceCode.lines[0] === '/* ignore-all-hex-under */') {
          return;
        }

        const comments = sourceCode.getAllComments();
        const firstNode = sourceCode.ast.body[0];
        const commentsBeforeCode = comments.filter((comment) => {
          return comment.range[1] <= firstNode.range[0];
        });
        if (
          commentsBeforeCode.some(
            (comment) =>
              comment.type === 'Block' &&
              comment.value.trim() === 'ignore-binary-under',
          )
        ) {
          return;
        }

        const line = node.loc.end.line;
        const ignore =
          sourceCode.lines[line - 2]?.startsWith('// ignore-binary-under') ||
          /\/\/\s(ignore-binary-under)/.test(sourceCode.lines[line - 1]);
        if (ignore) return;

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
