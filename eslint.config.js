import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
// import pluginReact from 'eslint-plugin-react';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import jsdoc from 'eslint-plugin-jsdoc';
import importX from 'eslint-plugin-import-x';
// import importX from 'eslint-plugin-import-x';
// import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortClassMembers from 'eslint-plugin-sort-class-members';

export default [
  { files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  // pluginReact.configs.flat.recommended,

  eslintPluginUnicorn.configs['flat/all'],

  jsdoc.configs['flat/recommended-typescript'],

  // importX.configs['recommended'],
  // importX.configs['typescript'],

  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  // importX.flatConfigs.react,

  // sortClassMembers.configs['flat/recommended'],

  {
    rules: {
      'import-x/order': [
        'error',
        {
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@app/**',
              group: 'external',
              position: 'after',
            },
          ],
          distinctGroup: false,
        },
      ],
    },
  },

  {
    rules: {
      'unicorn/no-null': 'off',
      'unicorn/template-indent': 'off',
      'unicorn/prevent-abbreviations': {
        checkFilenames: false,
      },

      'jsdoc/require-jsdoc': [
        // 'off',
        'off',
        // {
        //   require: {
        //     FunctionDeclaration: true,
        //     MethodDefinition: true,
        //     ClassDeclaration: true,
        //   },
        // },
      ],

      '@typescript-eslint/explicit-function-return-type': 'warn',

      'unicorn/import-style': [
        'off',
        // {
        // 	styles: {
        // 		util: false,
        // 		path: {
        // 			named: true,
        // 		},
        // 	},
        // },
      ],
    },
  },
];
