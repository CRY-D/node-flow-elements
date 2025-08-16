import { defineConfig } from 'vite';
import { literalsHtmlCssMinifier } from '@literals/rollup-plugin-html-css-minifier';
import manifest from '@shoelace-style/shoelace/dist/custom-elements.json' with { type: 'json' };

import * as common from './vite.common.js';

export default defineConfig(({ mode }) => {
  console.log("'Mode", mode);
  return {
    resolve: common.resolve,

    build: {
      lib: {
        entry: './src/lib/index.ts',
        name: 'NodeFlowElements',
        formats: ['iife'],
        fileName: 'node-flow-elements.min',
      },

      target: 'esnext',
      sourcemap: false,

      minify: true,
    },

    plugins: [
      common.staticCopy(mode),
      common.babelConfig,
      common.reactConfig,
      literalsHtmlCssMinifier(),
    ],
  };
});
