import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      '.idea',
      'coverage'
    ]
  },
  ...ashNazg(['sauron', 'node']),
  {
    rules: {
      // Disable for now
      '@stylistic/max-len': 'off',
      'consistent-return': 'off',
      'unicorn/no-process-exit': 'off',
      'import/extensions': 'off',
      'promise/avoid-new': 'off',
      'promise/prefer-await-to-callbacks': 'off',
      'n/prefer-promises/fs': 'off',
      'n/no-sync': 'off',
      'n/no-process-env': 'off',

      'jsdoc/check-line-alignment': ['error', 'never']
    }
  }
];
