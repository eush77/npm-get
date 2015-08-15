[![npm](https://nodei.co/npm/npm-get.png)](https://nodei.co/npm/npm-get/)

# npm-get

[![Dependency Status][david-badge]][david]

Fetches files and lists directories from npm packages.

Does not pollute your file system like some other npm downloaders do.

[david]: https://david-dm.org/eush77/npm-get
[david-badge]: https://david-dm.org/eush77/npm-get.png

## Example

```
$ npm-get npm-get
LICENSE
README.md
cli.js
index.js
package.json
```

```
$ npm-get npm-get index.js
'use strict';

var npm = require('npm'),
    got = require('got'),
    untar = require('tar').Parse,
# ...
```

## CLI

### `npm-get [-l | --long] [--pager] <package> [<path>]`

Lists directory or fetches file contents at `<path>`.

With `--long`, prints full paths for nested directories.

With `--pager`, shows result in a `$PAGER`. This is not equivalent to `npm-get ... | $PAGER`. Instead, the pager gets the file name argument which allows for syntax highlighting (e.g. via `$LESSOPEN` hook).

## API

### `npmGet(package, [path], [opts], cb(err, entries, contents))`

Downloads file or directory listing from `package`.

`path` — path to file in the package. Defaults to `/` (root).

`entries` — single entry or array of entries representing a single file or list of files. Each entry is guaranteed to have at least `path` and `type` properties, with the latter having such values as `Directory`, `File` among others (as defined by [node-tar]).

`contents` — array of file names or string of file's contents.

[node-tar]: http://npm.im/tar

#### `opts.fullPaths`

Type: `Boolean`<br>
Default: `false`

Enables full paths output for nested directories.

## Related

- [github-get] — fetch files and list directories from GitHub repositories.

[github-get]: https://github.com/eush77/github-get

## Install

```
npm install -g npm-get
```

## License

MIT
