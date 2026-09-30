/**
 * @file Exec command with args.
 */

import {spawn} from 'node:child_process';

/**
 * @param {string} command
 * @param {string[]} args
 * @returns {import('child_process').ChildProcess}
 */
export default function exec (command, args) {
  return spawn(command, args, {
    stdio: `inherit`
  });
}
