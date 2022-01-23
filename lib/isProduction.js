/**
 * @file checks if need to run in prod mode
 */

/**
 * @param {{production: boolean}} options
 * @returns {boolean}
 */
export default function isProduction (options) {
  const {production} = options;
  const {NODE_ENV} = process.env;
  return production || NODE_ENV === 'production';
}
