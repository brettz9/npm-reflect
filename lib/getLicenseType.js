/**
 * @file Returns licensee type.
 */

import satisfies from './satisfies.js';

import licenseTypes from 'license-types/index.json' with {type: 'json'};

// `license-types` flags a license with one or more raw booleans (e.g. a
//   Creative Commons NoDerivatives license sets both `useProtective` and
//   `modifyProtective`). Ordered from least to most restrictive per its
//   README, so the last flag present on a given license wins, collapsing
//   `useProtective`/`modifyProtective` (which may appear alone or together)
//   into the single `useOrModifyProtective` category `formatLicenseType`
//   expects.
const flagsByIncreasingRestriction = [
  ['publicDomain', 'publicDomain'],
  ['permissive', 'permissive'],
  ['weaklyProtective', 'weaklyProtective'],
  ['protective', 'protective'],
  ['networkProtective', 'networkProtective'],
  ['useProtective', 'useOrModifyProtective'],
  ['modifyProtective', 'useOrModifyProtective']
];

/**
 * @param {object} testInfo raw `license-types` flags for a single license
 * @returns {string}
 */
function getCategory (testInfo) {
  return flagsByIncreasingRestriction.reduce((category, [flag, testCategory]) => {
    return Object.hasOwn(testInfo, flag) ? testCategory : category;
  }, 'uncategorized');
}

/**
 * @param {string} license
 * @returns {string}
 */
export default function getLicenseType (license) {
  for (const [testLicense, testInfo] of Object.entries(licenseTypes)) {
    const matches = satisfies(license, testLicense);
    if (matches) {
      return getCategory(testInfo);
    }
  }
  return 'uncategorized';
}
