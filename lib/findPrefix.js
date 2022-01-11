// copy from: https://github.com/npm/npm/blob/d46015256941ddfff1463338e3e2f8f77624a1ff/lib/config/load-prefix.js
// try to find the most reasonable prefix to use

'use strict';

module.exports = findPrefix;

const fs = require('fs');
const path = require('path');

/**
 * @callback NextTickCallback
 * @param {Error|null} er
 * @param {string} pth
 * @returns {void}
 */

/**
 * @param {string} p
 * @param {NextTickCallback} cb_
 * @returns {void}
 */
function findPrefix (p, cb_) {
  /**
   * @type {NextTickCallback}
   */
  function cb (er, pth) {
    process.nextTick(function () {
      cb_(er, pth);
    });
  }

  p = path.resolve(p);
  // if there's no node_modules folder, then
  // walk up until we hopefully find one.
  // if none anywhere, then use cwd.
  let walkedUp = false;
  while (path.basename(p) === 'node_modules') {
    p = path.dirname(p);
    walkedUp = true;
  }
  if (walkedUp) return cb(null, p);

  findPrefix_(p, p, cb);
}

/**
 * @param {string} p
 * @param {string} original
 * @param {NextTickCallback} cb
 * @returns {void}
 */
function findPrefix_ (p, original, cb) {
  if (p === '/' ||
      (process.platform === 'win32' && (/^[a-zA-Z]:(?:\\|\/)?$/u).test(p))) {
    return cb(null, original);
  }
  fs.readdir(p, function (er, files) {
    // an error right away is a bad sign.
    // unless the prefix was simply a non
    // existent directory.
    if (er && p === original) {
      // istanbul ignore else -- How to trigger
      if (er.code === 'ENOENT') return cb(null, original);
      // istanbul ignore next -- How to trigger
      return cb(er);
    }

    // walked up too high or something.
    if (er) return cb(null, original);

    if (files.includes('node_modules') ||
        files.includes('package.json')) {
      return cb(null, p);
    }

    const d = path.dirname(p);
    if (d === p) return cb(null, original);

    return findPrefix_(d, original, cb);
  });
}
