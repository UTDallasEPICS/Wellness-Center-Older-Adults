// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import { fixupConfigRules } from '@eslint/compat';
import prettierConfigRecommended from 'eslint-plugin-prettier/recommended';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const patchedConfig = fixupConfigRules([...compat.extends('next/core-web-vitals')]);

const config = [
  ...patchedConfig,
  // Prettier configuration added directly here
  prettierConfigRecommended,
  // Add more flat configs here
  { ignores: ['.next/*', 'next-env.d.ts', 'prisma/*.js'] },
  {
    rules: {
      // Run Prettier as an ESLint rule and check for formatting errors
      'prettier/prettier': [
        'error',
        {
          singleQuote: true, // Enforce single quotes
          semi: true, // Enforce semicolons
          trailingComma: 'es5', // Require trailing commas where valid
          printWidth: 100, // Set max line length to 100
          endOfLine: 'auto' // Handle carriage returns for different OS
        },
      ],

      // Accessibility rules

      // Ensures anchors are used appropriately
      'jsx-a11y/anchor-is-valid': 'warn',

      // Code quality and error prevention

      // Prevents unused variables
      'no-unused-vars': 'error',
      // Only allow console.warn and console.error
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Disallow debugger statements
      'no-debugger': 'error',
      // Enforce strict equality
      eqeqeq: ['error', 'always'],

      // Code style for consistency

      // Enforce 2-space indentation
      indent: ['error', 2],
      // Warn if lines exceed 100 characters
      'max-len': ['error', { code: 100 }],

      // Ensuring code maintainability

      // Enforce the use of const where possible
      'prefer-const': 'error',
      // Disallow var and require let/const
      'no-var': 'error',
    },
  },
];

export default config;
