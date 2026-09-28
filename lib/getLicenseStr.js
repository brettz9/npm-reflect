/**
 * @file Get spdx expression from license field.
 */

/**
 * @typedef {string|object} MainLicenseType
 */

/**
 * @param {MainLicenseType|MainLicenseType[]} licenseObj
 * @returns {string|"Unknown"}
 */
export default function getLicenseStr (licenseObj) {
  if (typeof licenseObj === 'string') {
    return licenseObj;
  }
  if (Array.isArray(licenseObj)) {
    return `(${licenseObj.map((obj) => getLicenseStr(obj)).join(` OR `)})`;
  }
  return licenseObj && typeof licenseObj === 'object' ? licenseObj.type || `Unknown` : `Unknown`;
}
