import getLocalPackage from '../lib/getLocalPackage.js';

describe('`getLocalPackage`', function () {
  it('Gets local package', async function () {
    const localPackage = await getLocalPackage();
    expect(localPackage.name).to.equal('npm-reflect');
    expect(localPackage.devDependencies).to.be.an('object');
  });
});
