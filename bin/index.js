#!/usr/bin/env node

'use strict';

const program = require('commander');

const packageJson = require('../package.json');
const {installPackageOrLocal} = require('../index');

program.version(packageJson.version);
program.description(packageJson.description);
program.usage('npm-reflect install <pkg>');

if (!process.argv.slice(2).length) {
  program.outputHelp();
}

program.command('help', {isDefault: true})
  .action(() => {
    program.help();
  })
  .command(`install [pkg]`)
  .alias(`i`)
  .action(installPackageOrLocal)
  .option(`-S, --save`, `Save to dependencies`)
  .option(`-D, --save-dev`, `Save to devDependencies`)
  .option(`--production`, `Will not install modules listed in devDependencies`)
  .option(`--test`, `Exit with code 1 if package limits like maxPackagesNumber or maxSizeBites exceeded`);

program.parse(process.argv);
