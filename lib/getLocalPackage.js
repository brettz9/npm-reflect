/**
 * @file get local package.json
 */

import fs from 'fs';
import path from 'path';

import findPrefixPromise from './findPrefixPromise.js';

/**
 * @returns {Promise<Object>} package.json
 */
export default async function getLocalPackage () {
  const packagePath = await findPrefixPromise();
  return JSON.parse(
    fs.readFileSync(path.join(packagePath, 'package.json'))
  );
}
