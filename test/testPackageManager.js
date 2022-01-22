'use strict';

const {join} = require('path');

const {testYarn, testPnpm} = require('../lib/testPackageManager');

const cwd = process.cwd();

describe('testPackageManager', function () {
  afterEach(() => {
    process.chdir(cwd);
  });
  describe('`testYarn`', function () {
    it('Finds yarn accurately', async function () {
      process.chdir(join(__dirname, 'fixtures/yarn-path'));
      expect(await testYarn()).to.equal(true);
    });
    it('Reports false if yarn missing', async function () {
      process.chdir(join(__dirname, 'fixtures/pnpm-path'));
      expect(await testYarn()).to.equal(false);

      process.chdir(join(__dirname, 'fixtures/npm-path'));
      expect(await testYarn()).to.equal(false);
    });
  });
  describe('`testPnpm`', function () {
    it('Finds pnpm accurately', async function () {
      process.chdir(join(__dirname, 'fixtures/pnpm-path'));
      expect(await testPnpm()).to.equal(true);
    });
    it('Reports false if pnpm missing', async function () {
      process.chdir(join(__dirname, 'fixtures/yarn-path'));
      expect(await testPnpm()).to.equal(false);

      process.chdir(join(__dirname, 'fixtures/npm-path'));
      expect(await testPnpm()).to.equal(false);
    });
  });
});
