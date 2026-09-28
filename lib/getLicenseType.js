/**
 * @file Returns licensee type.
 */

import satisfies from './satisfies.js';

import licenseTypes from 'license-types/index.json' with {type: 'json'};

/**
 * @param {string} license
 * @returns {string}
 */
export default function getLicenseType (license) {
  for (const [testLicense, testInfo] of Object.entries(licenseTypes)) {
    const matches = satisfies(license, testLicense);
    if (matches) {
      return Object.keys(testInfo)[0];
    }
  }
  return 'uncategorized';
}
