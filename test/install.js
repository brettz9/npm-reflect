import {fileURLToPath} from 'url';
import {join, dirname} from 'path';
import inquirer from 'inquirer';

import install from '../lib/install.js';
import {CFG} from '../lib/getPackageDetails.js';
import {brightBlackFG, defaultFG, greenFG, redFG, space} from './utils/ansi.js';

const {prompt} = inquirer;
const {log, error} = console;
const {exit} = process;
const __dirname = dirname(fileURLToPath(import.meta.url));

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
      'Skip'
    ]);

    return {next: promptValue};
  };
}

describe('`install`', function () {
  this.timeout(80000);

  beforeEach(() => {
    CFG.npmConfig = undefined;
    CFG.packageDetailsCache = {};
  });

  afterEach(() => {
    // eslint-disable-next-line no-console -- Spy
    console.log = log;
    // eslint-disable-next-line no-console -- Spy
    console.error = error;
    inquirer.prompt = prompt;
    process.exit = exit;
  });

  after(() => {
    CFG.npmConfig = undefined;
    CFG.packageDetailsCache = {};
  });

  it('Gets details if supplied a name-version string', async function () {
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
    await install('jamilih@0.54.0', {});

    expect(exitCode).to.equal(0);
    expect(val).to.equal(
      `${brightBlackFG}┌────────────────${defaultFG}${brightBlackFG}┬──────${defaultFG}${brightBlackFG}┬────────────${defaultFG}${brightBlackFG}┬──────────────────${defaultFG}${brightBlackFG}┬──────────────┐${defaultFG}
${brightBlackFG}│${defaultFG}${redFG} Package        ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Size ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Updated    ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} License          ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Dependencies ${defaultFG}${brightBlackFG}│${defaultFG}
${brightBlackFG}├────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┬─────${defaultFG}${brightBlackFG}┼──────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} jamilih@0.54.0 ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} a year ago ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} MIT ${brightBlackFG}│${defaultFG}              ${brightBlackFG}│${defaultFG}
${brightBlackFG}└────────────────${defaultFG}${brightBlackFG}┴──────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴─────${defaultFG}${brightBlackFG}┴──────────────┘${defaultFG}`
    );
  });

  it('Gets details if supplied a name-version string', async function () {
    process.chdir(join(__dirname, 'fixtures/bad-deps-path'));
    setPrompt('Details');

    let err;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.error = (obj) => {
      err = obj;
    };
    process.exit = (code) => {
      exitCode = code;
    };
    await install('jamilih@0.54.0', {});
    expect(exitCode).to.equal(1);
    expect(err).to.contain(
      'Cannot convert undefined or null to object'
    );
  });

  it('Errs out on test mode and over the maximum', async function () {
    process.chdir(join(__dirname, 'fixtures/has-config-path-max-over'));
    setPrompt('Details');
    let val;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.error = (str) => {
      val = str;
    };
    process.exit = (code) => {
      exitCode = code;
    };
    await install('jamilih@0.54.0', {
      test: true
    });

    expect(exitCode).to.equal(1);
    expect(val).to.equal(
      `${redFG}Limits provided in package.json are not satisfied${defaultFG}`
    );
  });

  it('Succeeds on test mode under a maximum', async function () {
    process.chdir(join(__dirname, 'fixtures/has-config-path-max-less-than'));
    setPrompt('Details');
    let errVal;
    let logVal;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.error = (str) => {
      errVal = str;
    };
    // eslint-disable-next-line no-console -- Spy
    console.log = (str) => {
      logVal = str;
    };
    process.exit = (code) => {
      exitCode = code;
    };
    await install('jamilih@0.54.0', {
      test: true
    });

    expect(exitCode).to.equal(undefined);
    expect(errVal).to.equal(undefined);

    expect(logVal).to.equal(
      // eslint-disable-next-line no-console -- Readability
`Packages ${brightBlackFG} ${defaultFG}1          ${brightBlackFG} ${defaultFG}  ${brightBlackFG} ${defaultFG}${greenFG}<= 100${defaultFG}${space}
Size     ${brightBlackFG} ${defaultFG}0 B        ${brightBlackFG} ${defaultFG}  ${brightBlackFG} ${defaultFG}${space.repeat(7)}
Licenses ${brightBlackFG} ${defaultFG}${greenFG}Permissive${defaultFG} ${brightBlackFG} ${defaultFG}1 ${brightBlackFG} ${defaultFG}       `
    );
  });

  it('Errs out on test mode and over the maximum', async function () {
    process.chdir(join(__dirname, 'fixtures/has-config-path-no-allowed'));
    setPrompt('Details');
    let val;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.error = (str) => {
      val = str;
    };
    process.exit = (code) => {
      exitCode = code;
    };
    await install('jamilih@0.54.0', {
      test: true
    });

    expect(exitCode).to.equal(1);
    expect(val).to.equal(
      `${redFG}Limits provided in package.json are not satisfied${defaultFG}`
    );
  });

  it('Gets check for allowed licenses', async function () {
    process.chdir(join(__dirname, 'fixtures/has-config-path-with-allowed'));
    setPrompt('Details');
    let errVal;
    let logVal;
    let exitCode;
    // eslint-disable-next-line no-console -- Spy
    console.error = (str) => {
      errVal = str;
    };
    // eslint-disable-next-line no-console -- Spy
    console.log = (str) => {
      logVal = str;
    };
    process.exit = (code) => {
      exitCode = code;
    };
    await install('jamilih@0.54.0', {
      test: true
    });

    expect(exitCode).to.equal(undefined);
    expect(errVal).to.equal(undefined);

    expect(logVal).to.equal(
      // eslint-disable-next-line indent -- Readability
`Packages ${brightBlackFG} ${defaultFG}1          ${brightBlackFG} ${defaultFG}  ${brightBlackFG} ${defaultFG}${space.repeat(2)}
Size     ${brightBlackFG} ${defaultFG}0 B        ${brightBlackFG} ${defaultFG}  ${brightBlackFG} ${defaultFG}${space.repeat(2)}
Licenses ${brightBlackFG} ${defaultFG}${greenFG}Permissive${defaultFG} ${brightBlackFG} ${defaultFG}1 ${brightBlackFG} ${defaultFG}${greenFG}✓${defaultFG}${space}`
    );
  });
});
