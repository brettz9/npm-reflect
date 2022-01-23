/**
 * @file returns table without borders
 */

import Table from 'cli-table3';

const chars = {
  top: '',
  'top-mid': '',
  'top-left': '',
  'top-right': '',
  bottom: '',
  'bottom-mid': '',
  'bottom-left': '',
  'bottom-right': '',
  left: '',
  'left-mid': '',
  mid: '',
  'mid-mid': '',
  right: '',
  'right-mid': '',
  middle: ' '
};

/**
 *
 */
export default function getSimpleTable () {
  return new Table({
    chars,
    style: {'padding-left': 0, 'padding-right': 1}
  });
}
