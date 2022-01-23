import getQuickStats from '../lib/getQuickStats.js';

import argparseFixture from './fixtures/argparseFixture.js';
import spdxCorrectFixture from './fixtures/spdxCorrectFixture.js';

describe('`getQuickStats`', function () {
  it('Gets stats as string', function () {
    this.timeout(30000);
    expect(getQuickStats(argparseFixture)).to.equal(
      'Packages \u001B[90m \u001B[39m3          \u001B[90m \u001B[39m  \n' +
      'Size     \u001B[90m \u001B[39m0 B        \u001B[90m \u001B[39m  \n' +
      'Licenses \u001B[90m \u001B[39m\u001B[32mPermissive\u001B[39m \u001B[90m \u001B[39m3 '
    );
  });

  it('Gets stats as string (multiple license types)', function () {
    this.timeout(30000);
    expect(getQuickStats(spdxCorrectFixture)).to.equal(
      'Packages \u001B[90m \u001B[39m4             \u001B[90m \u001B[39m  \n' +
      'Size     \u001B[90m \u001B[39m0 B           \u001B[90m \u001B[39m  \n' +
      'Licenses \u001B[90m \u001B[39m\u001B[32mPermissive\u001B[39m    \u001B[90m \u001B[39m3 \n' +
      '         \u001B[90m \u001B[39m\u001B[32mPublic Domain\u001B[39m \u001B[90m \u001B[39m1 '
    );
  });
});
