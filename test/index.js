import {fileURLToPath} from 'url';
import {join, dirname} from 'path';
import inquirer from 'inquirer';

import spdxCorrectResults from './results/spdxCorrectResults.js';

import {installPackageOrLocal} from '../index.js';
import {CFG} from '../lib/getPackageDetails.js';
import {brightBlackFG, defaultFG, greenFG, redFG} from './utils/ansi.js';

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

describe('`index` installPackageOrLocal', function () {
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
    expect(details).to.equal(spdxCorrectResults);
  });
});
