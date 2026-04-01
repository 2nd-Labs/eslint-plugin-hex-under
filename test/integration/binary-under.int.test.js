/* c8 ignore file */

import { ESLint } from 'eslint';
import { describe, expect, it } from 'vitest';

describe('integration test: hex-under/binary-under', () => {
  describe('comments - Integration Test with ESLint', () => {
    const eslint = new ESLint({
      baseConfig: {
        languageOptions: {
          parserOptions: {
            ecmaVersion: 2025,
            sourceType: 'module',
          },
        },
        rules: {
          'hex-under/binary-under': 'error',
        },
      },
    });

    it('should skip disabled lines', async () => {
      expect.hasAssertions();

      const code = `// eslint-disable-next-line
                      const binTooBig = 0b100000000;`;

      const results = await eslint.lintText(code);

      expect(results[0].errorCount).toBe(0);
    });

    it('should have have errorCount of 0 with enabled hex-under/binary-under', async () => {
      expect.hasAssertions();

      const code = `// eslint-disable-next-line hex-under/binary-under
                      const binTooBig = 0b100000000;`;

      const results = await eslint.lintText(code);

      expect(results[0].errorCount).toBe(0);
    });

    it('should have have errorCount of 1 with enabled hex-under/hex-under', async () => {
      expect.hasAssertions();

      const code = `// eslint-disable-next-line hex-under/hex-under
                      const binTooBig = 0b100000000;`;

      const results = await eslint.lintText(code);

      expect(results[0].errorCount).toBe(1);
    });

    it('should have have errorCount of 1 with enabled hex-under/octal-under', async () => {
      expect.hasAssertions();

      const code = `// eslint-disable-next-line hex-under/octal-under
                      const binTooBig = 0b100000000;`;

      const results = await eslint.lintText(code);

      expect(results[0].errorCount).toBe(1);
    });
  });
});
