import getLicenseStr from '../lib/getLicenseStr.js';

describe('`getLicenseStr`', function () {
  it('Gets string if supplied a string', function () {
    expect(getLicenseStr('MIT')).to.equal('MIT');
  });

  it('Gets "Unknown" if supplied an object without a type', function () {
    expect(getLicenseStr({})).to.equal('Unknown');
    expect(getLicenseStr({type: ''})).to.equal('Unknown');
  });

  it('Gets "Unknown" if supplied falsey value without a type', function () {
    expect(getLicenseStr(null)).to.equal('Unknown');
  });

  it('Gets type if supplied an object with a type', function () {
    expect(getLicenseStr({type: 'MIT'})).to.equal('MIT');
  });

  it('Gets OR type if supplied an array of types', function () {
    expect(getLicenseStr([{type: 'MIT'}, 'GPL-3.0'])).to.equal('(MIT OR GPL-3.0)');
  });
});
