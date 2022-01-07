'use strict';

const getQuickStats = require('../lib/getQuickStats');

const argsParseFixture = require('./fixtures/argsParse.js');

describe('`getQuickStats`', function () {
  it('Gets stats as string', async function () {
    this.timeout(30000);
    expect(getQuickStats(argsParseFixture)).to.equal(
      'Packages \u001b[90m \u001b[39m3          \u001b[90m \u001b[39m  \n' +
      'Size     \u001b[90m \u001b[39m0 B        \u001b[90m \u001b[39m  \n' +
      'Licenses \u001b[90m \u001b[39m\u001b[32mPermissive\u001b[39m \u001b[90m \u001b[39m3 '
    );
  });
});
