import {expect} from 'chai';
import getDetails from '../lib/getDetails.js';

import spdxCorrectFixture from './fixtures/spdxCorrectFixture.js';
import {spdxCorrectResults} from './results/spdxCorrectResults.js';

describe('`getDetails`', function () {
  it('Returns new item', function () {
    const details = getDetails(spdxCorrectFixture);
    expect(details).to.equal(spdxCorrectResults);
  });

  it('Handles undefined dependencies and size', function () {
    const details = getDetails({
      'test-pkg@1.0.0': {
        name: 'test-pkg',
        version: '1.0.0',
        modified: '2020-05-22T15:38:26.796Z',
        license: 'MIT',
        licenseType: 'permissive'
      }
    });
    expect(typeof details).to.equal('string');
    expect(details).to.include('0 B');
  });
});
