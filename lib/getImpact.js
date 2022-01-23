/**
 * @file print package impact on current package
 */

import readline from 'readline';
import filesize from 'filesize';

import getLocalPackage from './getLocalPackage.js';
import calculateImpactPackages from './calculateImpactPackages.js';
import satisfies from './satisfies.js';
import walkDependencies from './walkDependencies.js';
import getPackagesStats from './getPackagesStats.js';
import getSimpleTable from './getSimpleTable.js';

/**
 * @param {PlainObject} impactLicenses license -> count
 * @param {PlainObject} currentLicenses license -> count
 * @returns {PlainObject} license -> count
 */
function calculateNewLicenses (impactLicenses, currentLicenses) {
  return Object.keys(impactLicenses).filter((
    newLicense
  ) => {
    return !Object.keys(
      currentLicenses
    ).some(
      (existingLicense) => {
        return satisfies(newLicense, existingLicense);
      }
    );
  }).reduce((newLicenses, license, k, licenses) => {
    const matchingL = licenses.filter(
      (otherLicense) => {
        return satisfies(otherLicense, license);
      }
    ).sort((l1, l2) => l2.length - l1.length);
    newLicenses[matchingL[0]] = matchingL.reduce((count, l) => {
      count += impactLicenses[l];
      return count;
    }, 0);
    return newLicenses;
  }, {});
}

/**
 * @param {number} p
 * @returns {string}
 */
function getPercents (p) {
  return `+${(p * 100).toFixed(2)}%`;
}

/**
 * @param {PlainObject} options
 * @param {PlainObject} newPackages
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
    Object.entries(newLicenses).forEach(([licenseName, newLicense], k) => {
      table.push([
        k === 0 ? 'Licenses' : '',
        licenseName,
        newLicense
      ]);
    });
  } else {
    table.push([{
      content: 'No new licenses',
      colSpan: 3
    }]);
  }
  return table.toString();
}
