/* eslint-disable no-console -- Should reenable and refactor so that only CLI file uses */

/**
 * @file main file
 */

import moment from 'moment';
import inquirer from 'inquirer';
import colors from 'colors/safe.js';

import getPackageDetails from './lib/getPackageDetails.js';
import walkDependencies from './lib/walkDependencies.js';
import getImpact from './lib/getImpact.js';
import getDetails from './lib/getDetails.js';
import getQuickStats from './lib/getQuickStats.js';
import exec from './lib/exec.js';
import getInstallCommand from './lib/getInstallCommand.js';
import install from './lib/install.js';

/**
 * @param {string} nameVersion
 * @returns {PlainObject} name and version loose
 */
function parseName (nameVersion) {
  // TODO: check urls
  let nameVersionStr = String(nameVersion).trim();
  let scope = false;
  if (nameVersionStr[0] === `@`) {
    scope = true;
    nameVersionStr = nameVersionStr.slice(1);
  }
  let [name, versionLoose] = nameVersionStr.split(`@`);
  if (!versionLoose) {
    versionLoose = `latest`;
  }
  if (scope) {
    name = `@${name}`;
  }
  return {name, versionLoose};
}

/**
 * @param {"npm"|"pnpm"|"yarn"} command
 * @param {string[]} args
 * @returns {string[]} prompt choices
 */
function getChoices (command, args) {
  return [
    `Install (${colors.bold(`${command} ${args.join(' ')}`)})`,
    `Impact`,
    `Details`,
    `Skip`
  ];
}

/**
 * Exporting so can unit test
 * @param {PlainObject} options
 * @param {string} nameVersion
 * @param {PlainObject} packages
 * @returns {Promise<void|*>} Recursive until exit
 */
async function promptNextAction (options, nameVersion, packages) {
  try {
    const {command, args} = await getInstallCommand(nameVersion, options);
    const choices = getChoices(command, args);
    const {next} = await inquirer.prompt({
      type: `list`,
      name: `next`,
      message: `What is next?`,
      choices
    });
    switch (choices.indexOf(next)) {
    case 0:
      exec(command, args);
      // eslint-disable-next-line no-throw-literal -- Using for exit
      throw undefined;
    case 1: {
      try {
        const impact = await getImpact(options, packages);
        console.log(impact);
      } catch (error) {
        console.log(error);
      }
      return;
    } case 2:
      console.log(getDetails(packages));
      process.exit(0);
      return; // Keep for unit testing when `exit` does not actually exit
    default:
      process.exit(0);
      return; // Keep for unit testing when `exit` does not actually exit
    }
  } catch (e) {
    if (e) {
      throw e;
    }
  }
  return await promptNextAction(options, nameVersion, packages);
}

/**
 * Install action.
 * @param {string} nameVersion package considering to install
 * @param {PlainObject} options
 * @returns {Promise<void>}
 */
async function installPackage (nameVersion, options) {
  const {name, versionLoose} = parseName(nameVersion);
  try {
    const packageStats = await getPackageDetails(name, versionLoose);
    process.stdout.cursorTo(0);
    process.stdout.clearLine(1);
    process.stdout.write(`${
      colors.bold(
        `${packageStats.name}@${packageStats.version}`
      )
    } (updated ${
      moment(packageStats.modified).fromNow()
    })\n`);
    const packages = await walkDependencies(
      {[name]: versionLoose}
    );
    console.log(getQuickStats(packages));
    return promptNextAction(options, nameVersion, packages);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

/**
 * @param {string} pkg package considering to install
 * @param {PlainObject} options Not in use
 * @returns {Promise<void>}
 */
async function installPackageOrLocal (pkg, options) {
  if (pkg) {
    return await installPackage(pkg, options);
  }
  return await install(null, options);
}

export {install, installPackage, installPackageOrLocal, promptNextAction};
