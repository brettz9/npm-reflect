/**
 * @file Print package impact on current package.
 */

import readline from 'node:readline';
import {filesize} from 'filesize';

import getLocalPackage from './getLocalPackage.js';
import calculateImpactPackages from './calculateImpactPackages.js';
import satisfies from './satisfies.js';
import walkDependencies from './walkDependencies.js';
import getPackagesStats from './getPackagesStats.js';
import getLicenseType from './getLicenseType.js';
import getSimpleTable from './getSimpleTable.js';
import formatPackageLicense from './formatPackageLicense.js';

/**
 * @param {object} impactLicenses license -> count
 * @param {object} currentLicenses license -> count
 * @returns {object} license -> {count: number, licenses: string[]}
 */
function calculateNewLicenses (impactLicenses, currentLicenses) {
  return Object.keys(impactLicenses).filter((
    newLicense
  ) => {
    return Object.keys(
      currentLicenses
    ).every(
      (existingLicense) => {
        return !satisfies(newLicense, existingLicense);
      }
    );
  }).reduce((newLicenses, license, k, licenses) => {
    const matchingL = licenses.filter(
      (otherLicense) => {
        return satisfies(otherLicense, license);
      }
    ).toSorted((l1, l2) => l2.length - l1.length);
    newLicenses[matchingL[0]] = {
      count: matchingL.reduce((count, l) => {
        count += impactLicenses[l];
        return count;
      }, 0),
      licenses: matchingL
    };
    return newLicenses;
  }, {});
}

/**
 * @param {object} impactPackages nameVersion -> package stats
 * @param {string[]} licenses raw license strings to match against
 * @returns {string[]} `name@version (license)` entries with one of `licenses`
 */
function getPackageNamesForLicenses (impactPackages, licenses) {
  return Object.entries(impactPackages).filter(([, {license}]) => {
    return licenses.includes(license);
  }).map(([nameVersion, {license}]) => {
    return formatPackageLicense(nameVersion, license);
  });
}

/**
 * @param {number} p
 * @returns {string}
 */
function getPercents (p) {
  return `+${(p * 100).toFixed(2)}%`;
}

/**
 * @param {object} options
 * @param {object} newPackages
 * @returns {Promise<string>}
 */
export default async function getImpact (options, newPackages) {
  const localPackage = await getLocalPackage();
  const dependencies = localPackage.dependencies || {};
  const devDependencies = localPackage.devDependencies || {};
  const allDependencies = options.saveDev ? {...dependencies, ...devDependencies} : {...dependencies};
  if (Object.keys(allDependencies).length === 0) {
    throw new Error('Local package has no dependencies');
  }
  const currentPackages = await walkDependencies(allDependencies);
  const impactPackages = calculateImpactPackages(newPackages, currentPackages);
  const currentPackagesStats = getPackagesStats(currentPackages);
  const impactPackagesStats = getPackagesStats(impactPackages);
  const newLicenses = calculateNewLicenses(
    impactPackagesStats.licenses,
    currentPackagesStats.licenses
  );

  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout);

  const table = getSimpleTable();
  table.push(
    [
      'Packages',
      impactPackagesStats.count,
      getPercents(impactPackagesStats.count / currentPackagesStats.count)
    ],
    [
      'Size',
      filesize(impactPackagesStats.size),
      getPercents(impactPackagesStats.size / currentPackagesStats.size)
    ]
  );
  if (Object.keys(newLicenses).length) {
    const uncategorizedPackages = [];
    Object.entries(newLicenses).forEach(([licenseName, {count, licenses}], k) => {
      table.push([
        k === 0 ? 'Licenses' : '',
        licenseName,
        count
      ]);
      if (getLicenseType(licenseName) === 'uncategorized') {
        uncategorizedPackages.push(
          ...getPackageNamesForLicenses(impactPackages, licenses)
        );
      }
    });
    if (uncategorizedPackages.length) {
      table.push([{
        content: 'Uncategorized packages:',
        colSpan: 3
      }], [{
        content: uncategorizedPackages.join(', '),
        colSpan: 3
      }]);
    }
  } else {
    table.push([{
      content: 'No new licenses',
      colSpan: 3
    }]);
  }
  return table.toString();
}
