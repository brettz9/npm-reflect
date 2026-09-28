import getDetails from '../../lib/getDetails.js';
import spdxCorrectFixture from '../fixtures/spdxCorrectFixture.js';

// `getDetails` sorts its output by package name, so the expected table is
//   deterministic regardless of the order `walkDependencies` resolves
//   dependencies in (a network race); building it from the live fixture
//   data keeps this in sync instead of a hand-maintained table string.
const spdxCorrectResults = getDetails(spdxCorrectFixture);

export {spdxCorrectResults};
