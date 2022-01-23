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
 * @param {GenericCallback} resolve
 * @returns {void}
 */
function walk (dependencies, packages, queue, resolve) {
  Object.entries(dependencies || {}).forEach(async ([pName, versionLoose]) => {
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
export default function walkDependencies (dependencies) {
  const packages = {};
  const queue = new Queue(20, Number.POSITIVE_INFINITY);
  return new Promise((resolve) => {
    walk(dependencies, packages, queue, resolve);
  });
}
