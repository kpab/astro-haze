// @ts-check
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

export default tseslint.config(
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**', 'public/pagefind/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs['flat/recommended'],
  ...eslintPluginAstro.configs['flat/jsx-a11y-recommended'],
  {
    rules: {
      // Astro components commonly destructure unused props for documentation
      // purposes (Props interfaces double as the component's public API).
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      // TypeScript's own checker (via `astro check`) already catches
      // undefined identifiers with full knowledge of ambient lib types
      // (e.g. HTMLElementTagNameMap); the core rule doesn't know about
      // those and false-positives on every .astro frontmatter script.
      'no-undef': 'off',
    },
  },
  {
    // Astro's generated env.d.ts requires the triple-slash reference to
    // pull in .astro/types.d.ts — there's no import-style equivalent.
    files: ['src/env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
);
