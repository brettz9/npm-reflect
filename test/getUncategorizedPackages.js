import {expect} from 'chai';
import getUncategorizedPackages from '../lib/getUncategorizedPackages.js';

describe('`getUncategorizedPackages`', function () {
  it('Lists only packages whose licenseType is "uncategorized"', function () {
    /** @type {import('../lib/calculateImpactPackages.js').PartialPackages} */
    const packages = {
      'a@1.0.0': {
        name: 'a', version: '1.0.0', license: 'MIT', licenseType: 'permissive'
      },
      'weird@2.0.0': {
        name: 'weird', version: '2.0.0', license: 'SEE LICENSE IN LICENSE', licenseType: 'uncategorized'
      },
      'nolic@1.0.0': {
        name: 'nolic', version: '1.0.0', license: 'Unknown', licenseType: 'uncategorized'
      }
    };

    expect(getUncategorizedPackages(packages)).to.deep.equal([
      'weird@2.0.0 (SEE LICENSE IN LICENSE)',
      'nolic@1.0.0 (Missing)'
    ]);
  });

  it('Returns an empty array when none are uncategorized', function () {
    /** @type {import('../lib/calculateImpactPackages.js').PartialPackages} */
    const packages = {
      'a@1.0.0': {
        name: 'a', version: '1.0.0', license: 'MIT', licenseType: 'permissive'
      }
    };

    expect(getUncategorizedPackages(packages)).to.deep.equal([]);
  });
});
