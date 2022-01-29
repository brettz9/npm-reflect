import printError from '../lib/printError.js';

import {defaultFG, redFG} from './utils/ansi.js';

const {error} = console;

describe('`printError`', function () {
  after(() => {
    // eslint-disable-next-line no-console -- Spy
    console.error = error;
  });
  it('Prints a colored string if supplied a string', function (done) {
    // eslint-disable-next-line no-console -- Spy
    console.error = (str) => {
      expect(str).to.equal(`${redFG}Test${defaultFG}`);
      done();
    };
    printError('Test');
  });
});
