#!/usr/bin/env node

var walk = require('walk');
var request = require('request');

var logger = require('./logger');
var prepare = require('./prepare');

prepare.connect();

// walk the filesystem from . to find directories that contain a _deconst.json file.
var options = {
  followLinks: false,
};

var atLeastOne = false;
var allSuccessful = true;

walker = walk.walk(".", options);

walker.on('directories', function (root, stats, callback) {
  logger.debug('Traversing directories: %s', root);

  // Don't traverse into dot or common build directories.
  for (var i = stats.length; i--; i >= 0) {
    var name = stats[i].name;
    if (/^\./.test(name) || name === '_build' || name === '_site') {
      stats.splice(i, 1);
    }
  }

  callback();
});

walker.on('files', function (root, stats, callback) {
  var hasContent = stats.some(function (each) {
    return each.name === '_deconst.json';
  });

  if (hasContent) {
    logger.info('Deconst content directory: %s', root);

    prepare.prepare(root, function (err, success) {
      atLeastOne = true;

      if (err) return callback(err);

      allSuccessful = allSuccessful && success;
      callback(null);
    });
  } else {
    callback(null);
  }
});

walker.on('errors', function (root, stats, callback) {
  logger.error('Error walking %s', root, {
    errors: stats.map(function (e) { return e.error; })
  });

  callback();
});

walker.on('end', function () {
  logger.debug('Walk completed');

  if (!atLeastOne) {
    logger.error("No preparable content discovered.");
    logger.error("Please add a _deconst.json file to each root directory where content is located.");

    process.exit(1);
  }

  if (!allSuccessful) {
    logger.error("At least one preparer run terminated unsuccessfully.");

    process.exit(1);
  }
});
