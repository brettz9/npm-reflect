/**
 * @file exec command with args
 */

'use strict';

const {spawn} = require('child_process');

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {ChildProcess}
 */
module.exports = function exec (command, args) {
  return spawn(command, args, {
    stdio: `inherit`
  });
};
