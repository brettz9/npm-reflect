import {resolvePackageVersion, resolveTarballSize} from '../utils/resolvePackageVersion.js';

// `spdx-license-ids` and `spdx-exceptions` are resolved live (rather than
//   pinned to a specific patch version) because the code under test always
//   installs the latest version matching the semver range declared by their
//   dependents, and that latest version changes over time as new patches
//   are published.
const [spdxLicenseIds, spdxExceptions, spdxCorrectSize, spdxExpressionParseSize] = await Promise.all([
  resolvePackageVersion('spdx-license-ids', '^3.0.0'),
  resolvePackageVersion('spdx-exceptions', '^2.1.0'),
  resolveTarballSize('spdx-correct', '3.1.1'),
  resolveTarballSize('spdx-expression-parse', '3.0.1')
]);

/** @type {import('../../lib/getDetails.js').Packages} */
const spdxCorrectFixture = {
  'spdx-correct@3.1.1': {
    dependencies: {
      'spdx-expression-parse': '^3.0.0',
      'spdx-license-ids': '^3.0.0'
    },
    license: 'Apache-2.0',
    licenseType: /** @type {const} */ ('permissive'),
    modified: '2020-05-22T15:38:26.796Z',
    name: 'spdx-correct',
    size: /** @type {string} */ (spdxCorrectSize),
    version: '3.1.1',
    versionLoose: '3.1.1'
  },
  'spdx-expression-parse@3.0.1': {
    dependencies: {
      'spdx-exceptions': '^2.1.0',
      'spdx-license-ids': '^3.0.0'
    },
    license: 'MIT',
    licenseType: /** @type {const} */ ('permissive'),
    modified: '2020-05-13T16:12:46.317Z',
    name: 'spdx-expression-parse',
    size: /** @type {string} */ (spdxExpressionParseSize),
    version: '3.0.1',
    versionLoose: '^3.0.0'
  },
  [`spdx-license-ids@${spdxLicenseIds.version}`]: {
    dependencies: {},
    license: spdxLicenseIds.license,
    licenseType: /** @type {const} */ ('publicDomain'),
    modified: spdxLicenseIds.modified,
    name: 'spdx-license-ids',
    size: /** @type {string} */ (spdxLicenseIds.size),
    version: spdxLicenseIds.version,
    versionLoose: '^3.0.0'
  },
  [`spdx-exceptions@${spdxExceptions.version}`]: {
    dependencies: {},
    license: spdxExceptions.license,
    licenseType: /** @type {const} */ ('permissive'),
    modified: spdxExceptions.modified,
    name: 'spdx-exceptions',
    size: /** @type {string} */ (spdxExceptions.size),
    version: spdxExceptions.version,
    versionLoose: '^2.1.0'
  }
};

export default spdxCorrectFixture;
