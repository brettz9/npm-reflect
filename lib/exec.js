/**
 * @file exec command with args
 */

import {spawn} from 'child_process';

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {ChildProcess}
 */
export default function exec (command, args) {
  return spawn(command, args, {
    stdio: `inherit`
  });
}
