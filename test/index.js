import {fileURLToPath} from 'node:url';
import {join, dirname} from 'node:path';
import inquirer from 'inquirer';
import colors from 'colors/safe.js';
import {expect} from 'chai';

import {spdxCorrectResults} from './results/spdxCorrectResults.js';

import {installPackageOrLocal, promptNextAction} from '../index.js';
import {CFG} from '../lib/getPackageDetails.js';
import getDetails from '../lib/getDetails.js';
import {resolvePackageVersion, resolveLatestVersion} from './utils/resolvePackageVersion.js';
import {brightBlackFG, defaultFG, space} from './utils/ansi.js';

const {prompt} = inquirer;
const {log, error: logError} = console;
const {exit} = process;
const __dirname = dirname(fileURLToPath(import.meta.url));

const cwd = process.cwd();

/**
 * @param {string} promptValue
 * @returns {void}
 */
function setPrompt (promptValue) {
  // eslint-disable-next-line require-await -- Just need a Promise return
  inquirer.prompt = async ({type, name, message, choices}) => {
    expect(type).to.equal('list');
    expect(name).to.equal('next');
    expect(message).to.equal('What is next?');

    expect(choices[0]).to.include('Install');
    expect(choices).to.include.members([
      'Details',
      'Impact',
      'Skip'
    ]);

    const next = Array.isArray(promptValue)
      ? promptValue.shift()
      : promptValue;

    return {next};
  };
}

describe('`index` installPackageOrLocal', function () {
  this.timeout(80000);

  beforeEach(() => {
    CFG.packageDetailsCache = {};
    process.chdir(cwd);
  });
  afterEach(() => {
    // eslint-disable-next-line no-console -- Spy
    console.log = log;
    // eslint-disable-next-line no-console -- Spy
    console.error = logError;
    inquirer.prompt = prompt;
    process.exit = exit;
  });
  after(() => {
    CFG.packageDetailsCache = {};
    process.chdir(cwd);
  });

  it('executes npm command line commands without throwing', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));
    // eslint-disable-next-line no-sparse-arrays -- Only want 2+ args
    process.argv = [, , 'whoami'];

    setPrompt([`Install (${colors.bold('npm whoami')})`, 'Skip']);
    let exitCode;

    process.exit = (code) => {
      exitCode = code;
    };

    await promptNextAction({}, 'jamilih@0.54.0');

    expect(exitCode).to.equal(0);
  });

  it('throws with bad command', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));
    setPrompt('Details');
    let exitCode;

    // eslint-disable-next-line no-console -- Mock
    console.log = (/* ...args */) => {
      throw new Error('simulating error');
    };
    process.exit = (code) => {
      exitCode = code;
    };

    let error;
    try {
      await promptNextAction({}, 'jamilih@0.54.0', {});
    } catch (err) {
      error = err;
    }

    expect(error.message).to.contain('simulating error');
    expect(exitCode).to.be.undefined;
  });

  it('Gets string table if supplied a string', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));
    setPrompt('Details');
    let val;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.log = (str) => {
      val = str;
    };
    process.exit = (code) => {
      exitCode = code;
    };
    await installPackageOrLocal('jamilih@0.54.0', {});

    // jamilih@0.54.0 is a pinned, immutable published version, but its
    //   `modified` string (relative to now) and MIT/permissive license
    //   are resolved live rather than hardcoded to avoid drift over time.
    const jamilih = await resolvePackageVersion('jamilih', '0.54.0');
    const expected = getDetails({
      'jamilih@0.54.0': {
        modified: jamilih.modified,
        license: jamilih.license,
        licenseType: 'permissive',
        size: null,
        dependencies: jamilih.dependencies
      }
    });

    expect(exitCode).to.equal(0);
    expect(val).to.equal(expected);
  });

  it('Gets string table if supplied a string (with "latest")', async function () {
    process.chdir(join(__dirname, 'fixtures/latest-dep'));
    setPrompt('Details');
    let val;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.log = (str) => {
      val = str;
    };
    process.exit = (code) => {
      exitCode = code;
    };
    await installPackageOrLocal('jamilih', {});

    // A "latest" dependency always installs whatever npm currently reports
    //   as `latest`, so the version, license and `modified` string are
    //   resolved live rather than hardcoded to avoid drift over time.
    const jamilih = await resolveLatestVersion('jamilih');
    const expected = getDetails({
      [`jamilih@${jamilih.version}`]: {
        modified: jamilih.modified,
        license: jamilih.license,
        licenseType: 'permissive',
        size: null,
        dependencies: jamilih.dependencies
      }
    });

    expect(exitCode).to.equal(0);
    expect(val).to.equal(expected);
  });

  it('Gets string table if supplied a string (with scoped package)', async function () {
    process.chdir(join(__dirname, 'fixtures/scoped-dep'));
    setPrompt('Details');
    let val;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.log = (str) => {
      val = str;
    };
    process.exit = (code) => {
      exitCode = code;
    };
    await installPackageOrLocal('@types/esprima@4.0.3', {});

    // @types/esprima@4.0.3 is a pinned, immutable published version, but its
    //   `@types/estree` dependency resolves to whatever currently satisfies
    //   its declared `*` range, so both packages' `modified` strings and the
    //   resolved `@types/estree` version are resolved live to avoid drift.
    const [esprima, estree] = await Promise.all([
      resolvePackageVersion('@types/esprima', '4.0.3'),
      resolvePackageVersion('@types/estree', '*')
    ]);
    const expected = getDetails({
      '@types/esprima@4.0.3': {
        modified: esprima.modified,
        license: esprima.license,
        licenseType: 'permissive',
        size: null,
        dependencies: esprima.dependencies
      },
      [`@types/estree@${estree.version}`]: {
        modified: estree.modified,
        license: estree.license,
        licenseType: 'permissive',
        size: null,
        dependencies: {}
      }
    });

    expect(exitCode).to.equal(0);
    expect(val).to.equal(expected);
  });

  it('Logs error if package not found (details)', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));
    setPrompt('Details');
    let val;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.error = (obj) => {
      val = obj;
    };
    process.exit = (code) => {
      exitCode = code;
    };
    await installPackageOrLocal('abadpackage@0.54.0', {});

    expect(exitCode).to.equal(1);
    expect(val.message).to.equal(
      `Response is not ok  404 Not Found https://registry.npmjs.org/abadpackage`
    );
  });

  it('Gets details', async function () {
    setPrompt('Details');
    let details;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.log = (str) => {
      details = str;
    };
    process.exit = (code) => {
      exitCode = code;
    };

    await installPackageOrLocal('spdx-correct@3.1.1', {});
    expect(exitCode).to.equal(0);
    expect(details).to.equal(spdxCorrectResults);
  });

  it('Gets impact', async function () {
    setPrompt('Impact');
    let details;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.log = (str) => {
      details = str;
    };
    process.exit = (code) => {
      exitCode = code;
    };

    await installPackageOrLocal('spdx-correct@3.1.1', {});
    expect(exitCode).to.be.undefined;

    // The "Packages" impact percentage depends on this project's own total
    //   dependency count, which changes as package.json's dependencies
    //   change, so it is normalized out rather than hardcoded.
    const normalizedDetails = details.replace(/\+\d+\.\d+%/v, '+X%');
    expect(normalizedDetails).to.equal(
      `Packages ${brightBlackFG} ${defaultFG}1   ${brightBlackFG} ${defaultFG}+X%${space}
Size     ${brightBlackFG} ${defaultFG}0 B ${brightBlackFG} ${defaultFG}+NaN%${space.repeat(2)}
No new licenses${space.repeat(7)}`
    );
  });

  it('Gives error on bad impact', async function () {
    setPrompt('Impact');
    let details;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.log = (str) => {
      details = str;
    };
    process.exit = (code) => {
      exitCode = code;
    };

    await promptNextAction('abadpackage@0.54.0', {});
    expect(exitCode).to.be.undefined;
    expect(details.message).to.equal(
      `Cannot convert undefined or null to object`
    );
  });

  it('Logs error if package not found (skip)', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));
    setPrompt('Skip');
    let val;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.error = (obj) => {
      val = obj;
    };
    process.exit = (code) => {
      exitCode = code;
    };
    await promptNextAction({}, 'jamilih@0.54.0');

    expect(exitCode).to.equal(0);
    expect(val).to.be.undefined;
  });
});
