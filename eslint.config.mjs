import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import importx from 'eslint-plugin-import-x';
import pinia from 'eslint-plugin-pinia';
import vue from 'eslint-plugin-vue';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  importx.flatConfigs.recommended,
  importx.flatConfigs.typescript,
  ...vue.configs['flat/recommended'],
  pinia.configs['recommended-flat'],
  {
<<<<<<< HEAD
    files: ['src/**/*.{vue,js,ts,jsx,tsx}'],
=======
    files: ['src/**/*.{html,vue,js,ts}'],
>>>>>>> 657d325b384170d58b72e3fe3cc38173e31a414a
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    rules: {
      ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
      ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
      'better-tailwindcss/enforce-consistent-line-wrapping': ['off', { preferSingleLine: true, printWidth: 120 }],
      'better-tailwindcss/no-unregistered-classes': ['off', { ignore: ['fa-*'] }],
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'tailwind.css',
        tailwindConfig: 'tailwind.config.js',
      },
    },
  },
  {
<<<<<<< HEAD
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
=======
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
>>>>>>> 657d325b384170d58b72e3fe3cc38173e31a414a
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'handle-callback-err': 'off',
      'import-x/no-console': 'off',
      'import-x/no-cycle': 'error',
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-nodejs-modules': 'warn',
      'import-x/no-unresolved': [2, { ignore: ['^http'] }],
      'no-dupe-class-members': 'off',
      'no-empty-function': 'off',
      'no-floating-decimal': 'error',
      'no-lonely-if': 'error',
      'no-multi-spaces': 'error',
      'no-redeclare': 'off',
      'no-shadow': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-var': 'error',
      'pinia/no-duplicate-store-ids': 'off',
      'pinia/require-setup-store-properties-export': 'off',
      'prefer-const': 'warn',
<<<<<<< HEAD
=======
      'vue/multi-word-component-names': 'off',
>>>>>>> 657d325b384170d58b72e3fe3cc38173e31a414a
      yoda: 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
<<<<<<< HEAD
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  eslintConfigPrettier,
  globalIgnores(['dist/**', 'node_modules/**', 'eslint.config.mjs', 'postcss.config.js', 'webpack.config.ts', '**/*.html']),
=======
  eslintConfigPrettier,
  globalIgnores(['dist/**', 'node_modules/**', 'eslint.config.mjs', 'postcss.config.js', 'webpack.config.ts']),
>>>>>>> 657d325b384170d58b72e3fe3cc38173e31a414a
];
