import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

import getInstallCommand from '../lib/getInstallCommand.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cwd = process.cwd();

describe('`getInstallCommand`', function () {
  afterEach(() => {
    process.chdir(cwd);
  });
  it('Gets npm command', async function () {
    process.chdir(join(__dirname, 'fixtures/npm-path'));
    const {command} = await getInstallCommand(null, {});
    expect(command).to.equal('npm');
  });

  it('Gets pnpm command', async function () {
    process.chdir(join(__dirname, 'fixtures/pnpm-path'));
    const {command} = await getInstallCommand(null, {});
    expect(command).to.equal('pnpm');
  });

  it('Gets yarn command and args', async function () {
    process.chdir(join(__dirname, 'fixtures/yarn-path'));
    const {command, args} = await getInstallCommand(null, {});
    expect(command).to.equal('yarn');

    expect(args).to.deep.equal(['install']);
  });

  it('Gets yarn command and args (with production)', async function () {
    process.chdir(join(__dirname, 'fixtures/yarn-path'));
    const {command, args} = await getInstallCommand(null, {
      production: true
    });
    expect(command).to.equal('yarn');

    expect(args).to.deep.equal(['install', '--production']);
  });

  it('Gets yarn command and args (with nameVersion)', async function () {
    process.chdir(join(__dirname, 'fixtures/yarn-path'));
    const {command, args} = await getInstallCommand('jamilih@0.54.0', {});
    expect(command).to.equal('yarn');

    expect(args).to.deep.equal(['add', 'jamilih@0.54.0']);
  });

  it('Gets yarn command and args (with nameVersion and saveDev)', async function () {
    process.chdir(join(__dirname, 'fixtures/yarn-path'));
    const {command, args} = await getInstallCommand('jamilih@0.54.0', {
      saveDev: true
    });
    expect(command).to.equal('yarn');

    expect(args).to.deep.equal(['add', 'jamilih@0.54.0', '--dev']);
  });
});
