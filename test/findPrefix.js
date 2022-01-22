'use strict';

const pth = require('path');
const findPrefix = require('../lib/findPrefix');

const {basename, join, resolve} = pth;

describe('`findPrefix`', function () {
  it('Does not err with bad directory', function (done) {
    findPrefix('bad-directory', (err) => {
      expect(err).to.equal(null);
      done();
    });
  });

  it('Returns root', function (done) {
    findPrefix('/', (err, path) => {
      if (err) {
        done(err);
        return;
      }
      expect(path).to.equal('/');
      done();
    });
  });

  it('Returns path', function (done) {
    findPrefix(join(__dirname, 'fixtures'), (err, path) => {
      if (err) {
        done(err);
        return;
      }
      expect(basename(path)).to.equal('npm-reflect');
      done();
    });
  });

  it('Returns Windows path', function (done) {
    const {platform} = process;
    Object.defineProperty(process, 'platform', {value: 'win32'});
    pth.resolve = (p) => p;

    findPrefix('C:\\', (err, path) => {
      if (err) {
        Object.defineProperty(process, 'platform', {value: platform});
        pth.resolve = resolve;
        done(err);
        return;
      }
      expect(basename(path)).to.equal('C:\\');
      Object.defineProperty(process, 'platform', {value: platform});
      pth.resolve = resolve;
      done();
    });
  });

  it('Walks up past `node_modules`', function (done) {
    findPrefix('/abc/node_modules', (err, path) => {
      if (err) {
        done(err);
        return;
      }
      expect(path).to.equal('/abc');
      done();
    });
  });

  it('Walks up two directories past `node_modules`', function (done) {
    findPrefix('/abc/node_modules/node_modules', (err, path) => {
      if (err) {
        done(err);
        return;
      }
      expect(path).to.equal('/abc');
      done();
    });
  });
});
