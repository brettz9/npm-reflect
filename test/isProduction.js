import isProduction from '../lib/isProduction.js';

describe('`isProduction`', function () {
  it('Checks if is production (false)', async function () {
    const isProd = await isProduction({});
    expect(isProd).to.equal(false);
  });

  it('Checks if is production', async function () {
    const isProd = await isProduction({production: true});
    expect(isProd).to.equal(true);
  });
});
