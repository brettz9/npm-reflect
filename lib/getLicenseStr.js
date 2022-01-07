/**
 * @file get spdx expression from license field
 */

'use strict';

module.exports = function getLicenseStr (licenseObj) {
  if (typeof licenseObj === 'string') {
    return licenseObj;
  }
  if (Array.isArray(licenseObj)) {
    return `(${licenseObj.map((obj) => getLicenseStr(obj)).join(` OR `)})`;
  }
  if (typeof licenseObj === 'object') {
    return licenseObj.type || `Unknown`;
  }
  return `Unknown`;
};
