/**
 * @file Get local package.json.
 */

import fs from 'node:fs';
import path from 'node:path';

import findPrefixPromise from './findPrefixPromise.js';

/**
 * @returns {Promise<{
 *   name: string,
 *   version: string,
 *   dependencies: Record<string, string>,
 *   devDependencies: Record<string, string>,
 *   config: import('./install.js').TestConfig
 * }>} package.json
 */
export default async function getLocalPackage () {
  const packagePath = await findPrefixPromise();
  return JSON.parse(
    fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8')
  );
}
