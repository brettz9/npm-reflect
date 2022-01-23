'use strict';

const {join} = require('path');
const getImpact = require('../lib/getImpact');

const {
  'lodash@3.10.1': lodashPackage
} = require('./fixtures/argparse.js');

const spdxCorrectFixture = require('./fixtures/spdx-correct.js');

const cwd = process.cwd();

describe('`getImpact`', function () {
  this.timeout(50000);
  afterEach(() => {
    process.chdir(cwd);
  });
  it('Returns info table', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));

    const impact = await getImpact({}, spdxCorrectFixture);
    const brightBlackFG = '\u001B[90m';
    const defaultFG = '\u001B[39m';
    const space = '\u0020';

    expect(impact).to.equal(
`Packages${space.repeat(1)}${brightBlackFG} ${defaultFG}4${space.repeat(10)}${brightBlackFG} ${defaultFG}+400.00%${space}
Size${space.repeat(5)}${brightBlackFG} ${defaultFG}0 B${space.repeat(8)}${brightBlackFG} ${defaultFG}+NaN%${space.repeat(4)}
Licenses${space}${brightBlackFG}${space}${defaultFG}Apache-2.0${space}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}
${space.repeat(9)}${brightBlackFG} ${defaultFG}CC-BY-3.0${space.repeat(2)}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}
${space.repeat(9)}${brightBlackFG} ${defaultFG}CC0-1.0${space.repeat(4)}${brightBlackFG}${space}${defaultFG}1${space.repeat(8)}`
    );
  });
});
