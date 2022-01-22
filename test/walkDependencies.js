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

  // This doesn't work when run with other tests
  it.skip('Exits upon walking bad package', function (done) {
    this.timeout(30000);

    const {exit} = process;
    Object.defineProperty(process, 'exit', {value (val) {
      expect(val).to.equal(1);
      Object.defineProperty(process, 'exit', {value: exit});
      done();
      // process.exit(0);
    }});

    // Cannot have async parent in Mocha so run in closure
    // (async () => { await
    walkDependencies({'a@bad@package': '1.0.0'});
    //   done(new Error('Failed'));
    // })();
  });
});
