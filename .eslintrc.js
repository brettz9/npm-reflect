'use strict';

module.exports = {
  extends: 'ash-nazg/sauron-node-script-overrides',
  env: {
    browser: false,
    node: true
  },
  settings: {
    polyfills: [
      'Object.assign',
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
    'promise/no-nesting': 'off',
    'promise/avoid-new': 'off',
    'promise/prefer-await-to-then': 'off',
    'promise/prefer-await-to-callbacks': 'off',
    'promise/always-return': 'off',
    'node/prefer-promises/fs': 'off',
    'node/no-sync': 'off',
    'node/no-process-env': 'off',

    'jsdoc/check-line-alignment': ['error', 'never'],

    // Should reenable and refactor so that only CLI file uses
    'no-console': 'off'
  }
};
