/**
 * @file find root folder of local package
 */

import findPrefix from './findPrefix.js';

/**
 *
 */
export default function findPrefixPromise () {
  return new Promise((resolve, reject) => {
    findPrefix(process.cwd(), (err, res) => {
      // Ignore if - CWD should not err
      /* c8 ignore next 3 */
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}
