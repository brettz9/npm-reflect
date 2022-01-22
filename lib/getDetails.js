/**
 * @file print table with all dependencies
 */

'use strict';

const Table = require('cli-table3');
const filesize = require('filesize');
const moment = require('moment');

const formatLicenseType = require('./formatLicenseType');

/**
 * @param {PlainObject} packages
 * @returns {string}
 */
module.exports = function getDetails (packages) {
  const table = new Table({
    head: [
      `Package`,
      `Size`,
      `Updated`,
      {content: 'License', colSpan: 2},
      `Dependencies`
    ],
    style: {'padding-left': 1, 'padding-right': 1}
  });
  Object.entries(packages).forEach(([key, {
    modified, license, size, dependencies, licenseType
  }]) => {
    const dependenciesAr = [];
    Object.entries(dependencies).forEach(([k, dependency]) => {
      dependenciesAr.push(`${k}@${dependency}`);
    });
    table.push([
      key,
      filesize(size),
      moment(modified).fromNow(),
      `${
        formatLicenseType(licenseType)
          .split(' ')
          .join('\n')
      }`,
      license,
      dependenciesAr.join(',\n')
    ]);
  });
  // process.stdout.cursorTo(0);
  // process.stdout.clearLine(1);
  return table.toString();
};
