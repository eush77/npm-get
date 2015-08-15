#!/usr/bin/env node
'use strict';

var npmGet = require('./');

var help = require('help-version')(usage()).help,
    minimist = require('minimist'),
    lsView = require('ls-view'),
    filePager = require('file-pager');

var path = require('path');


function usage() {
  return 'Usage:  npm-get [-l | --long] [--pager] <package> [<path>]';
}


var opts = minimist(process.argv.slice(2), {
  boolean: ['long', 'pager'],
  alias: {
    long: 'l'
  },
  unknown: function (opt) {
    if (opt[0] == '-') {
      help(1);
    }
  }
});


(function main(opts, argv) {
  if (argv.length == 1) {
    argv.push('/');
  }

  if (argv.length != 2) {
    return help(1);
  }

  npmGet(argv[0], argv[1], { fullPaths: opts.long },
         function (err, entries, contents) {
           if (err) throw err;

           if (Array.isArray(contents)) {
             console.log(lsView(entries.map(function (entry, i) {
               return {
                 name: contents[i],
                 type: entry.type.toLowerCase()
               };
             })));
           }
           else if (opts.pager) {
             filePager({ basename: path.basename(entries.path) })
               .end(contents);
           }
           else {
             process.stdout.write(contents);
           }
         });
}(opts, opts._));
