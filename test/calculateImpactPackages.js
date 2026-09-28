import {expect} from 'chai';

import calculateImpactPackages from '../lib/calculateImpactPackages.js';

import argparseFixture from './fixtures/argparseFixture.js';

import spdxCorrectFixture from './fixtures/spdxCorrectFixture.js';

const lodashPackage = argparseFixture['lodash@3.10.1'];

describe('`calculateImpactPackages`', function () {
  it('Returns new item', function () {
    const impact = calculateImpactPackages({
      ...spdxCorrectFixture,
      'lodash@3.10.1': lodashPackage
    }, spdxCorrectFixture);
    expect(impact).to.deep.equal({
      'lodash@3.10.1': lodashPackage
    });
  });

  it('Picks the highest version deterministically when a name has multiple versions', function () {
    // A real dependency tree can legitimately contain more than one version
    //   of the same package at once (e.g. this project itself now depends
    //   on `spdx-expression-parse@^5.0.0` directly while `spdx-correct`
    //   depends on `spdx-expression-parse@^3.0.0` transitively). Which of
    //   those versions previously got treated as "the one we have" depended
    //   on `walkDependencies`' network-resolution order - a race - so a
    //   `newPackages` entry needing the lower version could inconsistently
    //   be excluded as "not new" or not, depending on run-to-run timing.
    //   Regardless of the (arbitrary) object key order below, the higher
    //   version should always be the one treated as already present.
    const newLowerVersion = {
      name: 'spdx-expression-parse', version: '3.0.1', dependencies: {}
    };
    const currentHigherVersion = {
      name: 'spdx-expression-parse', version: '5.0.0', dependencies: {}
    };

    const currentPackagesInOneOrder = {
      'spdx-expression-parse@5.0.0': currentHigherVersion,
      'spdx-expression-parse@1.0.0': {
        name: 'spdx-expression-parse', version: '1.0.0', dependencies: {}
      }
    };
    // Same entries, reversed insertion order - a stand-in for the two
    //   versions resolving in the opposite order over the network.
    const currentPackagesInTheOtherOrder = {
      'spdx-expression-parse@1.0.0': currentPackagesInOneOrder['spdx-expression-parse@1.0.0'],
      'spdx-expression-parse@5.0.0': currentHigherVersion
    };

    const expected = {
      'spdx-expression-parse@3.0.1': newLowerVersion
    };
    expect(calculateImpactPackages({
      'spdx-expression-parse@3.0.1': newLowerVersion
    }, currentPackagesInOneOrder)).to.deep.equal(expected);
    expect(calculateImpactPackages({
      'spdx-expression-parse@3.0.1': newLowerVersion
    }, currentPackagesInTheOtherOrder)).to.deep.equal(expected);
  });

  it('Avoids dupe', function () {
    const impact = calculateImpactPackages({
      ...spdxCorrectFixture,
      'lodash@3.10.1': lodashPackage
    }, {
      ...spdxCorrectFixture,
      'spdx-exceptions@1.0.0': {
        name: 'spdx-exceptions'
      }
    });
    expect(impact).to.deep.equal({
      'lodash@3.10.1': lodashPackage
    });
  });
});
