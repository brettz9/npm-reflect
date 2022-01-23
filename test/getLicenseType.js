import getLicenseType from '../lib/getLicenseType.js';

describe('`getLicenseType`', function () {
  it('Gets "uncategorized" if unrecognized', function () {
    expect(getLicenseType('blah')).to.equal('uncategorized');
  });

  it('Gets license type (UNLICENSED as uncategorized)', function () {
    expect(getLicenseType('UNLICENSED')).to.equal('uncategorized');
  });

  it('Gets license type (protective)', function () {
    expect(getLicenseType('GPL-3.0')).to.equal('protective');
  });

  it('Gets license type (permissive)', function () {
    expect(getLicenseType('MIT')).to.equal('permissive');
  });
});
