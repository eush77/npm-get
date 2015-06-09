'use strict';

var npm = require('npm'),
    got = require('got'),
    untar = require('tar-parse');

var unzip = require('zlib').createGunzip,
    Path = require('path');


module.exports = function (packageName, path, cb) {
  if (typeof path == 'function') {
    cb = path;
    path = '/';
  }

  npm.load(function (err) {
    if (err) return cb(err);

    npm.commands.view([packageName, 'dist.tarball'], true, function (err, dist) {
      if (err) return cb(err);

      var versions = Object.keys(dist);
      if (versions.length != 1) {
        return cb(Error('Can\'t choose between versions: ' + versions));
      }

      var tarball = dist[versions[0]]['dist.tarball'];
      var files = [];

      got(tarball)
        .pipe(unzip())
        .pipe(untar())
        .on('data', function (entry) {
          files.push(Path.relative('package', entry.path));
        })
        .on('end', function () {
          cb(null, files);
        });
    });
  });
};
