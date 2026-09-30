/**
 * @file Format license types.
 */

import colors from 'colors/safe.js';

/**
 * @typedef {keyof typeof labels} LicenseType
 */

const labels = {
  publicDomain: `Public Domain`,
  permissive: `Permissive`,
  weaklyProtective: `Weakly Protective`,
  protective: `Protective`,
  networkProtective: `Network Protective`,
  useOrModifyProtective: `Use-or-Modify Protective`,
  uncategorized: `Uncategorized`
};

/** @type {{[k in LicenseType]: "green"|"cyan"|"magenta"|"grey"}} */
const palette = {
  publicDomain: `green`,
  permissive: `green`,
  weaklyProtective: `cyan`,
  protective: `magenta`,
  networkProtective: `magenta`,
  useOrModifyProtective: `magenta`,
  uncategorized: `grey`
};

/**
 * @param {LicenseType} type
 * @returns {string}
 */
export default function formatLicenseType (type) {
  return colors[palette[type]](labels[type]);
}
