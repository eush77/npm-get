'use strict';

const npmGet = require('..');

const afterAll = require('after-all'),
      order = require('order-permutation'),
      pick = require('@f/pick'),
      test = require('tape');

const fs = require('fs');


test('get file', t => {
  const next = afterAll(t.end);

  npmGet('npm-get', 'LICENSE', next((err, entry, contents) => {
    const fileData = fs.readFileSync(__dirname +  '/../LICENSE',
                                     { encoding: 'utf8' });

    t.error(err);
    t.equal(entry.type, 'File', 'entry type');
    t.equal(entry.path, 'package/LICENSE', 'entry path');
    t.equal(contents, fileData, 'contents');
  }));

  npmGet('npm-get', '/', next((err, entries, listing) => {
    const expectedEntries = [
      { type: 'File', path: 'package/LICENSE' },
      { type: 'File', path: 'package/README.md' },
      { type: 'File', path: 'package/cli.js' },
      { type: 'File', path: 'package/index.js' },
      { type: 'File', path: 'package/package.json' },
    ];
    const ordering = order(listing);

    t.deepEqual(ordering.map(k => listing[k]),
                expectedEntries.map(entry => entry.path.split('/')[1]),
                'listing');

    t.deepEqual(
      ordering
        .map(k => entries[k])
        .map(pick.bind(null, ['type', 'path'])),
      expectedEntries, 'entries');
  }));
});
