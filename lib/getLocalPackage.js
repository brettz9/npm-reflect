/**
 * @file get local package.json
 */

'use strict';

const fs = require('fs');
const path = require('path');
const findPrefixPromise = require('./findPrefixPromise');

/**
 * @returns {Promise<Object>} package.json
 */
module.exports = function getLocalPackage () {
  return findPrefixPromise().then((packagePath) => {
    return JSON.parse(
      fs.readFileSync(path.join(packagePath, 'package.json'))
    );
  });
};
