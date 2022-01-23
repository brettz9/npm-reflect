/**
 * @file detects if package initialised with yarn or pnpm
 */

import fs from 'fs';
import path from 'path';

import findPrefixPromise from './findPrefixPromise.js';

/**
 * @param {string} packageLockPath
 * @returns {Promise<boolean>}
 */
async function testPackageManager (packageLockPath) {
  const packagePath = await findPrefixPromise();
  return fs.existsSync(
    path.join(packagePath, packageLockPath)
  );
}

/**
 * @returns {Promise<boolean>}
 */
export const testYarn = async function testYarn () {
  return await testPackageManager('yarn.lock');
};

/**
 * @returns {Promise<boolean>}
 */
export const testPnpm = async function testPnpm () {
  return await testPackageManager('pnpm-lock.yaml');
};
