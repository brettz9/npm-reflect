// eslint-disable-next-line no-shadow -- Convenient
import fetch from 'node-fetch';
import semver from 'semver';

/**
 * Fetches a package's registry metadata once.
 * @param {string} name
 * @returns {Promise<{time: object, versions: object, 'dist-tags': object}>}
 */
async function fetchPackageInfo (name) {
  const res = await fetch(`https://registry.npmjs.org/${name}`);
  return res.json();
}

/**
 * Resolves the highest published version of a package satisfying a semver
 * range, mirroring the resolution logic under test, so fixtures stay valid
 * as new versions are published upstream.
 * @param {string} name
 * @param {string} range
 * @returns {Promise<{name: string, version: string, modified: string, license: string, dependencies: object}>}
 */
export async function resolvePackageVersion (name, range) {
  const {time, versions} = await fetchPackageInfo(name);
  const version = Object.keys(versions).
    filter((v) => semver.satisfies(v, range)).
    toSorted(semver.compare).
    at(-1);
  const {license, dependencies = {}} = versions[version];
  return {
    name, version, modified: time[version], license, dependencies
  };
}

/**
 * Resolves a package's `latest` dist-tag version, mirroring how the code
 * under test resolves an empty or over-high version selector, so fixtures
 * stay valid as new versions are published upstream.
 * @param {string} name
 * @returns {Promise<{name: string, version: string, modified: string, license: string, dependencies: object}>}
 */
export async function resolveLatestVersion (name) {
  const {time, versions, 'dist-tags': distTags} = await fetchPackageInfo(name);
  const version = distTags.latest;
  const {license, dependencies = {}} = versions[version];
  return {
    name, version, modified: time[version], license, dependencies
  };
}

/**
 * Resolves a package's overall registry-document `modified` timestamp
 * (`time.modified`), which is what the code under test falls back to when
 * a requested version selector matches nothing (e.g. a too-high version).
 * This is not the same as the latest version's own publish timestamp.
 * @param {string} name
 * @returns {Promise<string>}
 */
export async function resolveOverallModified (name) {
  const {time} = await fetchPackageInfo(name);
  return time.modified;
}
