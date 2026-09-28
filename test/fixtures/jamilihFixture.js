import {resolveLatestVersion} from '../utils/resolvePackageVersion.js';
import getLicenseType from '../../lib/getLicenseType.js';

// Resolved live (rather than pinned to a specific version) because the code
//   under test always installs whatever npm currently reports as `latest`,
//   and that changes over time as new versions are published.
const jamilih = await resolveLatestVersion('jamilih');

const jamilihFixture = {
  'jamilih@0.54.0': {
    name: 'jamilih',
    modified: jamilih.modified,
    version: jamilih.version,
    license: jamilih.license,
    licenseType: getLicenseType(jamilih.license),
    dependencies: jamilih.dependencies,
    versionLoose: '^0.63.1',
    size: jamilih.size
  }
};

export default jamilihFixture;
