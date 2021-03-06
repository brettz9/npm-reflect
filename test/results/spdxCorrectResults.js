import moment from 'moment';

import {brightBlackFG, defaultFG, greenFG, redFG} from '../utils/ansi.js';
import spdxCorrectFixture from '../fixtures/spdxCorrectFixture.js';

// Being relative to now, these will vary over time, so keep tests valid (we
//   could have also stubbed Date)
const [
  spdxCorrectModified,
  spdxExpressionParseModified,
  spdxLicenseIdsModified,
  spdxExceptionsModified
] = [
  'spdx-correct@3.1.1',
  'spdx-expression-parse@3.0.1',
  'spdx-license-ids@3.0.11',
  'spdx-exceptions@2.3.0'
].map((pkg) => {
  return moment(spdxCorrectFixture[pkg].modified).fromNow();
});

const spdxCorrectResults1 = `${brightBlackFG}┌─────────────────────────────${defaultFG}${brightBlackFG}┬──────${defaultFG}${brightBlackFG}┬──────────────${defaultFG}${brightBlackFG}┬─────────────────────────${defaultFG}${brightBlackFG}┬───────────────────────────────┐${defaultFG}
${brightBlackFG}│${defaultFG}${redFG} Package                     ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Size ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Updated      ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} License                 ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Dependencies                  ${defaultFG}${brightBlackFG}│${defaultFG}
${brightBlackFG}├─────────────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┬────────────${defaultFG}${brightBlackFG}┼───────────────────────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} spdx-correct@3.1.1          ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} ${spdxCorrectModified}  ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} Apache-2.0 ${brightBlackFG}│${defaultFG} spdx-expression-parse@^3.0.0, ${brightBlackFG}│${defaultFG}
${brightBlackFG}│${defaultFG}                             ${brightBlackFG}│${defaultFG}      ${brightBlackFG}│${defaultFG}              ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG} spdx-license-ids@^3.0.0       ${brightBlackFG}│${defaultFG}
${brightBlackFG}├─────────────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼───────────────────────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} spdx-expression-parse@3.0.1 ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} ${spdxExpressionParseModified}  ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} MIT        ${brightBlackFG}│${defaultFG} spdx-exceptions@^2.1.0,       ${brightBlackFG}│${defaultFG}
${brightBlackFG}│${defaultFG}                             ${brightBlackFG}│${defaultFG}      ${brightBlackFG}│${defaultFG}              ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG} spdx-license-ids@^3.0.0       ${brightBlackFG}│${defaultFG}
${brightBlackFG}├─────────────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼───────────────────────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} spdx-license-ids@3.0.11     ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} ${spdxLicenseIdsModified} ${brightBlackFG}│${defaultFG} ${greenFG}Public${defaultFG}     ${brightBlackFG}│${defaultFG} CC0-1.0    ${brightBlackFG}│${defaultFG}                               ${brightBlackFG}│${defaultFG}
${brightBlackFG}│${defaultFG}                             ${brightBlackFG}│${defaultFG}      ${brightBlackFG}│${defaultFG}              ${brightBlackFG}│${defaultFG} ${greenFG}Domain${defaultFG}     ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG}                               ${brightBlackFG}│${defaultFG}
${brightBlackFG}├─────────────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼───────────────────────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} spdx-exceptions@2.3.0       ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} ${spdxExceptionsModified}  ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} CC-BY-3.0  ${brightBlackFG}│${defaultFG}                               ${brightBlackFG}│${defaultFG}
${brightBlackFG}└─────────────────────────────${defaultFG}${brightBlackFG}┴──────${defaultFG}${brightBlackFG}┴──────────────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴───────────────────────────────┘${defaultFG}`;

// Can be different sequence of results based on timing
const spdxCorrectResults2 = `${brightBlackFG}┌─────────────────────────────${defaultFG}${brightBlackFG}┬──────${defaultFG}${brightBlackFG}┬──────────────${defaultFG}${brightBlackFG}┬─────────────────────────${defaultFG}${brightBlackFG}┬───────────────────────────────┐${defaultFG}
${brightBlackFG}│${defaultFG}${redFG} Package                     ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Size ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Updated      ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} License                 ${defaultFG}${brightBlackFG}│${defaultFG}${redFG} Dependencies                  ${defaultFG}${brightBlackFG}│${defaultFG}
${brightBlackFG}├─────────────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┬────────────${defaultFG}${brightBlackFG}┼───────────────────────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} spdx-correct@3.1.1          ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} ${spdxCorrectModified}  ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} Apache-2.0 ${brightBlackFG}│${defaultFG} spdx-expression-parse@^3.0.0, ${brightBlackFG}│${defaultFG}
${brightBlackFG}│${defaultFG}                             ${brightBlackFG}│${defaultFG}      ${brightBlackFG}│${defaultFG}              ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG} spdx-license-ids@^3.0.0       ${brightBlackFG}│${defaultFG}
${brightBlackFG}├─────────────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼───────────────────────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} spdx-license-ids@3.0.11     ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} ${spdxLicenseIdsModified} ${brightBlackFG}│${defaultFG} ${greenFG}Public${defaultFG}     ${brightBlackFG}│${defaultFG} CC0-1.0    ${brightBlackFG}│${defaultFG}                               ${brightBlackFG}│${defaultFG}
${brightBlackFG}│${defaultFG}                             ${brightBlackFG}│${defaultFG}      ${brightBlackFG}│${defaultFG}              ${brightBlackFG}│${defaultFG} ${greenFG}Domain${defaultFG}     ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG}                               ${brightBlackFG}│${defaultFG}
${brightBlackFG}├─────────────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼───────────────────────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} spdx-expression-parse@3.0.1 ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} ${spdxExpressionParseModified}  ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} MIT        ${brightBlackFG}│${defaultFG} spdx-exceptions@^2.1.0,       ${brightBlackFG}│${defaultFG}
${brightBlackFG}│${defaultFG}                             ${brightBlackFG}│${defaultFG}      ${brightBlackFG}│${defaultFG}              ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG}            ${brightBlackFG}│${defaultFG} spdx-license-ids@^3.0.0       ${brightBlackFG}│${defaultFG}
${brightBlackFG}├─────────────────────────────${defaultFG}${brightBlackFG}┼──────${defaultFG}${brightBlackFG}┼──────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼────────────${defaultFG}${brightBlackFG}┼───────────────────────────────┤${defaultFG}
${brightBlackFG}│${defaultFG} spdx-exceptions@2.3.0       ${brightBlackFG}│${defaultFG} 0 B  ${brightBlackFG}│${defaultFG} ${spdxExceptionsModified}  ${brightBlackFG}│${defaultFG} ${greenFG}Permissive${defaultFG} ${brightBlackFG}│${defaultFG} CC-BY-3.0  ${brightBlackFG}│${defaultFG}                               ${brightBlackFG}│${defaultFG}
${brightBlackFG}└─────────────────────────────${defaultFG}${brightBlackFG}┴──────${defaultFG}${brightBlackFG}┴──────────────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴────────────${defaultFG}${brightBlackFG}┴───────────────────────────────┘${defaultFG}`;

export {spdxCorrectResults1, spdxCorrectResults2};
