import printError from '../lib/printError.js';

const {error} = console;

describe('`printError`', function () {
  after(() => {
    // eslint-disable-next-line no-console -- Spy
    console.error = error;
  });
  it('Prints a colored string if supplied a string', function (done) {
    // eslint-disable-next-line no-console -- Spy
    console.error = (str) => {
      expect(str).to.equal('\u001B[31mTest\u001B[39m');
      done();
    };
    printError('Test');
  });
});
