import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['node_modules/', 'playwright-report/', 'test-results/', 'dist/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
);
