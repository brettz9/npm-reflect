/**
 * @file find root folder of local package
 */

'use strict';

const findPrefix = require('./findPrefix');

module.exports = function findPrefixPromise () {
  return new Promise((resolve, reject) => {
    findPrefix(process.cwd(), (err, res) => {
      // istanbul ignore if -- CWD should not err
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};
