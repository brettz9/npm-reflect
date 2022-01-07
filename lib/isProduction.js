/**
 * @file checks if need to run in prod mode
 */

'use strict';

module.exports = function isProduction (options) {
  const {production} = options;
  const {NODE_ENV} = process.env;
  return production || NODE_ENV === 'production';
};
