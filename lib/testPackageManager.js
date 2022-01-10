/**
 * @file detects if package initialised with yarn or pnpm
 */

'use strict';

const fs = require('fs');
const path = require('path');

const findPrefixPromise = require('./findPrefixPromise');

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

/* eslint-disable node/exports-style -- Allow multiple separate */
/**
 * @returns {Promise<boolean>}
 */
exports.testYarn = async function testYarn () {
  return await testPackageManager('yarn.lock');
};

/**
 * @returns {Promise<boolean>}
 */
exports.testPnpm = async function testPnpm () {
  return await testPackageManager('pnpm-lock.yaml');
};
/* eslint-enable node/exports-style -- Allow multiple separate */
