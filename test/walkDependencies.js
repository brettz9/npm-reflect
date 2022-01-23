import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

import walkDependencies from '../lib/walkDependencies.js';

import argparseFixture from './fixtures/argparseFixture.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cwd = process.cwd();

describe('`walkDependencies`', function () {
  it('Walks dependencies', async function () {
    this.timeout(30000);
    expect(await walkDependencies({argparse: '1.0.0'})).to.deep.equal(argparseFixture);
  });

  it('Walks past unrecognized host', async function () {
    expect(await walkDependencies({
      jamilih: 'https://unrecognized.example.com/jamilih'
    })).to.deep.equal({});
  });

  it('Walks past 404 GitHub URL', async function () {
    expect(await walkDependencies({
      jamilih: 'https://github.com/brettz9/nonexistent'
    })).to.deep.equal({});
  });

  // This doesn't work with other tests
  describe.skip('Custom npmrc', function () {
    // Todo: Override process.exit
    this.timeout(30000);
    afterEach(() => {
      process.chdir(cwd);
    });
    it('Exits with bad registry', function (done) {
      process.chdir(join(__dirname, 'fixtures/bad-npmrc'));

      const exit = Object.getOwnPropertyDescriptor(process, 'exit');

      Object.defineProperty(process, 'exit', {value (val) {
        Object.defineProperty(process, 'exit', {value: exit});

        expect(val).to.equal(1);
        done();
      }});

      walkDependencies({argparse: '1.0.0'});
    });
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
