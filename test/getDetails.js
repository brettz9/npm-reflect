import getDetails from '../lib/getDetails.js';

import spdxCorrectFixture from './fixtures/spdxCorrectFixture.js';

describe('`getDetails`', function () {
  it('Returns new item', function () {
    const details = getDetails(spdxCorrectFixture);
    const brightBlackFG = '\u001B[90m';
    const greenFG = '\u001B[32m';
    const defaultFG = '\u001B[39m';
    const redFG = '\u001B[31m';
    expect(details).to.equal(
      `${brightBlackFG}┌─────────────────────────────${defaultFG}${brightBlackFG}┬──────${defaultFG}${brightBlackFG}┬──────────────${defaultFG}${brightBlackFG}┬─────────────────────────${defaultFG}${brightBlackFG}┬───────────────────────────────┐${defaultFG}
${brightBlackFG}│${defaultFG}${redFG} Package                     ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Size ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Updated      ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} License                 ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Dependencies                  ${defaultFG}${brightBlackFG}│${defaultFG}
${brightBlackFG}├─────────────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┬────────────${defaultFG}${brightBlackFG}┼───────────────────────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} spdx-correct@3.1.1          ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} 2 years ago  ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} Apache-2.0 ${brightBlackFG}│${defaultFG} spdx-expression-parse@^3.0.0, ${brightBlackFG}│${defaultFG}
${brightBlackFG}│${defaultFG}                             ${brightBlackFG}│${defaultFG}      ${brightBlackFG}│${defaultFG}              ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG} spdx-license-ids@^3.0.0       ${brightBlackFG}│${defaultFG}
${brightBlackFG}├─────────────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼───────────────────────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} spdx-exceptions@2.3.0       ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} 2 years ago  ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} CC-BY-3.0  ${brightBlackFG}│${defaultFG}                               ${brightBlackFG}│${defaultFG}
${brightBlackFG}├─────────────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼───────────────────────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} spdx-expression-parse@3.0.1 ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} 2 years ago  ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} MIT        ${brightBlackFG}│${defaultFG} spdx-exceptions@^2.1.0,       ${brightBlackFG}│${defaultFG}
${brightBlackFG}│${defaultFG}                             ${brightBlackFG}│${defaultFG}      ${brightBlackFG}│${defaultFG}              ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG} spdx-license-ids@^3.0.0       ${brightBlackFG}│${defaultFG}
${brightBlackFG}├─────────────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼───────────────────────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} spdx-license-ids@3.0.11     ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} 2 months ago ${brightBlackFG}│${defaultFG} ${greenFG}Public${defaultFG}     ${brightBlackFG}│${defaultFG} CC0-1.0    ${brightBlackFG}│${defaultFG}                               ${brightBlackFG}│${defaultFG}
${brightBlackFG}│${defaultFG}                             ${brightBlackFG}│${defaultFG}      ${brightBlackFG}│${defaultFG}              ${brightBlackFG}│${defaultFG} ${greenFG}Domain${defaultFG}     ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG}                               ${brightBlackFG}│${defaultFG}
${brightBlackFG}└─────────────────────────────${defaultFG}${brightBlackFG}┴──────${defaultFG}${brightBlackFG}┴──────────────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴───────────────────────────────┘${defaultFG}`
    );
  });
});
