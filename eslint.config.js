// eslint.config.js
import js from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginA11y from 'eslint-plugin-jsx-a11y';
import pluginImport from 'eslint-plugin-import';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
    // Evitar “Unexpected token <” y analizar solo código fuente
    { ignores: ['node_modules', 'dist', 'build', 'public', '*.html', 'index.html'] },

    js.configs.recommended,
    // Config recomendado de React para flat config (activa reglas útiles por defecto)
    pluginReact.configs.flat.recommended,

    prettier, // desactiva reglas que chocan con Prettier

    {
        files: ['**/*.{js,jsx}'],

        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: { ecmaFeatures: { jsx: true } },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },

        settings: {
            react: { version: 'detect' },
            'import/resolver': {
                node: { extensions: ['.js', '.jsx'] },
                alias: { map: [['@', './src']], extensions: ['.js', '.jsx'] },
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
            'react/prop-types': 'off',
            // JSX moderno: no hace falta importar React
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',

            // **CLAVE**: evita “X is defined but never used” cuando X se usa como <X />
            'react/jsx-uses-vars': 'error',

            // Si dejás <Algo /> sin importar, lo marca
            'react/jsx-no-undef': ['error', { allowGlobals: false }],

            // Imports/rutas
            'import/no-unresolved': 'error',

            // Hooks y otras buenas prácticas
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'unicorn/prefer-query-selector': 'warn',
            'unicorn/filename-case': ['warn', { cases: { pascalCase: true, kebabCase: true } }],

            // Prettier
            'prettier/prettier': 'warn',
        },
    },
];
