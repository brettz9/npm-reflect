'use strict';

const walkDependencies = require('../lib/walkDependencies');

const argsParseFixture = require('./fixtures/argsParse.js');

describe('`walkDependencies`', function () {
  it('Walks dependencies', async function () {
    this.timeout(30000);
    expect(await walkDependencies({argparse: '1.0.0'})).to.deep.equal(argsParseFixture);
  });

  /*
  it.only('Walks dependencies', async function () {
    this.timeout(30000);
    expect(await walkDependencies({'a@bad@package': '1.0.0'})).to.deep.equal({
    });
  });
  */
});
