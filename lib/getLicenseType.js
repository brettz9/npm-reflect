/**
 * @file Returns licensee type.
 */

import parseExpression from 'spdx-expression-parse';

import satisfies from './satisfies.js';

import licenseTypes from 'license-types/index.json' with {type: 'json'};

// `license-types` flags a license with one or more raw booleans (e.g. a
//   Creative Commons NoDerivatives license sets both `useProtective` and
//   `modifyProtective`), and categories otherwise run from least to most
//   restrictive per its README. This ordering is reused both to pick the
//   winning flag for a single license (the last flag present wins,
//   collapsing `useProtective`/`modifyProtective`, alone or combined, into
//   the single `useOrModifyProtective` category `formatLicenseType`
//   expects) and to rank categories against each other when combining a
//   compound `AND`/`OR` expression's components below.
const categoriesByIncreasingRestriction = [
  'publicDomain',
  'permissive',
  'weaklyProtective',
  'protective',
  'networkProtective',
  'useOrModifyProtective'
];
const flagsByIncreasingRestriction = /** @type {const} */ ([
  ['publicDomain', 'publicDomain'],
  ['permissive', 'permissive'],
  ['weaklyProtective', 'weaklyProtective'],
  ['protective', 'protective'],
  ['networkProtective', 'networkProtective'],
  ['useProtective', 'useOrModifyProtective'],
  ['modifyProtective', 'useOrModifyProtective']
]);

/**
 * @template T
 * @typedef {T[keyof T]} ValueOf
 */
/**
 * @param {ValueOf<typeof licenseTypes>} testInfo raw `license-types` flags for a single license
 * @returns {import('./formatLicenseType.js').LicenseType}
 */
function getCategory (testInfo) {
  return flagsByIncreasingRestriction.reduce((category, [flag, testCategory]) => {
    return Object.hasOwn(testInfo, flag) ? testCategory : category;
  }, /** @type {import('./formatLicenseType.js').LicenseType} */ ('uncategorized'));
}

/**
 * @param {import('./formatLicenseType.js').LicenseType} category
 * @param {import('./formatLicenseType.js').LicenseType} otherCategory
 * @param {boolean} moreRestrictive
 * @returns {import('./formatLicenseType.js').LicenseType} whichever of the two is more (or less) restrictive
 */
function pickByRestriction (category, otherCategory, moreRestrictive) {
  const rank = categoriesByIncreasingRestriction.indexOf(category);
  const otherRank = categoriesByIncreasingRestriction.indexOf(otherCategory);
  return (moreRestrictive ? rank >= otherRank : rank <= otherRank) ? category : otherCategory;
}

/**
 * Combines the categories of a compound `AND`/`OR` expression's two sides.
 * An `AND` expression must comply with both sides at once, so its overall
 *   category is only as good as its more restrictive side (and, since an
 *   unrecognized side could be arbitrarily restrictive, stays
 *   "uncategorized" if either side is). An `OR` expression can comply with
 *   either side, so it takes the less restrictive of the two, falling back
 *   to whichever side is recognized if the other is not.
 * @param {import('./formatLicenseType.js').LicenseType} category
 * @param {import('./formatLicenseType.js').LicenseType} otherCategory
 * @param {"and"|"or"} conjunction
 * @returns {import('./formatLicenseType.js').LicenseType}
 */
function combineCategories (category, otherCategory, conjunction) {
  if (category === 'uncategorized' || otherCategory === 'uncategorized') {
    if (conjunction === 'or') {
      return category === 'uncategorized' ? otherCategory : category;
    }
    return 'uncategorized';
  }
  return pickByRestriction(category, otherCategory, conjunction === 'and');
}

/**
 * @param {parseExpression.Info} node an `spdx-expression-parse` AST node
 * @returns {import('./formatLicenseType.js').LicenseType}
 */
function getNodeCategory (node) {
  return 'license' in node
    ? getLicenseType(node.license)
    : combineCategories(
      getNodeCategory(node.left), getNodeCategory(node.right), node.conjunction
    );
}

/**
 * Handles a compound `AND`/`OR` license expression (e.g.
 *   `(MIT AND CC-BY-3.0)`) that the simple per-pattern loop below can't
 *   match, since each of its tested patterns is itself a single, simple
 *   license.
 * @param {string} license
 * @returns {import('./formatLicenseType.js').LicenseType}
 */
function getCompoundLicenseType (license) {
  let node;
  try {
    node = parseExpression(license);
  } catch {
    return 'uncategorized';
  }
  return 'license' in node ? 'uncategorized' : getNodeCategory(node);
}

/**
 * @param {string} license
 * @returns {import('./formatLicenseType.js').LicenseType}
 */
export default function getLicenseType (license) {
  for (const [testLicense, testInfo] of Object.entries(licenseTypes)) {
    const matches = satisfies(license, testLicense);
    if (matches) {
      return getCategory(testInfo);
    }
  }
  return getCompoundLicenseType(license);
}
