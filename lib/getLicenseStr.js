/**
 * @file get spdx expression from license field
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
  if (licenseObj && typeof licenseObj === 'object') {
    return licenseObj.type || `Unknown`;
  }
  return `Unknown`;
}
