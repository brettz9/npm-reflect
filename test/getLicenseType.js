import {expect} from 'chai';
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

  it('Gets a real license type (not "uncategorized") for a compound OR expression', function () {
    // `spdx-satisfies` needs its approved-licenses argument to be an array;
    //   a compound expression like this used to always fall through to
    //   "uncategorized" because that argument was passed as a bare string.
    expect(getLicenseType('(MIT OR CC0-1.0)')).to.equal('publicDomain');
  });
});
