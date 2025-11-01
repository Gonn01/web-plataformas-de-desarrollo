// ESLint v9+ (Flat Config)
import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginA11y from 'eslint-plugin-jsx-a11y';
import pluginImport from 'eslint-plugin-import';
import pluginUnicorn from 'eslint-plugin-unicorn';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  js.configs.recommended,
  prettier, // desactiva reglas que chocan con Prettier
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        ...globals.node,
        ...globals.browser,
      },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        node: { extensions: ['.js', '.jsx'] },
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx'],
        },
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'jsx-a11y': pluginA11y,
      import: pluginImport,
      unicorn: pluginUnicorn,
      prettier: pluginPrettier,
    },
    rules: {
      // React moderno (no hace falta importar React para JSX)
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Accesibilidad
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/no-autofocus': 'warn',

      // Imports
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      'import/no-unresolved': 'off', // ajustá si usás path aliases

      // Unicorn (buenas prácticas)
      'unicorn/prefer-query-selector': 'warn',
      'unicorn/filename-case': ['warn', { cases: { pascalCase: true, kebabCase: true } }],

      // Prettier como regla (opcional)
      'prettier/prettier': 'warn',
    },
  },
];
