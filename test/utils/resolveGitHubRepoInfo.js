// eslint-disable-next-line no-shadow -- Convenient
import fetch from 'node-fetch';

/**
 * Fetches a GitHub repo's current size and last-modified timestamp,
 * mirroring `getSizeAndLicenseFromGitHub` in `lib/getPackageDetails.js`, so
 * expectations stay valid as the repo's size and push history change.
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<{size: number, modified: string}>}
 */
export default async function resolveGitHubRepoInfo (owner, repo) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
  const {size: sizeKb, updated_at: modified} = await res.json();
  return {size: sizeKb * 1024, modified};
}
