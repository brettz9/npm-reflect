/**
 * @file Collect recursively all dependencies.
 */

import Queue from 'promise-queue';

import getPackageDetails from './getPackageDetails.js';
import printError from './printError.js';

/**
 * Recursive walk.
 * @param {Record<string, string>} dependencies
 * @param {import('./getDetails.js').Packages} packages
 * @param {Queue} queue
 * @param {(packages: import('./getDetails.js').Packages) => void} resolve
 * @param {(e: unknown) => void} reject
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
        if (Object.hasOwn(packages, nameVersion)) {
          return;
        }

        packages[nameVersion] = packageStats;
        walk(
          pDependencies,
          packages,
          queue,
          resolve,
          reject
        );
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
 * @param {Record<string, string>} dependencies package.json format
 * @returns {Promise<import('./getDetails.js').Packages>} resolved dependencies
 */
function walkDependenciesPromise (dependencies) {
  const packages = {};
  const queue = new Queue(20, Infinity);
  return new Promise((resolve, reject) => {
    walk(dependencies, packages, queue, resolve, reject);
  });
}

/**
 * @param {Record<string, string>} dependencies package.json format
 * @returns {Promise<import('./getDetails.js').Packages>} resolved dependencies
 */
export default async function walkDependencies (dependencies) {
  try {
    return await walkDependenciesPromise(dependencies);
  } catch (err) {
    printError(String(err));
    process.exit(1);
  }
}
