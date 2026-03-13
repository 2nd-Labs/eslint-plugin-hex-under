export default {
  meta: {
    type: "suggestion",
    version: "0.0.2",
    defaultOptions: [
      {
        limit: 255,
      },
    ],
    docs: {
      description:
        "Proves that a hexadecimal bigint must be less than a specified value. Default is 255.",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          limit: {
            type: "integer",
            minimum: 0,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      valueOverGeneralBigInt:
        "This bigint must be less than or equal {{ limit }}. {{ overValue }} ({{ over255Raw }}) is greater than {{ limit }}.",
    },
  },
  create(context) {
    const options = context.options[0] || {};
    const limit = typeof options.limit === "number" ? options.limit : 255;

    return {
      onCodePathEnd: function (_codePath, node) {
        const tokens =
          node.tokens?.filter(
            (token) =>
              ["Numeric", "Identifier"].includes(token.type) &&
              typeof token.value === "string" &&
              token.value.startsWith("0x") &&
              token.value.endsWith("n"),
          ) || [];

        for (const token of tokens) {
          try {
            const hexValue = token.value.slice(0, -1);
            const value = BigInt(hexValue);
            const limitBigInt = BigInt(limit);

            if (value > limitBigInt) {
              context.report({
                node: token,
                messageId: "valueOverGeneralBigInt",
                data: {
                  limit: limit,
                  over255Raw: token.value,
                  overValue: value.toString(),
                },
                fix(fixer) {
                  return fixer.replaceText(token, value.toString() + "n");
                },
              });
            }
          } catch {
            continue;
          }
        }
      },
    };
  },
};
