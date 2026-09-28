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

  it('Gets the more restrictive category for a compound AND expression', function () {
    // A compound `AND` expression (e.g. as declared by `spdx-ranges` and
    //   `spdx-expression-validate`) requires complying with every side at
    //   once, so it used to always fall through to "uncategorized": each
    //   `license-types` pattern is itself a single, simple license, and
    //   `spdx-satisfies` only considers an `AND` expression satisfied when
    //   every side is in the approved set at once. The more restrictive
    //   side should win regardless of which side (left or right) it's on.
    expect(getLicenseType('(GPL-2.0 AND MIT)')).to.equal('protective');
    expect(getLicenseType('(MIT AND GPL-2.0)')).to.equal('protective');
  });

  it('Gets "permissive" for a compound AND expression of two permissive licenses', function () {
    expect(getLicenseType('(MIT AND CC-BY-3.0)')).to.equal('permissive');
  });

  it('Stays "uncategorized" for a compound AND expression with an unrecognized side', function () {
    // Since `AND` requires complying with the unrecognized side too, its
    //   real restrictiveness can't be assumed.
    expect(getLicenseType('(AAL AND MIT)')).to.equal('uncategorized');
  });

  it('Falls back to the recognized side for a compound OR expression with an unrecognized side', function () {
    // `spdx-satisfies` already resolves an OR expression with at least one
    //   recognized simple license directly (e.g. `(AAL OR MIT)` matches the
    //   `MIT` pattern outright), so this combining logic is only reached
    //   when neither side alone matches a single known pattern - e.g. here,
    //   where one side is itself a compound `AND` expression. `OR` only
    //   requires complying with one side, so the recognized,
    //   compliable-with side determines the category, whichever side
    //   (left or right) that recognized side is on.
    expect(getLicenseType('(AAL OR (MIT AND CC-BY-3.0))')).to.equal('permissive');
    expect(getLicenseType('((MIT AND CC-BY-3.0) OR AAL)')).to.equal('permissive');
  });

  it('Gets the less restrictive category for a compound OR expression nested inside an AND', function () {
    // A flat OR of two recognized simple licenses is already resolved by
    //   `spdx-satisfies` itself in the loop above (it natively understands
    //   OR), so this combining logic's OR side is only reached when an OR
    //   is nested inside an unresolved AND, e.g. here. The less restrictive
    //   side of the OR should win regardless of which side it's on, and the
    //   more restrictive side of the enclosing AND should then win overall.
    expect(getLicenseType('((MIT OR CC-BY-3.0) AND GPL-2.0)')).to.equal('protective');
    expect(getLicenseType('((GPL-2.0 OR MIT) AND CC-BY-3.0)')).to.equal('permissive');
  });

  it('Gets "uncategorized" for an unparseable compound-looking expression', function () {
    expect(getLicenseType('(totally AND not a license)')).to.equal('uncategorized');
  });
});
