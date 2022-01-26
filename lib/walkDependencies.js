/**
 * @file collect recursively all dependencies
 */

import Queue from 'promise-queue';

import getPackageDetails from './getPackageDetails.js';
import printError from './printError.js';

/**
 * Recursive walk.
 * @param {PlainObject} dependencies
 * @param {PlainObject} packages
 * @param {Queue} queue
 * @returns {Promise<void>}
 */
function walk (dependencies, packages, queue) {
  return Promise.race(Object.entries(dependencies || {}).map(async ([pName, versionLoose]) => {
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
        return await walk(
          pDependencies,
          packages,
          queue
        );
      }
    });
    if (queue.getPendingLength() === 0) {
      return packages;
    }
  }));
}

/**
 * @param {PlainObject} dependencies package.json format
 * @returns {Promise<Object>} resolved dependencies
 */
function walkDependenciesPromise (dependencies) {
  const packages = {};
  const queue = new Queue(20, Number.POSITIVE_INFINITY);
  return walk(dependencies, packages, queue);
}

/**
 * @param {PlainObject} dependencies package.json format
 * @returns {Promise<Object>} resolved dependencies
 */
export default async function walkDependencies (dependencies) {
  try {
    return await walkDependenciesPromise(dependencies);
  } catch (err) {
    printError(err);
    process.exit(1);
  }
}
