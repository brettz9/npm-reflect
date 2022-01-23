/* eslint-disable no-console -- This is just a CLI-only utility */
/**
 * Cleans a line and outputs the error.
 */

import readline from 'readline';
import colors from 'colors/safe.js';

/**
 * @param {string} str
 */
export default function printError (str) {
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 1);

  console.error(colors.red(str));
}
