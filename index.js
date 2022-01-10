/* eslint-disable no-console -- Should reenable and refactor so that only CLI file uses */

/**
 * @file main file
 */

'use strict';

const moment = require('moment');
const inquirer = require('inquirer');
const colors = require('colors/safe');

const getPackageDetails = require('./lib/getPackageDetails');
const walkDependencies = require('./lib/walkDependencies');
const getImpact = require('./lib/getImpact');
const getDetails = require('./lib/getDetails');
const getQuickStats = require('./lib/getQuickStats');
const exec = require('./lib/exec');
const getInstallCommand = require('./lib/getInstallCommand');
const install = require('./lib/install');

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
 * @param {PlainObject} options
 * @param {string} nameVersion
 * @param {string} name
 * @param {string} versionLoose
 * @param {PlainObject} packages
 * @returns {Promise<void|*>} Recursive until exit
 */
function promptNextAction (options, nameVersion, name, versionLoose, packages) {
  return getInstallCommand(nameVersion, options).then(({command, args}) => {
    const choices = getChoices(command, args);
    return inquirer.prompt({
      type: `list`,
      name: `next`,
      message: `What is next?`,
      choices
    }).then(({next}) => {
      switch (choices.indexOf(next)) {
      case 0:
        exec(command, args);
        // eslint-disable-next-line no-throw-literal -- Using for exit
        throw undefined;
      case 1:
        return getImpact(options, name, versionLoose, packages).then((impact) => {
          console.log(impact);
        }).catch((error) => {
          console.log(error);
        });
      case 2:
        console.log(getDetails(packages));
        process.exit(0);
        return;
      default:
        process.exit(0);
      }
    });
  }).then(() => {
    return promptNextAction(options, nameVersion, name, versionLoose, packages);
  }, (e) => {
    if (e) {
      throw e;
    }
  });
}

/**
 * Install action.
 * @param {string} nameVersion package considering to install
 * @param {PlainObject} options
 * @returns {void}
 */
function installPackage (nameVersion, options) {
  const {name, versionLoose} = parseName(nameVersion);
  getPackageDetails(name, versionLoose)
    .then((packageStats) => {
      process.stdout.cursorTo(0);
      process.stdout.clearLine(1);
      process.stdout.write(`${
        colors.bold(
          `${packageStats.name}@${packageStats.version}`
        )
      } (updated ${
        moment(packageStats.modified).fromNow()
      })\n`);
      return walkDependencies(
        {[name]: versionLoose}
      );
    })
    .then((packages) => {
      console.log(getQuickStats(packages));
      return promptNextAction(options, nameVersion, name, versionLoose, packages);
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

/**
 * @param {string} pkg package considering to install
 * @param {PlainObject} options Not in use
 * @returns {void}
 */
function installPackageOrLocal (pkg, options) {
  if (pkg) {
    installPackage(pkg, options);
  } else {
    install(null, options);
  }
}

/* eslint-disable node/exports-style -- Allow multiple separate */
exports.install = install;
exports.installPackage = installPackage;
exports.installPackageOrLocal = installPackageOrLocal;
/* eslint-enable node/exports-style -- Allow multiple separate */
