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
 * Resolves a version's tarball size the same way the code under test does:
 * a ranged `GET` of the tarball, reading the total size back out of
 * `content-range` (the registry's CDN omits `content-length` on `HEAD`
 * responses).
 * @param {string} tarballUrl
 * @returns {Promise<string|null>} size in bytes
 */
async function resolveTarballSizeFromUrl (tarballUrl) {
  const r = await fetch(tarballUrl, {headers: {Range: `bytes=0-0`}});
  const contentRange = r.headers.get(`content-range`);
  const total = contentRange && contentRange.split(`/`).at(-1);
  await r.arrayBuffer();
  return (total && total !== `*`) ? total : r.headers.get(`content-length`);
}

/**
 * Resolves a pinned version's tarball size, for fixtures with a hardcoded
 * (non-live) version.
 * @param {string} name
 * @param {string} version
 * @returns {Promise<string|null>} size in bytes
 */
export async function resolveTarballSize (name, version) {
  const {versions} = await fetchPackageInfo(name);
  return await resolveTarballSizeFromUrl(versions[version].dist.tarball);
}

/**
 * Resolves the highest published version of a package satisfying a semver
 * range, mirroring the resolution logic under test, so fixtures stay valid
 * as new versions are published upstream.
 * @param {string} name
 * @param {string} range
 * @returns {Promise<{name: string, version: string, modified: string, license: string, dependencies: object, size: string|null}>}
 */
export async function resolvePackageVersion (name, range) {
  const {time, versions} = await fetchPackageInfo(name);
  const version = Object.keys(versions).
    filter((v) => semver.satisfies(v, range)).
    toSorted(semver.compare).
    at(-1);
  const {license, dependencies = {}, dist} = versions[version];
  const size = await resolveTarballSizeFromUrl(dist.tarball);
  return {
    name, version, modified: time[version], license, dependencies, size
  };
}

/**
 * Resolves a package's `latest` dist-tag version, mirroring how the code
 * under test resolves an empty or over-high version selector, so fixtures
 * stay valid as new versions are published upstream.
 * @param {string} name
 * @returns {Promise<{name: string, version: string, modified: string, license: string, dependencies: object, size: string|null}>}
 */
export async function resolveLatestVersion (name) {
  const {time, versions, 'dist-tags': distTags} = await fetchPackageInfo(name);
  const version = distTags.latest;
  const {license, dependencies = {}, dist} = versions[version];
  const size = await resolveTarballSizeFromUrl(dist.tarball);
  return {
    name, version, modified: time[version], license, dependencies, size
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
