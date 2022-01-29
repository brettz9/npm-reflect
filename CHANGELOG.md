# CHANGES for `npm-reflect`

## 2.0.0 (unreleased)

### User-impacting changes

- (breaking) refactor: Switch to ESM only
- (breaking) refactor: change show* logging files to get\* string-returning
    files for easier testing and separation of concerns from CLI
- feat: return `Promise` with `installPackage`
- feat: support pnpm
- feat: update filesize, commander, inquirer, cli-table3
- feat: allow overriding package details cache and for a new npmConfig cache
- fix: prevent infinite loop with empty dependencies

### Dev-impacting changes

- chore: switch linting to ash-nazg
- chore: switch to pnpm
- chore: add example script
- test: Adds some tests

## 1.1.0

### User-impacting changes

- Enhancement: Add RPL 1.1 and RPL 1.5 to network protective

## 1.0.0

### User-impacting changes

- Fix: Handle ANDs
- Fix: Treat UNLICENSED as special case for comparisons (so it is not
    confused with "Unlicense")
- Enhancement: Add `useOrModifyProtective` category with licenses
- Enhancement: Add `CC-BY-3.0` license as permissive
- Enhancement: Support `CC-BY-4.0` (as permissive)
- Enhancement: Add `0BSD` to permissive licenses; see
    https://spdx.org/licenses/0BSD.html
- Enhancement: Add Parity licenses to `networkProtective`
- npm: Bump `cli-table3` (minor), `commander` (minor), `filesize` (minor),
    `inquirer` (minor), `moment` (minor), `node-fetch` (patch),
    `promise-queue` (patch)
- npm: Update `semver`, `spdx-correct`, and `spdx-satisfies` to latest major
    versions

### Dev-impacting changes

- Linting (ESLint): Apply per latest airbnb-base
- Linting (ESLint): Add ignore file in conjunction with linting all by default
    (catches index.js)
- Linting (ESLint): Check hidden files; enforce "strict"
- Maintenance: Add `.editorconfig`
- npm: Adds `.ncurc.js` to manage updates
- npm: Update eslinting devDeps to latest major versions
- npm: Add separate lint script
- Travis: Update per newest minimum (and 12, 14, 16, 17)

See https://github.com/delfrrr/npm-consider/releases for the forked project's history
