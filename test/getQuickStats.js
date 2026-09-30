import {expect} from 'chai';

import getQuickStats from '../lib/getQuickStats.js';
import {brightBlackFG, defaultFG, greenFG, space} from './utils/ansi.js';

import argparseFixture from './fixtures/argparseFixture.js';
import spdxCorrectFixture from './fixtures/spdxCorrectFixture.js';

describe('`getQuickStats`', function () {
  it('Gets stats as string', function () {
    this.timeout(30000);
    expect(getQuickStats(argparseFixture)).to.equal(
      `Packages ${brightBlackFG} ${defaultFG}3          ${brightBlackFG} ${defaultFG}${space.repeat(2)}
Size     ${brightBlackFG} ${defaultFG}214.87 kB${space.repeat(2)}${brightBlackFG} ${defaultFG}${space.repeat(2)}
Licenses ${brightBlackFG} ${defaultFG}${greenFG}Permissive${defaultFG} ${brightBlackFG} ${defaultFG}3${space}`
    );
  });

  it('Gets stats as string (multiple license types)', function () {
    this.timeout(30000);
    expect(getQuickStats(spdxCorrectFixture)).to.equal(
      `Packages ${brightBlackFG} ${defaultFG}4             ${brightBlackFG} ${defaultFG}${space.repeat(2)}
Size     ${brightBlackFG} ${defaultFG}18.08 kB${space.repeat(6)}${brightBlackFG} ${defaultFG}${space.repeat(2)}
Licenses ${brightBlackFG} ${defaultFG}${greenFG}Permissive${defaultFG}    ${brightBlackFG} ${defaultFG}3${space}
         ${brightBlackFG} ${defaultFG}${greenFG}Public Domain${defaultFG} ${brightBlackFG} ${defaultFG}1${space}`
    );
  });

  it('Lists the specific packages with an uncategorized license', function () {
    /** @type {import('../lib/calculateImpactPackages.js').PartialPackages} */
    const packages = {
      'a@1.0.0': {
        name: 'a', version: '1.0.0', license: 'MIT', licenseType: 'permissive', size: 100
      },
      'weird@2.0.0': {
        name: 'weird', version: '2.0.0', license: 'SEE LICENSE IN LICENSE', licenseType: 'uncategorized', size: 50
      },
      'nolic@1.0.0': {
        name: 'nolic', version: '1.0.0', license: 'Unknown', licenseType: 'uncategorized', size: 10
      }
    };

    expect(getQuickStats(packages)).to.equal(
      `Packages${space.repeat(12)}${brightBlackFG} ${defaultFG}3${space.repeat(24)}${brightBlackFG} ${defaultFG}${space.repeat(13)}
Size${space.repeat(16)}${brightBlackFG} ${defaultFG}160 B${space.repeat(20)}${brightBlackFG} ${defaultFG}${space.repeat(13)}
Licenses${space.repeat(12)}${brightBlackFG} ${defaultFG}${greenFG}Permissive${defaultFG}${space.repeat(15)}${brightBlackFG} ${defaultFG}1${space.repeat(12)}
${space.repeat(20)}${brightBlackFG} ${defaultFG}${brightBlackFG}Uncategorized${defaultFG}${space.repeat(12)}${brightBlackFG} ${defaultFG}2${space.repeat(12)}
Uncategorized packages:${space.repeat(37)}
weird@2.0.0 (SEE LICENSE IN LICENSE), nolic@1.0.0 (Missing)${space}`
    );
  });
});
