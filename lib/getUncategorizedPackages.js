/**
 * @file List packages with an uncategorized license, formatted for display.
 */

import formatPackageLicense from './formatPackageLicense.js';

/**
 * @param {import('./calculateImpactPackages.js').PartialPackages} packages nameVersion -> package stats
 * @returns {string[]} `name@version (license)` entries for packages whose
 * `licenseType` is `uncategorized`
 */
export default function getUncategorizedPackages (packages) {
  return Object.entries(packages).filter(([, {licenseType}]) => {
    return licenseType === 'uncategorized';
  }).map(([nameVersion, {license}]) => {
    return formatPackageLicense(nameVersion, /** @type {string} */ (license));
  });
}
