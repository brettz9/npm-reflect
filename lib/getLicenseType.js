/**
 * @file returns licensee type
 */

import {readFileSync} from 'fs';

import satisfies from './satisfies.js';

const licenseTypes = JSON.parse(readFileSync(new URL('licenses.json', import.meta.url)));

/**
 * @param {string} license
 * @returns {string}
 */
export default function getLicenseType (license) {
  let type = 'uncategorized';
  Object.entries(licenseTypes).some(([testType, licenseType]) => {
    return licenseType.some((testLicense) => {
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
}
