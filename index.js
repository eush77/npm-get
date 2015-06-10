'use strict';

var npm = require('npm'),
    got = require('got'),
    untar = require('tar').Parse,
    concat = require('concat-stream'),
    cancelableGroup = require('cancelable-group');

var unzip = require('zlib').createGunzip,
    Path = require('path');


module.exports = function (packageName, path, cb) {
  var originalPath = path = Path.normalize(path);

  if (typeof path == 'function') {
    cb = path;
    path = '';
    originalPath = '/';
  }

  if (path[0] == '/') {
    path = path.slice(1);
  }

  if (path.slice(-1)[0] == '/') {
    var mustBeADirectory = true;
    path = path.slice(0, -1);
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

      var files = {};
      var addPathElement = function (path) {
        files[path.split('/', 1)[0]] = true;
      };

      var cancel = cancelableGroup();

      // Download and unpack tarball.
      got(tarball, { encoding: null })
        .pipe(unzip())
        .pipe(untar())
        .on('entry', cancel(function (entry) {
          var file = Path.relative('package', entry.path);

          if (file == path && !mustBeADirectory) {
            return entry.pipe(concat({ encoding: 'string' }, function (data) {
              cancel();
              cb(null, data);
            }));
          }

          if (!path) {
            addPathElement(file);
          }
          else if (file.indexOf(path + '/') == 0) {
            addPathElement(file.slice(path.length + 1));
          }
        }))
        .on('end', cancel(function () {
          return (files = Object.keys(files)).length
            ? cb(null, files)
            : cb(Error('Not found: ' + originalPath + ' in ' + packageName));
        }));
    });
  });
};
