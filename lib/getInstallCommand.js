/**
 * @file get install command considering package manager and arguments
 */

import {testYarn, testPnpm} from './testPackageManager.js';
import isProduction from './isProduction.js';

/**
 * @param {string} nameVersion
 * @param {PlainObject} options
 * @returns {Promise<{command: string, args: string[]}>}
 */
export default async function getInstallCommand (nameVersion, options) {
  const isYarn = await testYarn();
  const command = isYarn ? `yarn` : await testPnpm() ? `pnpm` : `npm`;
  const args = [];
  switch (command) {
  case 'npm': case 'pnpm':
    args.push(...process.argv.slice(2));
    break;
  default:
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
    break;
  }
  return {command, args};
}
