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
function testPackageManager (packageLockPath) {
  return findPrefixPromise().then((packagePath) => {
    return fs.existsSync(
      path.join(packagePath, packageLockPath)
    );
  });
}

/* eslint-disable node/exports-style -- Allow multiple separate */
/**
 * @returns {Promise<boolean>}
 */
exports.testYarn = function testYarn () {
  return testPackageManager('yarn.lock');
};

/**
 * @returns {Promise<boolean>}
 */
exports.testPnpm = function testPnpm () {
  return testPackageManager('pnpm-lock.yaml');
};
/* eslint-enable node/exports-style -- Allow multiple separate */
