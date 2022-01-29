import getDetails from '../lib/getDetails.js';

import spdxCorrectFixture from './fixtures/spdxCorrectFixture.js';
import spdxCorrectResults from './results/spdxCorrectResults.js';

describe('`getDetails`', function () {
  it('Returns new item', function () {
    const details = getDetails(spdxCorrectFixture);
    expect(details).to.equal(spdxCorrectResults);
  });
});
