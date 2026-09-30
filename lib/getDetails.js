/**
 * @file Print table with all dependencies.
 */

import Table from 'cli-table3';
import {filesize} from 'filesize';
import moment from 'moment';

import formatLicenseType from './formatLicenseType.js';

/**
 * @typedef {{
 *   name: string,
 *   version: string,
 *   modified: string,
 *   license: string,
 *   size: string|number|null,
 *   dependencies: Record<string, string>,
 *   licenseType: import('./formatLicenseType.js').LicenseType,
 *   versionLoose: string
 * }} Package
 */
/**
 * @typedef {Record<string, Package>} Packages
 */

/**
 * @typedef {Record<string, Partial<Package>>} PartialPackageRecord
 */

/**
 * @param {PartialPackageRecord} packages
 * @returns {string}
 */
export default function getDetails (packages) {
  const table = new Table({
    // @ts-expect-error Ok in upstream `master`
    head: /** @type {import('cli-table3').Cell[]} */ ([
      `Package`,
      `Size`,
      `Updated`,
      {content: 'License', colSpan: 2},
      `Dependencies`
    ]),
    style: {'padding-left': 1, 'padding-right': 1}
  });
  // `packages` is built by concurrently resolving dependencies over the
  //   network, so its key order is a race and varies between runs; sort it
  //   so the printed table is deterministic.
  Object.entries(packages).toSorted(([a], [b]) => a.localeCompare(b)).forEach(([key, {
    modified, license, size, dependencies, licenseType
  }]) => {
    /** @type {string[]} */
    const dependenciesAr = [];
    Object.entries(dependencies ?? {}).forEach(([k, dependency]) => {
      dependenciesAr.push(`${k}@${dependency}`);
    });
    table.push([
      key,
      filesize(size ?? 0),
      moment(modified).fromNow(),
      formatLicenseType(/** @type {import('./formatLicenseType.js').LicenseType} */ (licenseType)).replaceAll(' ', '\n'),
      license,
      dependenciesAr.join(',\n')
    ]);
  });
  // process.stdout.cursorTo(0);
  // process.stdout.clearLine(1);
  return table.toString();
}
