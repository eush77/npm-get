'use strict';

var npm = require('npm');


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

      cb(null, dist[versions[0]]['dist.tarball']);
    });
  });
};
