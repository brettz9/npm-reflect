import {expect} from 'chai';
import formatPackageLicense from '../lib/formatPackageLicense.js';

describe('`formatPackageLicense`', function () {
  it('Formats "(Missing)" for the "Unknown" fallback license', function () {
    expect(formatPackageLicense('not-licensed@1.0.0', 'Unknown')).to.equal(
      'not-licensed@1.0.0 (Missing)'
    );
  });

  it('Wraps a bare license identifier in parentheses', function () {
    expect(formatPackageLicense('memorystream@0.3.1', 'MIT')).to.equal(
      'memorystream@0.3.1 (MIT)'
    );
  });

  it('Does not double-wrap an already-parenthesized license expression', function () {
    expect(formatPackageLicense('type-fest@4.41.0', '(MIT OR CC0-1.0)')).to.equal(
      'type-fest@4.41.0 (MIT OR CC0-1.0)'
    );
  });
});
