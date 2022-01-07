/**
 * @file returns licensee type
 */

'use strict';

const licenseTypes = require(`./licenses.json`);
const satisfies = require('./satisfies');

module.exports = function getLicenseType (license) {
  let type = 'uncategorized';
  Object.keys(licenseTypes).some((testType) => {
    return licenseTypes[testType].some((testLicense) => {
      if (
        satisfies(
          license,
          testLicense
        )
      ) {
        type = testType;
        return true;
      }
      return false;
    });
  });
  return type;
};
