import getQuickStats from '../lib/getQuickStats.js';

import {brightBlackFG, defaultFG, greenFG, space} from './utils/ansi.js';

import argparseFixture from './fixtures/argparseFixture.js';
import spdxCorrectFixture from './fixtures/spdxCorrectFixture.js';

describe('`getQuickStats`', function () {
  it('Gets stats as string', function () {
    this.timeout(30000);
    expect(getQuickStats(argparseFixture)).to.equal(
      `Packages ${brightBlackFG} ${defaultFG}3          ${brightBlackFG} ${defaultFG}${space.repeat(2)}
Size     ${brightBlackFG} ${defaultFG}0 B        ${brightBlackFG} ${defaultFG}${space.repeat(2)}
Licenses ${brightBlackFG} ${defaultFG}${greenFG}Permissive${defaultFG} ${brightBlackFG} ${defaultFG}3${space}`
    );
  });

  it('Gets stats as string (multiple license types)', function () {
    this.timeout(30000);
    expect(getQuickStats(spdxCorrectFixture)).to.equal(
      `Packages ${brightBlackFG} ${defaultFG}4             ${brightBlackFG} ${defaultFG}${space.repeat(2)}
Size     ${brightBlackFG} ${defaultFG}0 B           ${brightBlackFG} ${defaultFG}${space.repeat(2)}
Licenses ${brightBlackFG} ${defaultFG}${greenFG}Permissive${defaultFG}    ${brightBlackFG} ${defaultFG}3${space}
         ${brightBlackFG} ${defaultFG}${greenFG}Public Domain${defaultFG} ${brightBlackFG} ${defaultFG}1${space}`
    );
  });
});
