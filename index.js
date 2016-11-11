'use strict';

var npm = require('npm'),
    got = require('got'),
    untar = require('tar').Parse,
    concat = require('concat-stream'),
    cancelableGroup = require('cancelable-group'),
    pairs = require('object-pairs'),
    popzip = require('pop-zip/unzip'),
    dent = require('dent'),
    _ = require('underscorify')._.unload()._;

var unzip = require('zlib').createGunzip,
    Path = require('path');


var npmGet = function (packageName, queryPath, opts, cb) {
  var originalQueryPath = queryPath = Path.normalize(queryPath);
  opts = opts || {};

  if (queryPath[0] == '/') {
    queryPath = queryPath.slice(1);
  }

  if (queryPath.slice(-1)[0] == '/') {
    var mustBeADirectory = true;
    queryPath = queryPath.slice(0, -1);
  }

  // Initialize npm.
  npm.load(function (err) {
    if (err) return cb(err);

    // Get tarball URL.
    npm.commands.view([packageName, 'dist.tarball'], true, function (err, dist) {
      if (err) return cb(err);

      var versions = Object.keys(dist);
      if (versions.length != 1) {
        return cb(Error('Can\'t choose between versions: ' + versions));
      }

      var tarball = dist[versions[0]]['dist.tarball'];

      var entries = {};
      var addPathElement = function (entry, path) {
        var pathElement = path.split('/', 1)[0];
        entries[pathElement] = path.length == pathElement.length
          ? entry
          : { type: 'Directory',
              path: Path.join('package', queryPath, pathElement) };
      };

      var cancel = cancelableGroup();

      // Download and unpack tarball.
      got.stream(tarball, { encoding: null })
        .pipe(unzip())
        .pipe(untar())
        .on('entry', cancel(function (entry) {
          var entryPath = Path.relative('package', entry.path);

          if (entryPath == queryPath && !mustBeADirectory) {
            return entry.pipe(concat({ encoding: 'string' }, function (data) {
              cancel();
              cb(null, entry, data);
            }));
          }

          if (!queryPath) {
            addPathElement(entry, entryPath);
          }
          else if (entryPath.indexOf(queryPath + '/') == 0) {
            addPathElement(entry, entryPath.slice(queryPath.length + 1));
          }
        }))
        .on('end', cancel(function () {
          var items = pairs(entries);

          if (!items.length) {
            var message = 'Not found: ' + originalQueryPath + ' in ' + packageName;
            return cb(Error(message));
          }

          var paths = dent(popzip(items))();

          if (opts.fullPaths && queryPath) {
            paths = paths.map(_(Path.join)(queryPath, _));
          }

          cb(null, dent(), paths);
        }));
    });
  });
};


module.exports = function (packageName, path, opts, cb) {
  var args = [].slice.call(arguments, 1);

  path = typeof args[0] == 'string'
    ? args.shift()
    : path = '/';

  opts = typeof args[0] == 'object'
    ? args.shift()
    : null;

  cb = typeof args[0] == 'function'
    ? args.shift()
    : Function.prototype;

  return npmGet(packageName, path, opts, cb);
};
