/**
 * @file print quick stats
 */

'use strict';

const readline = require('readline');
const filesize = require('filesize');

const getPackagesStats = require('./getPackagesStats');
const formatLicenseType = require('./formatLicenseType');
const getSimpleTable = require('./getSimpleTable');

/**
 * @param {PlainObject} packages
 * @returns {string}
 */
module.exports = function getQuickStats (packages) {
  const {count, size, licenseTypes} = getPackagesStats(packages);
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout);
  const table = getSimpleTable();
  table.push(
    ['Packages', count, ''],
    ['Size', filesize(size), '']
  );
  Object.entries(licenseTypes).forEach(([type, licenseType], k) => {
    table.push(
      [
        k === 0 ? 'Licenses' : '',
        formatLicenseType(type),
        licenseType
      ]
    );
  });
  return table.toString();
};
