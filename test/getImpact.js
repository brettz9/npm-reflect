import {fileURLToPath} from 'node:url';
import {join, dirname} from 'node:path';
import {expect} from 'chai';

import getImpact from '../lib/getImpact.js';
import {CFG} from '../lib/getPackageDetails.js';
import spdxCorrectFixture from './fixtures/spdxCorrectFixture.js';
import jamilihFixture from './fixtures/jamilihFixture.js';
import {brightBlackFG, defaultFG, space} from './utils/ansi.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cwd = process.cwd();

describe('`getImpact`', function () {
  this.timeout(50000);
  beforeEach(() => {
    CFG.packageDetailsCache = {};
    process.chdir(cwd);
  });
  after(() => {
    CFG.packageDetailsCache = {};
    process.chdir(cwd);
  });
  it('Returns info table with dependencies with new licenses', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));

    const impact = await getImpact({}, spdxCorrectFixture);

    expect(impact).to.equal(
      `Packages${space.repeat(1)}${brightBlackFG} ${defaultFG}4${space.repeat(10)}${brightBlackFG} ${defaultFG}+400.00%${space}
Size${space.repeat(5)}${brightBlackFG} ${defaultFG}18.08 kB${space.repeat(3)}${brightBlackFG} ${defaultFG}+14.55%${space.repeat(2)}
Licenses${space}${brightBlackFG}${space}${defaultFG}Apache-2.0${space}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}
${space.repeat(9)}${brightBlackFG} ${defaultFG}CC-BY-3.0${space.repeat(2)}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}
${space.repeat(9)}${brightBlackFG} ${defaultFG}CC0-1.0${space.repeat(4)}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}`
    );
  });

  it('Returns info table with saveDev: true and new licenses', async function () {
    process.chdir(join(__dirname, 'fixtures/devDeps-only-path'));

    const impact = await getImpact({
      saveDev: true
    }, spdxCorrectFixture);

    expect(impact).to.equal(
      `Packages${space.repeat(1)}${brightBlackFG} ${defaultFG}4${space.repeat(10)}${brightBlackFG} ${defaultFG}+400.00%${space}
Size${space.repeat(5)}${brightBlackFG} ${defaultFG}18.08 kB${space.repeat(3)}${brightBlackFG} ${defaultFG}+14.55%${space.repeat(2)}
Licenses${space}${brightBlackFG}${space}${defaultFG}Apache-2.0${space}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}
${space.repeat(9)}${brightBlackFG} ${defaultFG}CC-BY-3.0${space.repeat(2)}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}
${space.repeat(9)}${brightBlackFG} ${defaultFG}CC0-1.0${space.repeat(4)}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}`
    );
  });

  it('Indicates no new licenses when none new supplied', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));

    const impact = await getImpact({}, jamilihFixture);

    expect(impact).to.equal(
      `Packages${space.repeat(1)}${brightBlackFG} ${defaultFG}0${space.repeat(3)}${brightBlackFG} ${defaultFG}+0.00%${space}
Size${space.repeat(5)}${brightBlackFG} ${defaultFG}0 B${space}${brightBlackFG} ${defaultFG}+0.00%${space}
No new licenses${space.repeat(7)}`
    );
  });

  it('Lists affected packages for uncategorized licenses', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));

    const newPackages = {
      'not-licensed@1.0.0': {
        name: 'not-licensed',
        version: '1.0.0',
        license: 'Unknown',
        licenseType: 'uncategorized',
        dependencies: {},
        size: null
      }
    };

    const impact = await getImpact({}, newPackages);

    expect(impact).to.equal(
      `Packages${space}${brightBlackFG} ${defaultFG}1${space.repeat(8)}${brightBlackFG} ${defaultFG}+100.00%${space}
Size${space.repeat(5)}${brightBlackFG} ${defaultFG}0 B${space.repeat(6)}${brightBlackFG} ${defaultFG}+0.00%${space.repeat(3)}
Licenses${space}${brightBlackFG} ${defaultFG}Unknown${space.repeat(2)}${brightBlackFG} ${defaultFG}1${space.repeat(8)}
Uncategorized packages:${space.repeat(6)}
not-licensed@1.0.0 (Missing)${space}`
    );
  });

  it('Groups uncategorized packages from different licenses into one section', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));

    const newPackages = {
      'not-licensed@1.0.0': {
        name: 'not-licensed',
        version: '1.0.0',
        license: 'Unknown',
        licenseType: 'uncategorized',
        dependencies: {},
        size: null
      },
      'weird-license@2.0.0': {
        name: 'weird-license',
        version: '2.0.0',
        license: 'SEE LICENSE IN LICENSE',
        licenseType: 'uncategorized',
        dependencies: {},
        size: null
      }
    };

    const impact = await getImpact({}, newPackages);

    expect(impact).to.equal(
      `Packages${space.repeat(12)}${brightBlackFG} ${defaultFG}2${space.repeat(33)}${brightBlackFG} ${defaultFG}+200.00%${space.repeat(11)}
Size${space.repeat(16)}${brightBlackFG} ${defaultFG}0 B${space.repeat(31)}${brightBlackFG} ${defaultFG}+0.00%${space.repeat(13)}
Licenses${space.repeat(12)}${brightBlackFG} ${defaultFG}SEE LICENSE IN LICENSE${space.repeat(12)}${brightBlackFG} ${defaultFG}1${space.repeat(18)}
${space.repeat(20)}${brightBlackFG} ${defaultFG}Unknown${space.repeat(27)}${brightBlackFG} ${defaultFG}1${space.repeat(18)}
Uncategorized packages:${space.repeat(52)}
not-licensed@1.0.0 (Missing), weird-license@2.0.0 (SEE LICENSE IN LICENSE)${space}`
    );
  });

  it('Does not double-parenthesize an already-parenthesized license', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));

    // A made-up (non-SPDX) compound license, so it stays "uncategorized"
    //   and, since neither branch is MIT, isn't satisfied by `jamilih`'s
    //   existing MIT license (which a real license like `(MIT OR CC0-1.0)`
    //   now correctly would be, since fixing `satisfies` to pass a proper
    //   array to `spdx-satisfies`).
    const newPackages = {
      'weird-pkg@1.0.0': {
        name: 'weird-pkg',
        version: '1.0.0',
        license: '(Custom-License OR Another-Thing)',
        licenseType: 'uncategorized',
        dependencies: {},
        size: null
      }
    };

    const impact = await getImpact({}, newPackages);

    expect(impact).to.equal(
      `Packages${space}${brightBlackFG} ${defaultFG}1${space.repeat(33)}${brightBlackFG} ${defaultFG}+100.00%${space}
Size${space.repeat(5)}${brightBlackFG} ${defaultFG}0 B${space.repeat(31)}${brightBlackFG} ${defaultFG}+0.00%${space.repeat(3)}
Licenses${space}${brightBlackFG} ${defaultFG}(Custom-License OR Another-Thing)${space}${brightBlackFG} ${defaultFG}1${space.repeat(8)}
Uncategorized packages:${space.repeat(31)}
weird-pkg@1.0.0 (Custom-License OR Another-Thing)${space.repeat(5)}`
    );
  });

  it('Excludes a compound OR license already covered by an existing simple license', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));

    // `jamilih` (this fixture's only current dependency) is MIT-licensed,
    //   so `(MIT OR CC0-1.0)` (as declared by `type-fest@4.41.0`) is
    //   already satisfied by it and should not be reported as a new
    //   license, even though the two license strings aren't identical.
    const impact = await getImpact({}, {
      'type-fest@4.41.0': {
        name: 'type-fest',
        version: '4.41.0',
        license: '(MIT OR CC0-1.0)',
        licenseType: 'uncategorized',
        dependencies: {},
        size: null
      }
    });

    expect(impact).to.equal(
      `Packages${space}${brightBlackFG} ${defaultFG}1${space.repeat(3)}${brightBlackFG} ${defaultFG}+100.00%${space}
Size${space.repeat(5)}${brightBlackFG} ${defaultFG}0 B${space}${brightBlackFG} ${defaultFG}+0.00%${space.repeat(3)}
No new licenses${space.repeat(9)}`
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
