import getDetails from '../../lib/getDetails.js';
import spdxCorrectFixture from '../fixtures/spdxCorrectFixture.js';

const spdxLicenseIdsKey = Object.keys(spdxCorrectFixture).find((key) => {
  return spdxCorrectFixture[key].name === 'spdx-license-ids';
});
const spdxExceptionsKey = Object.keys(spdxCorrectFixture).find((key) => {
  return spdxCorrectFixture[key].name === 'spdx-exceptions';
});

// `walkDependencies` resolves dependencies concurrently, so the resulting
//   `packages` object can come back in either order below depending on
//   timing; building expected output from `getDetails` (the same formatter
//   used in production) keeps this in sync with real fixture data instead
//   of hand-maintained table strings.
const spdxCorrectResults1 = getDetails({
  'spdx-correct@3.1.1': spdxCorrectFixture['spdx-correct@3.1.1'],
  'spdx-expression-parse@3.0.1': spdxCorrectFixture['spdx-expression-parse@3.0.1'],
  [spdxLicenseIdsKey]: spdxCorrectFixture[spdxLicenseIdsKey],
  [spdxExceptionsKey]: spdxCorrectFixture[spdxExceptionsKey]
});

const spdxCorrectResults2 = getDetails({
  'spdx-correct@3.1.1': spdxCorrectFixture['spdx-correct@3.1.1'],
  [spdxLicenseIdsKey]: spdxCorrectFixture[spdxLicenseIdsKey],
  'spdx-expression-parse@3.0.1': spdxCorrectFixture['spdx-expression-parse@3.0.1'],
  [spdxExceptionsKey]: spdxCorrectFixture[spdxExceptionsKey]
});

export {spdxCorrectResults1, spdxCorrectResults2};
