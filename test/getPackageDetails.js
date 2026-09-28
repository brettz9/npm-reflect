import {expect} from 'chai';
import getPackageDetails, {CFG} from '../lib/getPackageDetails.js';
import jamilihFixture from './fixtures/jamilihFixture.js';
import resolveGitHubRepoInfo from './utils/resolveGitHubRepoInfo.js';
import {resolveOverallModified} from './utils/resolvePackageVersion.js';
// import {brightBlackFG, defaultFG, space} from './utils/ansi.js';

const {error: logError} = console;

const jamilih090 = {
  dependencies: {
    'array.from': '1.0.3',
    jsdom: '9.8.3',
    'object-assign': '4.1.0',
    xmldom: 'https://github.com/brettz9/xmldom'
  }
};

describe('`getPackageDetails`', function () {
  this.timeout(50000);
  beforeEach(() => {
    CFG.packageDetailsCache = {};
  });
  afterEach(() => {
    // eslint-disable-next-line no-console -- Spy
    console.error = logError;
    CFG.packageDetailsCache = {};
  });

  it('Throws on bad GitHub version', async function () {
    let val;
    // eslint-disable-next-line no-console -- Spy
    console.error = (obj) => {
      val = obj;
    };

    const details = await getPackageDetails('jamilih', 'https://github.com/brettz9');

    expect(details).to.be.null;
    expect(val).to.contain('Cannot parse github dependency url');
  });

  it('Gets latest modified time (and `versions` details) if supplied version is too high', async function () {
    const details = await getPackageDetails('jamilih', '1000');

    // A too-high version falls back to the registry document's overall
    //   `modified` timestamp, which is not the same as the latest version's
    //   own publish timestamp, and drifts whenever the registry document
    //   is touched (e.g. deprecation, new version) - resolved live here.
    const modified = await resolveOverallModified('jamilih');
    const jamilih = {
      ...Object.values(structuredClone(jamilihFixture))[0],
      modified,
      version: undefined,
      versionLoose: '1000'
    };

    expect(details).to.deep.equal(jamilih);
  });

  it('Gets "Unknown" license for npm package without license field', async function () {
    const details = await getPackageDetails('not-licensed', '1.0.0');

    const jamilih = {
      dependencies: {},
      license: 'Unknown',
      licenseType: 'uncategorized',
      name: 'not-licensed',
      size: null,

      // `modified` timestamp was created a few seconds after the latest version:
      //   https://registry.npmjs.org/jamilih
      modified: '2016-02-06T06:03:32.362Z',
      version: '1.0.0',
      versionLoose: '1.0.0'
    };

    expect(details).to.deep.equal(jamilih);
  });

  it('Gets details on latest version if supplied version is empty', async function () {
    const details = await getPackageDetails('jamilih', '');

    const jamilih = {
      ...Object.values(structuredClone(jamilihFixture))[0],
      versionLoose: ''
    };

    expect(details).to.deep.equal(jamilih);
  });

  it('Gets details with github protocol', async function () {
    const details = await getPackageDetails('jamilih', 'github:brettz9/jamilih#v0.10.0');

    // Todo: Incorrect size and modified date (would need to get into tag);
    //   resolved live since the repo's size and last push keep changing.
    const {size, modified} = await resolveGitHubRepoInfo('brettz9', 'jamilih');
    const jamilih = {
      ...Object.values(structuredClone(jamilihFixture))[0],
      ...jamilih090,
      version: '0.9.0',
      versionLoose: 'github:brettz9/jamilih#v0.10.0',
      size,
      modified
    };

    expect(details).to.deep.equal(jamilih);
  });

  it('Gets details with github protocol (unlicensed)', async function () {
    const details = await getPackageDetails('@brettz9/license-unlicensed', 'github:brettz9/license-unlicensed');

    // Todo: Incorrect size and modified date (would need to get into tag);
    //   resolved live since the repo's size and last push keep changing.
    const {size, modified} = await resolveGitHubRepoInfo('brettz9', 'license-unlicensed');
    const unlicensed = {
      dependencies: {},
      license: 'Unknown',
      licenseType: 'uncategorized',
      name: '@brettz9/license-unlicensed',
      version: '0.1.0',
      versionLoose: 'github:brettz9/license-unlicensed',
      size,
      modified
    };

    expect(details).to.deep.equal(unlicensed);
  });

  it('Gets details on GitHub package with hash', async function () {
    const details = await getPackageDetails('jamilih', 'https://github.com/brettz9/jamilih#v0.10.0');

    // Todo: Incorrect size and modified date (would need to get into tag);
    //   resolved live since the repo's size and last push keep changing.
    const {size, modified} = await resolveGitHubRepoInfo('brettz9', 'jamilih');
    const jamilih = {
      ...Object.values(structuredClone(jamilihFixture))[0],
      ...jamilih090,
      version: '0.9.0',
      versionLoose: 'https://github.com/brettz9/jamilih#v0.10.0',
      size,
      modified
    };

    expect(details).to.deep.equal(jamilih);
  });
});
