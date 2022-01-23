import printError from '../lib/printError.js';

describe('`printError`', function () {
  it('Prints a colored string if supplied a string', function (done) {
    global.console.error = (str) => {
      expect(str).to.equal('\u001B[31mTest\u001B[39m');
      done();
    };
    printError('Test');
  });
});
