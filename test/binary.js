'use strict';

const {promisify} = require('util');
const {execFile: ef} = require('child_process');

const execFile = promisify(ef);
const binFile = './bin/index.js';

describe('Binary', function () {
  this.timeout(8000);
  it('should log help', async function () {
    const {stdout} = await execFile(binFile, ['-h']);
    expect(stdout).to.contain(
      'Check npm package dependencies'
    );
  });

  it('should log help (no args)', async function () {
    const {stdout} = await execFile(binFile);
    expect(stdout).to.contain(
      'Check npm package dependencies'
    );
  });
});
