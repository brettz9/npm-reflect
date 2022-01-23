/**
 * @file format license types
 */

import colors from 'colors/safe.js';

const labels = {
  publicDomain: `Public Domain`,
  permissive: `Permissive`,
  weaklyProtective: `Weakly Protective`,
  protective: `Protective`,
  networkProtective: `Network Protective`,
  useOrModifyProtective: `Use-or-Modify Protective`,
  uncategorized: `Uncategorized`
};

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
 * @param {string} type
 * @returns {string}
 */
export default function formatLicenseType (type) {
  return colors[palette[type]](labels[type]);
}
