import {fileURLToPath} from 'url';
import {join, dirname} from 'path';
import inquirer from 'inquirer';

import {installPackageOrLocal} from '../index.js';
import {brightBlackFG, defaultFG, greenFG, space} from './utils/ansi.js';

const {prompt} = inquirer;
const {log} = console;
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

    return promptValue;
  };
}

describe('`index` installPackageOrLocal', function () {
  this.timeout(80000);

  afterEach(() => {
    // eslint-disable-next-line no-console -- Spy
    console.log = log;
    inquirer.prompt = prompt;
    process.exit = exit;
  });
  it('Gets string if supplied a string', async function () {
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

    expect(exitCode).to.equal(0);
    expect(val).to.equal(
      // eslint-disable-next-line indent -- Readability
`Packages ${brightBlackFG} ${defaultFG}1          ${brightBlackFG} ${defaultFG} ${space}
Size     ${brightBlackFG} ${defaultFG}0 B        ${brightBlackFG} ${defaultFG} ${space}
Licenses ${brightBlackFG} ${defaultFG}${greenFG}Permissive${defaultFG} ${brightBlackFG} ${defaultFG}1${space}`
    );
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
});
