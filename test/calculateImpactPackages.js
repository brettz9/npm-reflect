'use strict';

const calculateImpactPackages = require('../lib/calculateImpactPackages');

const {
  'lodash@3.10.1': lodashPackage
} = require('./fixtures/argparse.js');

const spdxCorrectFixture = require('./fixtures/spdx-correct.js');

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
