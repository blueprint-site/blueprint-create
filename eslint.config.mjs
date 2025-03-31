import { defineConfig, globalIgnores } from 'eslint/config';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use FlatCompat only for the React plugin which doesn't fully support flat config yet
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

// Get React recommended config through FlatCompat
const reactRecommendedConfig = compat.extends('plugin:react/recommended');

export default defineConfig([
  // Global ignores
  globalIgnores([
    '**/dist',
    '**/.eslintrc.cjs',
    'src/components/ui/*.tsx',
    'cli/**',
    '**/node_modules/',
    'public/**',
  ]),

  // Base JavaScript config (ESLint recommended)
  js.configs.recommended,

  // React recommended config from compat (filtered to exclude react-in-jsx-scope rule)
  {
    ...reactRecommendedConfig[0],
    rules: {
      ...reactRecommendedConfig[0].rules,
      // Disable rules that aren't applicable to React 19
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    }
  },

  // Base config for all files with React-related rules
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    ignores: ['vite.config.ts'],
    plugins: {
      'react-refresh': reactRefresh,
      'react-compiler': reactCompiler,
      'react-hooks': reactHooks,
    },
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {      
      // React Refresh rules
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-compiler/react-compiler': 'error',
      
      // React Hooks recommended rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Disable the index as key rule
      'react/no-array-index-key': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  
  // TypeScript specific configuration using recommended rules
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    // Use recommended rules as a base
    rules: {
      ...tsPlugin.configs.recommended.rules,
      // Add our own custom rule on top of recommended
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Vite config special handling
  {
    files: ['vite.config.ts'],
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: process.cwd(),
        project: './tsconfig.node.json',
      },
    },
    rules: {
      // Turn off TypeScript rules that would cause issues with Vite config
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]);
