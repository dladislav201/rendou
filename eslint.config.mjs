import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/', // all node_modules
      '**/dist/', // all dist/ folders
      '**/build/', // all build/ folders
      '**/coverage/', // all coverage/ reports
      '**/*.log', // any log files
      '**/logs/', // any logs/ folders
      'pnpm-lock.yaml', // lock files
      'package-lock.json',
      'yarn.lock',
      '.turbo/', // Turborepo cache
      '**/.turbo/',
      '.pnpm-store/', // pnpm local store
      '**/.pnpm-store/',
      '**/*.js', // compiled JS
      '**/*.js.map',
      '**/*.d.ts', // type declarations
      '.vscode/', // IDE settings
      '.idea/',
      '.DS_Store', // macOS metadata
      'Thumbs.db', // Windows metadata
      'eslint.config.mjs', // ignore the config file itself from parsing
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      'eol-last': 'off',
      'no-console': 'warn',
      'no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'no-eval': 'error',
      'no-implied-eval': 'error',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
);
