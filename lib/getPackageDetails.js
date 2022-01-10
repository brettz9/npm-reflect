/**
 * @file fetches package details from registry
 */

'use strict';

const url = require('url');
const readline = require('readline');
const fetch = require('node-fetch');
const semver = require('semver');
const rc = require('rc');

const getLicenseStr = require('./getLicenseStr');
const getLicenseType = require('./getLicenseType');
const printError = require('./printError');

const packageDetailsCache = {};
const npmConfig = rc('npm', {
  registry: `https://registry.npmjs.org/`
});

/**
 * @param {Response} r
 * @throws {Error}
 * @returns {Promise<PlainObject>}
 */
async function checkResponse (r) {
  if (r.ok) {
    return await r.json();
  }
  throw new Error(`Response is not ok  ${r.status} ${r.statusText} ${r.url}`);
}

/**
 * Finds biggest matching version.
 * @param {string} versionLoose
 * @param {string[]} versions
 * @returns {string}
 */
function getVersion (versionLoose, versions) {
  let version;
  for (const version_ of versions) {
    let matchingVersion;
    if (semver.satisfies(version_, versionLoose)) {
      matchingVersion = version_;
    }
    if (matchingVersion) {
      if (!version || semver.gt(matchingVersion, version)) {
        version = matchingVersion;
      }
    }
  }
  return version;
}

const gitHubApiUrl = 'https://api.github.com/';

/**
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<{license: string, size: number, modified: string}>} details
 */
async function getSizeAndLicenseFromGitHub (owner, repo) {
  const repoInfoUrl = `${gitHubApiUrl}repos/${owner}/${repo}`;// I believe size of downloaded repo will not depend on ref
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 1);
  process.stdout.write(`GET ${repoInfoUrl}`);

  const {
    size: sizeKb,
    license: licenseObj,
    updated_at: modified
  } = await checkResponse(await fetch(repoInfoUrl));

  const size = sizeKb * 1024;
  const license = (licenseObj && licenseObj.spdx_id) || 'Unknown';
  return {size, license, modified};
}

/**
 * @see https://developer.github.com/v3/repos/contents/
 * @param {string} owner
 * @param {string} repo
 * @param {string} ref
 * @returns {PlainObject} dependencies, name, version
 */
async function getPackageJsonFromGitHub (owner, repo, ref) {
  const packageJsonUrl = `${gitHubApiUrl}repos/${owner}/${repo}/contents/package.json?ref=${ref}`;
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 1);
  process.stdout.write(`GET ${packageJsonUrl}`);
  const {download_url: downloadUrl} = await checkResponse(await fetch(packageJsonUrl));
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 1);
  process.stdout.write(`GET ${downloadUrl}`);

  let packageJson;
  try {
    packageJson = await checkResponse(await fetch(downloadUrl));
  } catch (e) {
    printError(`Cannot fetch package.json from GitHub for ${owner}/${repo}`);
    throw e;
  }

  const dependencies = packageJson.dependencies || {};
  const {name, version} = packageJson;
  return {dependencies, name, version};
}

/**
 * @param {{host: string, path: string, hash: string, protocol: string}} urlObj
 * @param {string} versionLoose
 * @throws {Error}
 * @returns {Promise<PlainObject>} details like dependencies, version, size, license, modified
 */
async function getPackageDetailsFromGitHub ({
  host, path, hash, protocol
}, versionLoose) {
  let owner;
  let repo;
  if (protocol === 'github:') {
    owner = host;
    repo = path.slice(1);
  } else {
    [owner, repo] = String(path).slice(1).replace(/\.git$/u, '').split('/');
  }
  if (!owner || !repo) {
    throw new Error(`Cannot parse github dependency url ${versionLoose}`);
  }
  let ref = 'master';
  if (hash && hash.slice(1)) {
    ref = hash.slice(1);
  }
  const detailsAr = await Promise.all([
    getSizeAndLicenseFromGitHub(owner, repo),
    getPackageJsonFromGitHub(owner, repo, ref)
  ]);
  return Object.assign({}, ...detailsAr);
}

/**
 * @param {string} name package name
 * @param {string} versionLoose version selector
 * @returns {Promise<PlainObject|null>}
 */
module.exports = async function getPackageDetails (
  name,
  versionLoose
) {
  // eslint-disable-next-line node/no-deprecated-api -- Not necessarily absolute
  const versionUrlObj = url.parse(versionLoose);
  if (versionUrlObj.protocol) {
    if (versionUrlObj.host === 'github.com' || versionUrlObj.protocol === 'github:') {
      // TODO: cache result
      let dependencies, version, size, license, modified;
      try {
        ({
          dependencies, version, size, license, modified
        } = await getPackageDetailsFromGitHub(versionUrlObj, versionLoose));
      } catch (e) {
        printError(e);
        return null;
      }
      return {
        name,
        modified,
        version,
        license,
        licenseType: getLicenseType(license),
        dependencies,
        versionLoose,
        size
      };
    }
    printError(`${
      versionUrlObj.protocol
    } is not supported by npm-reflect, skipping ${
      versionLoose
    }`);
    return null;
  }
  const key = `${name}@${versionLoose}`;
  const scope = name[0] === '@' ? name.slice(0, name.indexOf('/')) : undefined;
  let registryUrl = (scope && npmConfig[`${scope}:registry`]) || npmConfig.registry;
  if (registryUrl.charAt(registryUrl.length - 1) !== `/`) {
    registryUrl += `/`;
  }
  const infoUrl = `${registryUrl}${name.replace(`/`, `%2f`)}`;
  if (!packageDetailsCache[key]) {
    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 1);
    process.stdout.write(`GET ${infoUrl}`);
    packageDetailsCache[key] = (async () => {
      const packageInfo = await checkResponse(await fetch(infoUrl));
      let version;
      if (!versionLoose) {
        version = packageInfo[`dist-tags`].latest;
      } else if (packageInfo[`dist-tags`][versionLoose]) {
        version = packageInfo[`dist-tags`][versionLoose];
      } else if (packageInfo.versions[versionLoose]) {
        version = versionLoose;
      } else {
        version = getVersion(versionLoose, Object.keys(packageInfo.versions));
      }
      let versionDetails = packageInfo.versions[version];
      if (!versionDetails) {
        versionDetails = packageInfo.versions[packageInfo[`dist-tags`].latest];
      }
      let modified;
      if (packageInfo.time) {
        modified = packageInfo.time[version];
        if (!modified) {
          ({modified} = packageInfo.time);
        }
      }
      const r = await fetch(versionDetails.dist.tarball, {method: `HEAD`});
      const size = r.headers.get(`content-length`);
      const license = getLicenseStr(
        versionDetails.license || versionDetails.licenses || `Unknown`
      );
      const licenseType = getLicenseType(license);
      return {
        name,
        modified,
        version,
        license,
        licenseType,
        dependencies: versionDetails.dependencies || {},
        versionLoose,
        size
      };
    })();
  }
  return packageDetailsCache[key];
};
