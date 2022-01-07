/* eslint-disable no-console -- This is just a CLI-only utility */
/**
 * Cleans a line and outputs the error.
 */

'use strict';

const readline = require('readline');
const colors = require('colors/safe');

/**
 * @param {string} str
 */
module.exports = function printError (str) {
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 1);

  console.error(colors.red(str));
};
