#!/usr/bin/env node
'use strict';

var npmGet = require('./');

var help = require('help-version')(usage()).help;


function usage() {
  return 'Usage:  npm-get <package>';
}


(function (argv) {
  if (argv.length != 1) {
    return help(1);
  }

  npmGet(argv[0], function (err, files) {
    if (err) throw err;
    console.log(files.join('\n'));
  });
}(process.argv.slice(2)));
