/**
 * @file checks if spdx expressions are matching
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
    return spdxSatisfies(ac, bc);
  } catch (e) {
    // console.log(a, b, e);
    //  dummy fallback
    return ac === bc;
  }
}
