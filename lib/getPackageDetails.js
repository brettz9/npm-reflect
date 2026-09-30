/**
 * @file Fetches package details from registry.
 */

import url from 'node:url';
import readline from 'node:readline';
// eslint-disable-next-line no-shadow -- Convenient
import fetch from 'node-fetch';
import semver from 'semver';
import rc from 'rc';

import getLicenseStr from './getLicenseStr.js';
import getLicenseType from './getLicenseType.js';
import printError from './printError.js';

/**
 * @type {{
 *   packageDetailsCache: Record<string, Promise<{
 *     name: string,
 *     modified: string,
 *     version: string,
 *     license: string,
 *     licenseType: import('./formatLicenseType.js').LicenseType,
 *     dependencies: Record<string, string>,
 *     versionLoose: string,
 *     size: string
 *   }>>,
 *   npmConfig?: ReturnType<typeof rc>
 * }}
 */
export const CFG = {
  packageDetailsCache: {}
}; // Set lazily to allow unit testing to override

/**
 * @param {import('node-fetch').Response} r
 * @throws {Error}
 * @returns {Promise<unknown>}
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
  return /** @type {string} */ (version);
}

/**
 * Some registries/CDNs (e.g. npm's Cloudflare-fronted tarballs) omit
 * `content-length` on `HEAD` responses, so a ranged `GET` is used instead,
 * reading the total size back out of `content-range`.
 * @param {string} tarballUrl
 * @returns {Promise<string>} size in bytes
 */
async function getTarballSize (tarballUrl) {
  const r = await fetch(tarballUrl, {headers: {Range: `bytes=0-0`}});
  const contentRange = r.headers.get(`content-range`);
  const total = contentRange && contentRange.split(`/`).at(-1);
  await r.arrayBuffer();
  return (total && total !== `*`)
    ? total
    : /** @type {string} */ (r.headers.get(`content-length`));
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
  } =
    /**
     * @type {{
     *   size: number,
     *   license: {spdx_id: string},
     *   updated_at: string
     * }}
     */ (
      await checkResponse(await fetch(repoInfoUrl))
    );

  const size = sizeKb * 1024;
  const license = (licenseObj && licenseObj.spdx_id) || 'Unknown';
  return {size, license, modified};
}

/**
 * @see https://developer.github.com/v3/repos/contents/
 * @param {string} owner
 * @param {string} repo
 * @param {string} ref
 * @returns {Promise<{
 *   dependencies: Record<string, string>,
 *   name: string,
 *   version: string
 * }>}
 */
async function getPackageJsonFromGitHub (owner, repo, ref) {
  const packageJsonUrl = `${gitHubApiUrl}repos/${owner}/${repo}/contents/package.json?ref=${ref}`;
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 1);
  process.stdout.write(`GET ${packageJsonUrl}`);
  const {download_url: downloadUrl} =
    /**
     * @type {{
     *   download_url: string
     * }}
     */ (
      await checkResponse(await fetch(packageJsonUrl))
    );
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 1);
  process.stdout.write(`GET ${downloadUrl}`);

  let packageJson;
  try {
    packageJson =
      /**
       * @type {{
       *   dependencies: Record<string, string>,
       *   name: string,
       *   version: string
       * }}
       */
      (await checkResponse(await fetch(downloadUrl)));
  /* c8 ignore next 4 -- Not really feasible to spy here */
  } catch (e) {
    printError(`Cannot fetch package.json from GitHub for ${owner}/${repo}`);
    throw e;
  }

  const dependencies = packageJson.dependencies || {};
  const {name, version} = packageJson;
  return {dependencies, name, version};
}

/**
 * @param {{host: string|null, path: string|null, hash: string|null, protocol: string|null}} urlObj
 * @param {string} versionLoose
 * @throws {Error}
 * @returns {Promise<{
 *   dependencies: Record<string, string>,
 *   version: string,
 *   size: number,
 *   license: string,
 *   modified: string
 * }>}
 */
async function getPackageDetailsFromGitHub ({
  host, path, hash, protocol
}, versionLoose) {
  let owner;
  let repo;
  if (protocol === 'github:') {
    owner = host;
    repo = /** @type {string} */ (path).slice(1);
  } else {
    [owner, repo] = String(path).slice(1).replace(/\.git$/v, '').split('/', 2);
  }
  if (!owner || !repo) {
    throw new Error(`Cannot parse github dependency url ${versionLoose}`);
  }
  const ref = (hash && hash.slice(1)) || 'master';
  const detailsAr = await Promise.all([
    getSizeAndLicenseFromGitHub(owner, repo),
    getPackageJsonFromGitHub(owner, repo, ref)
  ]);
  return Object.assign({}, ...detailsAr);
}

const npmAliasRegex = /^npm:(?<name>@[^\/@]+\/[^@]+|[^@]+)@(?<versionLoose>.*)$/v;

/**
 * @typedef {{
 *   name: string,
 *   modified: string,
 *   version: string,
 *   license: string,
 *   licenseType: import('./formatLicenseType.js').LicenseType,
 *   dependencies: Record<string, string>,
 *   versionLoose: string,
 *   size: number|string
 * }} PackageDetails
 */

/**
 * @param {string} name package name
 * @param {string} versionLoose version selector
 * @returns {Promise<null|PackageDetails>}
 */
export default async function getPackageDetails (
  name,
  versionLoose
) {
  const npmAliasMatch = typeof versionLoose === 'string' &&
    versionLoose.match(npmAliasRegex);
  if (npmAliasMatch) {
    const {
      name: aliasedName, versionLoose: aliasedVersionLoose
    } =
      /**
       * @type {{
       *   [key: string]: string
       * }}
       */ (
        npmAliasMatch.groups
      );
    return await getPackageDetails(aliasedName, aliasedVersionLoose);
  }

  // eslint-disable-next-line n/no-deprecated-api -- Not necessarily absolute
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
        printError(String(e));
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

  if (!CFG.npmConfig) {
    CFG.npmConfig = rc('npm', {
      registry: `https://registry.npmjs.org/`
    });
  }

  let registryUrl = (scope && CFG.npmConfig[`${scope}:registry`]) || CFG.npmConfig.registry;
  if (registryUrl.at(-1) !== `/`) {
    registryUrl += `/`;
  }
  const infoUrl = `${registryUrl}${name.replace(`/`, `%2f`)}`;
  if (!Object.hasOwn(CFG.packageDetailsCache, key)) {
    readline.cursorTo(process.stdout, 0);
    readline.clearLine(process.stdout, 1);
    process.stdout.write(`GET ${infoUrl}`);
    CFG.packageDetailsCache[key] = (async () => {
      const packageInfo =
        /**
         * @type {{
         *   "dist-tags": {[key: string]: string},
         *   versions: {[key: string]: {
         *     license?: string,
         *     licenses?: string,
         *     dependencies?: Record<string, string>,
         *     dist: {tarball: string}
         *   }},
         *   time: {[key: string]: string}
         * }}
         */
        (await checkResponse(await fetch(infoUrl)));
      let version;
      if (!versionLoose) {
        version = packageInfo[`dist-tags`].latest;
      } else if (Object.hasOwn(packageInfo[`dist-tags`], versionLoose)) {
        version = packageInfo[`dist-tags`][versionLoose];
      } else if (Object.hasOwn(packageInfo.versions, versionLoose)) {
        version = versionLoose;
      } else {
        version = getVersion(versionLoose, Object.keys(packageInfo.versions));
      }
      let versionDetails = packageInfo.versions[version];
      if (!versionDetails) {
        versionDetails = packageInfo.versions[packageInfo[`dist-tags`].latest];
      }

      /** @type {string} */
      let modified = '';
      if (packageInfo.time) {
        modified = packageInfo.time[version];
        if (!modified) {
          ({modified} = packageInfo.time);
        }
      }
      const size = await getTarballSize(versionDetails.dist.tarball);
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
  return CFG.packageDetailsCache[key];
}
