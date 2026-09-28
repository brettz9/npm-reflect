/**
 * @file Format a `name@version` entry with its license for display.
 */

/**
 * @param {string} nameVersion
 * @param {string} license
 * @returns {string} e.g. `name@version (MIT)`, or `(Missing)` if unset
 */
export default function formatPackageLicense (nameVersion, license) {
  if (license === 'Unknown') {
    return `${nameVersion} (Missing)`;
  }
  // Multi-license expressions (e.g. `(MIT OR CC0-1.0)`) are already
  //   parenthesized, so only wrap bare single identifiers (e.g. `MIT`).
  const parenthesized = license.startsWith('(') && license.endsWith(')');
  return `${nameVersion} ${parenthesized ? license : `(${license})`}`;
}
