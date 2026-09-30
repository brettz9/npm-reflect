// eslint-disable-next-line no-shadow -- Convenient
import fetch from 'node-fetch';

// GitHub's unauthenticated API is rate-limited to 60 requests/hour, and
//   several tests ask about the same repo, so results are cached per
//   `owner/repo` for the life of the test run instead of refetched.

/**
 * @type {Record<string, Promise<{size: number, modified: string}>>}
 */
const cache = {};

/**
 * Fetches a GitHub repo's current size and last-modified timestamp,
 * mirroring `getSizeAndLicenseFromGitHub` in `lib/getPackageDetails.js`, so
 * expectations stay valid as the repo's size and push history change.
 * @param {string} owner
 * @param {string} repo
 * @returns {Promise<{size: number, modified: string}>}
 */
export default function resolveGitHubRepoInfo (owner, repo) {
  const key = `${owner}/${repo}`;
  cache[key] ||= (async () => {
    const res = await fetch(`https://api.github.com/repos/${key}`);
    const {size: sizeKb, updated_at: modified} =
      /**
       * @type {{size: number, updated_at: string}}
       */
      (await res.json());
    return {size: sizeKb * 1024, modified};
  })();
  return cache[key];
}
