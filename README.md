[![npm](https://nodei.co/npm/npm-get.png)](https://nodei.co/npm/npm-get/)

# npm-get

[![Dependency Status][david-badge]][david]

Fetches files and lists directories from npm packages.

Does not pollute your file system like some other npm downloaders do.

[david]: https://david-dm.org/eush77/npm-get
[david-badge]: https://david-dm.org/eush77/npm-get.png

## CLI

### `npm-get [-l | --long] <package> [<path>]`

Lists directory or fetches file contents at `<path>`.

With `--long`, prints full paths for nested directories.

## API

### `npmGet(package, [path], [opts], cb(err, contents))`

Downloads file or directory listing from `package`.

`path` — path to file in the package. Defaults to `/` (root).

`contents` — array of file names or string of file's contents.

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
