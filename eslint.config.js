import airbnb from 'eslint-stylistic-airbnb';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import format from 'eslint-plugin-format';
import { mergeProcessors } from 'eslint-merge-processors';
import processorVueBlocks from 'eslint-processor-vue-blocks';

export default [
  // global ignores
  { ignores: ['dist', 'bundle-report'] },

  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  airbnb.configs['flat/recommended'],
  airbnb.configs['flat/addon-vue'],
  airbnb.configs['flat/addon-iterators'],
  airbnb.configs['flat/addon-typescript'],
  airbnb.configs['flat/addon-vue-ts'],

  {
    files: ['**/*.vue'],
    processor: mergeProcessors([pluginVue.processors['.vue'], processorVueBlocks({ blocks: { styles: true } })]),
  },

  // Format standalone styling files
  {
    files: ['**/*.{css,scss}'],
    languageOptions: {
      parser: format.parserPlain,
    },
    plugins: { format },
    rules: {
      'format/oxfmt': ['error'],
    },
  },

  {
    languageOptions: {
      globals: globals.browser,
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
];
