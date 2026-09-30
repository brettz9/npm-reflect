/**
 * @file Get spdx expression from license field.
 */

/**
 * @typedef {string|{type?: string}} MainLicenseType
 */

/**
 * @param {MainLicenseType|MainLicenseType[]|null|undefined} licenseObj
 * @returns {string|"Unknown"}
 */
export default function getLicenseStr (licenseObj) {
  if (typeof licenseObj === 'string') {
    return licenseObj;
  }
  if (Array.isArray(licenseObj)) {
    const strs = licenseObj.map((obj) => getLicenseStr(obj));
    // A single-item `licenses` array (the deprecated npm format, e.g.
    //   `{"licenses": [{"type": "MIT", "url": "..."}]}`) is just one
    //   license, not a real "OR" expression, so it should resolve to a
    //   bare, matchable SPDX identifier like `MIT` rather than `(MIT)`
    //   (which `spdx-satisfies` fails to parse, leaving it uncategorized).
    return strs.length === 1 ? strs[0] : `(${strs.join(` OR `)})`;
  }
  return licenseObj && typeof licenseObj === 'object' ? licenseObj.type || `Unknown` : `Unknown`;
}
