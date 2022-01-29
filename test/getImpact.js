import {fileURLToPath} from 'url';
import {join, dirname} from 'path';

import getImpact from '../lib/getImpact.js';
import spdxCorrectFixture from './fixtures/spdxCorrectFixture.js';
import jamilihFixture from './fixtures/jamilihFixture.js';
import {brightBlackFG, defaultFG, space} from './utils/ansi.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();

describe('`getImpact`', function () {
  this.timeout(50000);
  afterEach(() => {
    process.chdir(cwd);
  });
  it('Returns info table with dependencies with new licenses', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));

    const impact = await getImpact({}, spdxCorrectFixture);

    expect(impact).to.equal(
      `Packages${space.repeat(1)}${brightBlackFG} ${defaultFG}4${space.repeat(10)}${brightBlackFG} ${defaultFG}+400.00%${space}
Size${space.repeat(5)}${brightBlackFG} ${defaultFG}0 B${space.repeat(8)}${brightBlackFG} ${defaultFG}+NaN%${space.repeat(4)}
Licenses${space}${brightBlackFG}${space}${defaultFG}Apache-2.0${space}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}
${space.repeat(9)}${brightBlackFG} ${defaultFG}CC0-1.0${space.repeat(4)}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}
${space.repeat(9)}${brightBlackFG} ${defaultFG}CC-BY-3.0${space.repeat(2)}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}`
    );
  });

  it('Returns info table with saveDev: true and new licenses', async function () {
    process.chdir(join(__dirname, 'fixtures/devDeps-only-path'));

    const impact = await getImpact({
      saveDev: true
    }, spdxCorrectFixture);

    expect(impact).to.equal(
      `Packages${space.repeat(1)}${brightBlackFG} ${defaultFG}4${space.repeat(10)}${brightBlackFG} ${defaultFG}+400.00%${space}
Size${space.repeat(5)}${brightBlackFG} ${defaultFG}0 B${space.repeat(8)}${brightBlackFG} ${defaultFG}+NaN%${space.repeat(4)}
Licenses${space}${brightBlackFG}${space}${defaultFG}Apache-2.0${space}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}
${space.repeat(9)}${brightBlackFG} ${defaultFG}CC0-1.0${space.repeat(4)}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}
${space.repeat(9)}${brightBlackFG} ${defaultFG}CC-BY-3.0${space.repeat(2)}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}`
    );
  });

  it('Indicates no new licenses when none new supplied', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));

    const impact = await getImpact({}, jamilihFixture);

    expect(impact).to.equal(
      `Packages${space.repeat(1)}${brightBlackFG} ${defaultFG}0${space.repeat(3)}${brightBlackFG} ${defaultFG}+0.00%${space}
Size${space.repeat(5)}${brightBlackFG} ${defaultFG}0 B${space}${brightBlackFG} ${defaultFG}+NaN%${space.repeat(2)}
No new licenses${space.repeat(7)}`
    );
  });

  it('Throws upon missing dependencies', async function () {
    process.chdir(join(__dirname, 'fixtures/missing-deps-path'));
    let error;
    try {
      await getImpact({}, spdxCorrectFixture);
    } catch (err) {
      error = err;
    }

    expect(error).to.be.an('Error');
    expect(error.message).to.equal('Local package has no dependencies');
  });

  it('Throws upon missing dependencies and unused devDependencies', async function () {
    process.chdir(join(__dirname, 'fixtures/devDeps-only-path'));
    let error;
    try {
      await getImpact({}, spdxCorrectFixture);
    } catch (err) {
      error = err;
    }

    expect(error).to.be.an('Error');
    expect(error.message).to.equal('Local package has no dependencies');
  });

  it('Throws upon empty dependencies', async function () {
    process.chdir(join(__dirname, 'fixtures/empty-deps-path'));
    let error;
    try {
      await getImpact({}, spdxCorrectFixture);
    } catch (err) {
      error = err;
    }

    expect(error).to.be.an('Error');
    expect(error.message).to.equal('Local package has no dependencies');
  });
});
