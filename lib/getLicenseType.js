/**
 * @file Returns licensee type.
 */

import {readFileSync} from 'node:fs';

import satisfies from './satisfies.js';

const licenseTypes = JSON.parse(readFileSync(new URL('licenses.json', import.meta.url)));

/**
 * @param {string} license
 * @returns {string}
 */
export default function getLicenseType (license) {
  for (const [testType, licenseType] of Object.entries(licenseTypes)) {
    const matches = licenseType.some((testLicense) => {
      return satisfies(license, testLicense);
    });
    if (matches) {
      return testType;
    }
  }
  return 'uncategorized';
}
