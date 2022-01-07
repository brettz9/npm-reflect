'use strict';

const getQuickStats = require('../lib/getQuickStats');

const argsParseFixture = require('./fixtures/argsParse.js');

describe('`getQuickStats`', function () {
  it('Gets stats as string', function () {
    this.timeout(30000);
    expect(getQuickStats(argsParseFixture)).to.equal(
      'Packages \u001B[90m \u001B[39m3          \u001B[90m \u001B[39m  \n' +
      'Size     \u001B[90m \u001B[39m0 B        \u001B[90m \u001B[39m  \n' +
      'Licenses \u001B[90m \u001B[39m\u001B[32mPermissive\u001B[39m \u001B[90m \u001B[39m3 '
    );
  });
});
