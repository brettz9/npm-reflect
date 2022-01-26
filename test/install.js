import {fileURLToPath} from 'url';
import {join, dirname} from 'path';
import inquirer from 'inquirer';

import install from '../lib/install.js';

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

describe('`install`', function () {
  this.timeout(80000);

  afterEach(() => {
    // eslint-disable-next-line no-console -- Spy
    console.log = log;
    inquirer.prompt = prompt;
    process.exit = exit;
  });
  it.skip('Gets string if supplied a string', async function () {
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

    const brightBlackFG = '\u001B[90m';
    const defaultFG = '\u001B[39m';
    const greenFG = '\u001B[32m';
    const space = '\u0020';

    expect(exitCode).to.equal(0);
    expect(val).to.equal(
      // eslint-disable-next-line indent -- Readability
`Packages ${brightBlackFG} ${defaultFG}1          ${brightBlackFG} ${defaultFG}  ${brightBlackFG} ${defaultFG}${space}
Size     ${brightBlackFG} ${defaultFG}0 B        ${brightBlackFG} ${defaultFG}  ${brightBlackFG} ${defaultFG}${space}
Licenses ${brightBlackFG} ${defaultFG}${greenFG}Permissive${defaultFG} ${brightBlackFG} ${defaultFG}1 ${brightBlackFG} ${defaultFG}${space}`
    );
  });
});
