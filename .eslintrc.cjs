'use strict';

module.exports = {
  extends: 'ash-nazg/sauron-node-overrides',
  parserOptions: {
    ecmaVersion: 2020
  },
  env: {
    browser: false,
    node: true
  },
  settings: {
    polyfills: [
      'Object.assign',
      'Object.entries',
      'Object.values',
      'Promise',
      'Promise.all',
      'URL'
    ]
  },
  rules: {
    // Disable for now
    'max-len': 'off',
    'consistent-return': 'off',
    'unicorn/no-process-exit': 'off',
    'import/extensions': 'off',
    'promise/avoid-new': 'off',
    'promise/prefer-await-to-callbacks': 'off',
    'node/prefer-promises/fs': 'off',
    'node/no-sync': 'off',
    'node/no-process-env': 'off',

    'jsdoc/check-line-alignment': ['error', 'never']
  }
};
