/**
 * @file Collect recursively all dependencies.
 */

import Queue from 'promise-queue';

import getPackageDetails from './getPackageDetails.js';
import printError from './printError.js';

/**
 * Recursive walk.
 * @param {object} dependencies
 * @param {object} packages
 * @param {Queue} queue
 * @param {GenericCallback} resolve
 * @param {GenericCallback} reject
 * @returns {void}
 */
function walk (dependencies, packages, queue, resolve, reject) {
  Object.entries(dependencies).forEach(async ([pName, versionLoose]) => {
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
            resolve,
            reject
          );
        }
      });
      if (queue.getPendingLength() === 0) {
        resolve(packages);
      }
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * @param {object} dependencies package.json format
 * @returns {Promise<object>} resolved dependencies
 */
function walkDependenciesPromise (dependencies) {
  const packages = {};
  const queue = new Queue(20, Number.POSITIVE_INFINITY);
  return new Promise((resolve, reject) => {
    walk(dependencies, packages, queue, resolve, reject);
  });
}

/**
 * @param {object} dependencies package.json format
 * @returns {Promise<object>} resolved dependencies
 */
export default async function walkDependencies (dependencies) {
  try {
    return await walkDependenciesPromise(dependencies);
  } catch (err) {
    printError(err);
    process.exit(1);
  }
}
