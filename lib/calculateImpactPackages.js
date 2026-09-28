/**
 * @file Calculate packages which are not installed yet considering tree flattering.
 */

import semver from 'semver';

/**
 * @param {string} version
 * @param {string} otherVersion
 * @returns {boolean} whether `version` outranks `otherVersion`
 */
function isHigherVersion (version, otherVersion) {
  if (semver.valid(version) && semver.valid(otherVersion)) {
    return semver.gt(version, otherVersion);
  }
  // Not every resolved `version` is valid semver (e.g. a GitHub ref), so
  //   fall back to a stable (if arbitrary) string comparison rather than
  //   letting `semver.gt` throw.
  return version > otherVersion;
}

/**
 * When a dependency tree has more than one version of the same package
 *   installed at once (a common, valid npm outcome from conflicting semver
 *   ranges), picks its highest version to represent "do we already have
 *   this package" - deterministically, rather than depending on whichever
 *   version `walkDependencies` happened to resolve first over the network.
 * @param {object} packages
 * @returns {string[]} packages at first level of tree
 */
function flatingPackages (packages) {
  const highestByName = {};
  Object.entries(packages).forEach(([key, {name, version}]) => {
    const highest = highestByName[name];
    if (!highest || isHigherVersion(version, highest.version)) {
      highestByName[name] = {key, version};
    }
  });
  return Object.values(highestByName).map(({key}) => key);
}

/**
 * @param {object} newPackages
 * @param {object} currentPackages
 * @returns {object}
 */
export default function calculateImpactPackages (newPackages, currentPackages) {
  const flatCurrentPackages = flatingPackages(currentPackages);
  return Object.entries(newPackages).filter(([key]) => {
    return !flatCurrentPackages.includes(key);
  }).reduce((impactPackages, [key, newPackage]) => {
    impactPackages[key] = newPackage;
    return impactPackages;
  }, {});
}
