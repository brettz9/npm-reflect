/**
 * @file calculate packages aggregated stats
 */

'use strict';

const getLicenseStr = require('./getLicenseStr');
const getLicenseType = require('./getLicenseType');

module.exports = function getPackagesStats (packages) {
  const packagesAr = Object.values(packages);
  const count = packagesAr.length;
  const size = packagesAr.reduce((s, pkg) => {
    s += Number(pkg.size);
    return s;
  }, 0);
  const licenses = packagesAr.reduce((l, pkg) => {
    const license = getLicenseStr(pkg.license);
    l[license] = l[license] || 0;
    l[license] += 1;
    return l;
  }, {});
  const licenseTypes = {};
  Object.entries(licenses).forEach(([licenseName, license]) => {
    const type = getLicenseType(licenseName);
    if (!(type in licenseTypes)) {
      licenseTypes[type] = 0;
    }
    licenseTypes[type] += license;
  });
  return {
    count, size, licenses, licenseTypes
  };
};
