/**
 * @file print quick stats
 */

import readline from 'readline';
import filesize from 'filesize';

import getPackagesStats from './getPackagesStats.js';
import formatLicenseType from './formatLicenseType.js';
import getSimpleTable from './getSimpleTable.js';

/**
 * @param {PlainObject} packages
 * @returns {string}
 */
export default function getQuickStats (packages) {
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
}
