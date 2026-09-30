/**
 * @file Calculate packages aggregated stats.
 */

import getLicenseStr from './getLicenseStr.js';
import getLicenseType from './getLicenseType.js';

/**
 * @param {import('./calculateImpactPackages.js').PartialPackages} packages
 * @returns {{
 *   count: number,
 *   size: number,
 *   licenses: Record<string, number>,
 *   licenseTypes: {[k in import('./formatLicenseType.js').LicenseType]?: number}
 * }}
 */
export default function getPackagesStats (packages) {
  const packagesAr = Object.values(packages);
  const count = packagesAr.length;
  const size = packagesAr.reduce((s, pkg) => {
    s += Number(pkg.size);
    return s;
  }, 0);
  const licenses = packagesAr.reduce((l, pkg) => {
    const license = getLicenseStr(pkg.license);
    l[license] ||= 0;
    l[license] += 1;
    return l;
  }, /** @type {Record<string, number>} */ ({}));

  /** @type {{[k in import('./formatLicenseType.js').LicenseType]?: number}} */
  const licenseTypes = {};
  Object.entries(licenses).forEach(([licenseName, license]) => {
    const type = getLicenseType(licenseName);
    licenseTypes[type] ||= 0;
    licenseTypes[type] += license;
  });
  return {
    count, size, licenses, licenseTypes
  };
}
