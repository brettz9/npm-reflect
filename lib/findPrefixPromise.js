/**
 * @file Find root folder of local package.
 */

import findPrefix from './findPrefix.js';

/**
 *
 */
export default function findPrefixPromise () {
  return new Promise((resolve, reject) => {
    findPrefix(process.cwd(), (err, res) => {
      /* c8 ignore next 3 -- Ignore if - CWD should not err */
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
