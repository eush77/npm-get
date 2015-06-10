#!/usr/bin/env node
'use strict';

var npmGet = require('./');

var help = require('help-version')(usage()).help;


function usage() {
  return 'Usage:  npm-get [-l | --long] <package> [<path>]';
}


(function (argv) {
  if (argv[0] == '-l' || argv[0] == '--long') {
    var fullPaths = true;
    argv.shift();
  }

  if (argv.length == 1) {
    argv.push('/');
  }

  if (argv.length != 2) {
    return help(1);
  }

  npmGet(argv[0], argv[1], { fullPaths: fullPaths }, function (err, contents) {
    if (err) throw err;

    if (Array.isArray(contents)) {
      console.log(contents.join('\n'));
    }
    else {
      process.stdout.write(contents);
    }
  });
}(process.argv.slice(2)));
