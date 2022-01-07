/**
 * @file format license types
 */

'use strict';

const colors = require('colors/safe');

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

module.exports = function formatLicenseType (type) {
  return colors[palette[type]](labels[type]);
};
