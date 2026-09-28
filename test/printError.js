import {expect} from 'chai';
import printError from '../lib/printError.js';

import {defaultFG, redFG} from './utils/ansi.js';

const {error} = console;

describe('`printError`', function () {
  after(() => {
    // eslint-disable-next-line no-console -- Spy
    console.error = error;
  });
  it('Prints a colored string if supplied a string', function () {
    let str;
    // eslint-disable-next-line no-console -- Spy
    console.error = (s) => {
      str = s;
    };
    printError('Test');
    expect(str).to.equal(`${redFG}Test${defaultFG}`);
  });
});
