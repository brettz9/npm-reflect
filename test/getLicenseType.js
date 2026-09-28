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

  it('Gets "useOrModifyProtective" for a license flagged with both use and modify restrictions', function () {
    // `license-types` sets both `useProtective` and `modifyProtective` on
    //   licenses like this (e.g. Creative Commons NoDerivatives licenses);
    //   picking the object's first key used to return the raw
    //   `useProtective` flag name, which isn't one of the categories
    //   `formatLicenseType` knows how to render and crashes it.
    expect(getLicenseType('CC-BY-NC-ND-2.5')).to.equal('useOrModifyProtective');
  });

  it('Gets "useOrModifyProtective" for a license combining "protective" with a use restriction', function () {
    // e.g. Creative Commons ShareAlike NonCommercial licenses are flagged
    //   `protective` and `useProtective` together; the more restrictive
    //   flag should win.
    expect(getLicenseType('CC-BY-NC-SA-2.0')).to.equal('useOrModifyProtective');
  });

  it('Gets license type (networkProtective)', function () {
    expect(getLicenseType('AGPL-3.0')).to.equal('networkProtective');
  });
});
