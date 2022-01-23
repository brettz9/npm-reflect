# npm-reflect

Maintained fork of [`npm-consider`](https://github.com/delfrrr/npm-consider).

Check npm package dependencies size, licenses and impact on your package before installing it 🤔

![npm-reflect](https://i.imgur.com/eAQPbHL.gif)

If you like it, please, ⭐️ this repo!

[![Build Status](https://travis-ci.org/brettz9/npm-reflect.svg?branch=master)](https://travis-ci.org/brettz9/npm-reflect)

## Features

- calculate dependencies size recursively
- show dependencies license policy for linking
- calculates impact on current package
- show a full dependency graph
- analyses packages without downloading it
- supports yarn and pnpm
- analyzes local package
- provides continuous integration (CI) mode

## Installing

```shell
npm install -g npm-reflect
```
**Note:** this tool is more useful when your colleagues also use it 😉
## Usage

**Add new dependency**

`npm-reflect` has similar arguments as `npm install`

```shell
npm-reflect install --save express
```
The command recursively requests packages info from npm and builds dependencies graph. Size of the package determined via `HEAD` request to `tarball` download URL.

**Analyze local package**

When called without arguments in package directory it builds a dependency graph and calculates metrics for local package

```shell
npm-reflect install
```

**Using for automation and continuous integration**

You can specify maximum values of size and number as well as allowed license types in `config` of your `package.json`.

```json
"config": {
  "maxPackagesNumber": 100,
  "maxSizeBites": 840400,
  "allowedLicenseTypes": [
    "permissive",
    "publicDomain",
    "uncategorized"
  ]
}
```

Once provided you can call

```shell
npm-reflect install --test
```

![npm-reflect](https://i.imgur.com/eo4HbDb.gif)

If all limits are satisfied command will exit with `code=0`; otherwise `code=1`.

Note: in this mode, `npm-reflect` will not call `npm install`, `pnpm install`,
or `yarn install`.

Supported properties:

 - `maxPackagesNumber` max number of `npm` dependencies incuding [transitive dependencies](https://en.wikipedia.org/wiki/Transitive_dependency)
 - `maxSizeBites` max size of downloaded packages in bites
 - `allowedLicenseTypes` what types of dependency licenses are accpetable for the package

Supported types are `publicDomain`, `permissive`, `weaklyProtective`, `protective`, `networkProtective`, `useOrModifyProtective`, `uncategorized`.
If you are not sure which license types are appropriate [check this artice](https://medium.com/@vovabilonenko/licenses-of-npm-dependencies-bacaa00c8c65).

Note that `networkProtective` now includes the Parity licenses which refer to
publishing "through a freely accessible distribution system widely used for
similar source code".

`useOrModifyProtective` was later added to categorize those which can only be
used under certain conditions beyond any sharing requirements (e.g.,
non-commercial use only and/or not being permitted to modify the code).

### Usage with yarn

If the project contains `yarn.lock` file, then `npm-reflect` will do `yarn add`
with corresponding options. Also supports `pnpm` usage if a `pnpm-lock.yaml`
file is found.

### Licence type

`npm-reflect` calculates license type for every dependency. The type defines license policy for [linking as a librtary](https://en.wikipedia.org/wiki/Library_(computing)#Linking). Data collected from [Comparison of free and open-source software licenses](https://en.wikipedia.org/wiki/Comparison_of_free_and_open-source_software_licenses) on Wikipedia.

 - `Public Domain` and `Permissive` license allows you to do anything except sue the author
 - `Weakly Protective` license have a restriction to how can it be linked and combined with other licenses
 - `Protective` or *Copyleft* dependency license requires a dependent module to have a free license, which prevents it from being proprietary
 - `Network Protective` same as *Protective* but also triggers with network interaction
 - `Use or Modify Protective` Adds restrictions on usage (e.g., non-commercial) or against modifying code (restrictions which cause the license not to be considered "open source")
 - `Uncategorized` means that license was not found in a package info or was not categorised in terms of linking; feel free to contribute to license categorisation;

**Note:** that even permissive licenses have some restrictions. Check the following slide and article to learn about license compatibility:

![](https://www.dwheeler.com/essays/floss-license-slide-image.png)

[The Free-Libre / Open Source Software (FLOSS) License Slide](https://www.dwheeler.com/essays/floss-license-slide.html)

### Menu options

- **Install** runs `npm install` with the same arguments
- **Impact** takes onto account already installed dependencies and shows relative impact. It behaves differently, depending on `--save` or `--save-dev` option. The second one takes into account already installed `dependencies` and `devDepenedencies`.
- **Details** prints dependencies graph
- **Skip** cancels `npm install`; no changes in your project will apply.

### To-dos

1. Investigate why `getPackageDetails` (e.g., as used by `walkDependencies`) is not getting
    `size`
