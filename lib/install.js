/* eslint-disable no-console -- Should reenable and refactor so that only CLI file uses */
/**
 * @file Install action.
 */

import readline from 'node:readline';
import colors from 'colors/safe.js';
import inquirer from 'inquirer';
import {filesize} from 'filesize';

import getLocalPackage from './getLocalPackage.js';
import walkDependencies from './walkDependencies.js';
import getInstallCommand from './getInstallCommand.js';
import exec from './exec.js';
import getDetails from './getDetails.js';
import isProduction from './isProduction.js';
import getPackagesStats from './getPackagesStats.js';
import formatLicenseType from './formatLicenseType.js';
import getSimpleTable from './getSimpleTable.js';
import printError from './printError.js';

/**
 * @param {string} nameVersion
 * @param {object} packages
 * @param {object} options
 * @returns {Promise<void>}
 */
async function promptAction (nameVersion, packages, options) {
  const {command, args} = await getInstallCommand(nameVersion, options);
  const choices = [
    `Install (${
      colors.bold(`${
        command
      }${
        args.length ? ' ' : ''
      }${
        args.join(` `)
      }`)
    })`,
    `Details`,
    `Skip`
  ];
  try {
    const {next} = await inquirer.prompt({
      type: `select`,
      name: `next`,
      message: `What is next?`,
      choices
    });

    switch (choices.indexOf(next)) {
    case 0:
      exec(command, args);
      // eslint-disable-next-line no-throw-literal -- Used as hook for exit
      throw undefined;
    case 1:
      console.log(getDetails(packages));
      process.exit(0);
      return;
    default:
      process.exit(0);
    }
  } catch (e) {
    if (e) {
      throw e;
    }
  }
}

/**
 * @param {object} localPackage package.json
 * @returns {object} test config
 */
function getTestConfig (localPackage) {
  const config = localPackage.config || {};
  return config;
}

/**
 * @param {number} current
 * @param {number} max
 * @param {{failed: boolean}} state
 * @param {GenericCallback} [formatter]
 * @returns {string}
 */
function getLimitResult (current, max, state, formatter = String) {
  if (!max) {
    return '';
  }
  if (current < max) {
    return colors.green(`<= ${formatter(max)}`);
  }
  state.failed = true;
  return colors.red(`>  ${formatter(max)}`);
}

/**
 * @param {string[]} allowedLicenseTypes
 * @param {string} type
 * @param {{failed: boolean}} state
 * @returns {string}
 */
function checkLicenseType (allowedLicenseTypes, type, state) {
  if (allowedLicenseTypes && allowedLicenseTypes.length) {
    if (allowedLicenseTypes.includes(type)) {
      return colors.green('✓');
    }
    state.failed = true;
    return colors.red('x');
  }
  return '';
}

/**
 * Print package stats with relation to test limits.
 * @param {object} testConfig
 * @param {number} testConfig.maxSizeBites
 * @param {number} testConfig.maxPackagesNumber
 * @param {string[]} testConfig.allowedLicenseTypes
 * @param {object} packages
 * @returns {{table: string, failed: boolean}}
 */
function getPackageStats ({
  maxSizeBites,
  maxPackagesNumber,
  allowedLicenseTypes
}, packages) {
  const {count, size, licenseTypes} = getPackagesStats(packages);
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout);
  const table = getSimpleTable();
  const state = {failed: false};
  table.push(
    ['Packages', count, '', getLimitResult(count, maxPackagesNumber, state)],
    ['Size', filesize(size), '', getLimitResult(size, maxSizeBites, state, filesize)]
  );
  Object.entries(licenseTypes).forEach(([type, licenseType], k) => {
    table.push(
      [
        k === 0 ? 'Licenses' : '',
        formatLicenseType(type),
        licenseType,
        checkLicenseType(allowedLicenseTypes, type, state)
      ]
    );
  });
  return {table: table.toString(), failed: state.failed};
}

/**
 * @param {string} nameVersion
 * @param {object} options
 * @returns {Promise<void>}
 */
export default async function install (nameVersion, options) {
  try {
    const localPackage = await getLocalPackage();
    const {
      name, version, dependencies, devDependencies
    } = localPackage;
    console.log(colors.bold(
      `${name}@${version}`
    ));
    const allDependencies = {
      ...dependencies
    };
    if (!isProduction(options)) {
      Object.assign(
        allDependencies,
        devDependencies || {}
      );
    }
    const packages = await walkDependencies(allDependencies);
    const {table, failed} = getPackageStats(getTestConfig(localPackage), packages);
    console.log(table);
    if (options.test) {
      // TODO: verify that test config is ok
      if (failed) {
        printError(`Limits provided in package.json are not satisfied`);
        process.exit(1);
      }
      return;
    }
    return promptAction(nameVersion, packages, options);
  } catch (e) {
    printError(e);
    process.exit(1);
  }
}
