'use strict';

const {basename, join} = require('path');

const findPrefix = require('../lib/findPrefix');

describe('`findPrefix`', function () {
  it('Does not err with bad directory', function (done) {
    findPrefix('bad-directory', (err) => {
      expect(err).to.equal(null);
      done();
    })
  });

  it('Returns root', function (done) {
    findPrefix('/', (err, path) => {
      expect(path).to.equal('/');
      done();
    })
  });

  it('Returns path', function (done) {
    findPrefix(join(__dirname, 'fixtures'), (err, path) => {
      expect(basename(path)).to.equal('npm-reflect');
      done();
    })
  });

  it('Walks up past `node_modules`', function (done) {
    findPrefix('/abc/node_modules', (err, path) => {
      expect(path).to.equal('/abc');
      done();
    })
  });

  it('Walks up two directories past `node_modules`', function (done) {
    findPrefix('/abc/node_modules/node_modules', (err, path) => {
      expect(path).to.equal('/abc');
      done();
    })
  });
});
