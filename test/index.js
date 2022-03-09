import {fileURLToPath} from 'url';
import {join, dirname} from 'path';
import inquirer from 'inquirer';
import colors from 'colors/safe.js';

import {spdxCorrectResults1, spdxCorrectResults2} from './results/spdxCorrectResults.js';

import {installPackageOrLocal, promptNextAction} from '../index.js';
import {CFG} from '../lib/getPackageDetails.js';
import {brightBlackFG, defaultFG, greenFG, redFG, space} from './utils/ansi.js';

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
    let val;
    let exitCode;

    // eslint-disable-next-line no-console -- Mock
    console.log = (...args) => {
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
    expect(exitCode).to.equal(undefined);
    expect(val).to.equal(undefined);
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

    const expected =
`${brightBlackFG}┌────────────────${defaultFG}${brightBlackFG}┬──────${defaultFG}${brightBlackFG}┬────────────${defaultFG}${brightBlackFG}┬──────────────────${defaultFG}${brightBlackFG}┬──────────────┐${defaultFG}
${brightBlackFG}│${defaultFG}${redFG} Package        ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Size ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Updated    ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} License          ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Dependencies ${defaultFG}${brightBlackFG}│${defaultFG}
${brightBlackFG}├────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┬─────${defaultFG}${brightBlackFG}┼──────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} jamilih@0.54.0 ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} a year ago ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} MIT ${brightBlackFG}│${defaultFG}              ${brightBlackFG}│${defaultFG}
${brightBlackFG}└────────────────${defaultFG}${brightBlackFG}┴──────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴─────${defaultFG}${brightBlackFG}┴──────────────┘${defaultFG}`;

    // log('expected', expected);

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

    const expected =
`${brightBlackFG}┌────────────────${defaultFG}${brightBlackFG}┬──────${defaultFG}${brightBlackFG}┬────────────${defaultFG}${brightBlackFG}┬──────────────────${defaultFG}${brightBlackFG}┬──────────────┐${defaultFG}
${brightBlackFG}│${defaultFG}${redFG} Package        ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Size ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Updated    ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} License          ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Dependencies ${defaultFG}${brightBlackFG}│${defaultFG}
${brightBlackFG}├────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┬─────${defaultFG}${brightBlackFG}┼──────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} jamilih@0.54.0 ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} a year ago ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} MIT ${brightBlackFG}│${defaultFG}              ${brightBlackFG}│${defaultFG}
${brightBlackFG}└────────────────${defaultFG}${brightBlackFG}┴──────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴─────${defaultFG}${brightBlackFG}┴──────────────┘${defaultFG}`;

    // log('expected', expected);

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

    const expected =
`${brightBlackFG}┌──────────────────────${defaultFG}${brightBlackFG}┬──────${defaultFG}${brightBlackFG}┬──────────────${defaultFG}${brightBlackFG}┬──────────────────${defaultFG}${brightBlackFG}┬─────────────────┐${defaultFG}\n${brightBlackFG}│${defaultFG}${redFG} Package              ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Size ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Updated      ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} License${space.repeat(9)} ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Dependencies    ${defaultFG}${brightBlackFG}│${defaultFG}\n${brightBlackFG}├──────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┬─────${defaultFG}${brightBlackFG}┼─────────────────┤${defaultFG}\n${brightBlackFG}│${defaultFG} @types/esprima@4.0.3 ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} 8 months ago ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} MIT ${brightBlackFG}│${defaultFG} @types/estree@* ${brightBlackFG}│${defaultFG}\n${brightBlackFG}├──────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼─────${defaultFG}${brightBlackFG}┼─────────────────┤${defaultFG}\n${brightBlackFG}│${defaultFG} @types/estree@0.0.51 ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} a month ago  ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} MIT ${brightBlackFG}│${defaultFG}${space.repeat(16)} ${brightBlackFG}│${defaultFG}\n${brightBlackFG}└──────────────────────${defaultFG}${brightBlackFG}┴──────${defaultFG}${brightBlackFG}┴──────────────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴─────${defaultFG}${brightBlackFG}┴─────────────────┘${defaultFG}`;

    expect(exitCode).to.equal(0);
    expect(val).to.equal(expected);
  });

  it('Logs error if package not found', async function () {
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
    expect(details).to.be.oneOf([
      spdxCorrectResults1,
      spdxCorrectResults2
    ]);
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
    expect(exitCode).to.equal(undefined);
    expect(details).to.equal(
      // eslint-disable-next-line indent -- Readability
`Packages ${brightBlackFG} ${defaultFG}0   ${brightBlackFG} ${defaultFG}+0.00%${space}
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
    expect(exitCode).to.equal(undefined);
    expect(details.message).to.equal(
      `Cannot convert undefined or null to object`
    );
  });

  it('Logs error if package not found', async function () {
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
    expect(val).to.equal(undefined);
  });
});
