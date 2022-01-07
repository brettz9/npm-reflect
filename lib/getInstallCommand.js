/**
 * @file get install command considering package manager and arguments
 */

'use strict';

const testYarn = require('./testYarn');
const isProduction = require('./isProduction');

/**
 * @param {string} nameVersion
 * @param {PlainObject} options
 * @returns {Promise<{command: string, args: string[]}>}
 */
module.exports = function getInstallCommand (nameVersion, options) {
  return testYarn().then((isYarn) => {
    const command = isYarn ? `yarn` : `npm`;
    const args = [];
    if (command === 'npm') {
      args.push(...process.argv.slice(2));
    } else {
      // yarn
      if (nameVersion) {
        args.push('add', nameVersion);
        if (options.saveDev) {
          args.push('--dev');
        }
      } else {
        args.push('install');
        if (isProduction(options)) {
          args.push('--production');
        }
      }
    }
    return {command, args};
  });
};
