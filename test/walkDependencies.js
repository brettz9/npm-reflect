'use strict';

const walkDependencies = require('../lib/walkDependencies');

const argparseFixture = require('./fixtures/argparse.js');

describe('`walkDependencies`', function () {
  it('Walks dependencies', async function () {
    this.timeout(30000);
    expect(await walkDependencies({argparse: '1.0.0'})).to.deep.equal(argparseFixture);
  });

  /*
  it.only('', async function () {
    this.timeout(50000);
    expect(await walkDependencies({'spdx-correct': '3.1.1'})).to.deep.equal({});
  });
  */

  /*
  it.only('Walks dependencies', async function () {
    this.timeout(30000);
    expect(await walkDependencies({'a@bad@package': '1.0.0'})).to.deep.equal({
    });
  });
  */
});
