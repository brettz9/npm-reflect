/**
 * @file collect recursively all dependencies
 */

'use strict';

const Queue = require('promise-queue');

const getPackageDetails = require('./getPackageDetails');
const printError = require('./printError');

/**
 * Recursive walk.
 * @param {PlainObject} dependencies
 * @param {PlainObject} packages
 * @param {Queue} queue
 * @param {GenericCallback} resolve
 * @returns {void}
 */
function walk (dependencies, packages, queue, resolve) {
  Object.keys(dependencies || {}).forEach(async (pName) => {
    const versionLoose = dependencies[pName];
    try {
      await queue.add(async () => {
        const packageStats = await getPackageDetails(pName, versionLoose);
        if (!packageStats) {
          return;
        }
        const {
          name, version, dependencies: pDependencies
        } = packageStats;
        const nameVersion = `${name}@${version}`;
        // deal with circular deps
        if (!packages[nameVersion]) {
          packages[nameVersion] = packageStats;
          walk(
            pDependencies,
            packages,
            queue,
            resolve
          );
        }
      });
      if (queue.getPendingLength() === 0) {
        resolve(packages);
      }
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });
}

/**
 * @param {PlainObject} dependencies package.json format
 * @returns {Promise<Object>} resolved dependencies
 */
module.exports = function walkDependencies (dependencies) {
  const packages = {};
  const queue = new Queue(20, Number.POSITIVE_INFINITY);
  return new Promise((resolve) => {
    walk(dependencies, packages, queue, resolve);
  });
};
