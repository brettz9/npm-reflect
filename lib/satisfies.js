/**
 * @file Checks if spdx expressions are matching.
 */

import spdxSatisfies from 'spdx-satisfies';
import correct from 'spdx-correct';

/**
 * @param {string} spdx
 * @returns {string}
 */
function correcting (spdx) {
  if (spdx === 'UNLICENSED') { // See https://github.com/jslicense/spdx-correct.js/issues/3#issuecomment-279799556
    return spdx;
  }
  return correct(spdx);
}

/**
 * @param {string} a spdx
 * @param {string} b spdx
 * @returns {boolean} [description]
 */
export default function satisfies (a, b) {
  if (a === b) {
    return true;
  }
  const ac = correcting(a);
  const bc = correcting(b);
  if (!ac || !bc) {
    return false;
  }
  try {
    //  TODO fails at W3C-20150513
    // `spdx-satisfies` requires its second argument to be an array of
    //   *simple* approved license identifiers (not itself an AND/OR
    //   expression); a bare string always throws, which used to make this
    //   silently fall through to the exact-string fallback below for every
    //   comparison, including compound expressions like `(MIT OR CC0-1.0)`
    //   that a single approved license should actually satisfy.
    return spdxSatisfies(ac, [bc]);
  } catch (e) {
    // console.log(a, b, e);
    //  dummy fallback
    return ac === bc;
  }
}
