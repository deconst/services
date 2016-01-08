var walk = require('walk');
var dockerode = require('dockerode');
var request = require('request');

var logger = require('./logger');

// walk filesystem from . to find _deconst.json directories

var options = {
  followLinks: false,
};

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
  }

  callback();
});

walker.on('errors', function (root, stats, callback) {
  logger.error('Error walking %s', root, {
    errors: stats.map(function (e) { return e.error; })
  });

  callback();
});

walker.on('end', function () {
  logger.debug('Walk completed');
});

// derive preparer Docker image
// 1. from _deconst.json, on whitelist
// 2a. conf.py => quay.io/deconst/preparer-sphinx
// 2b. _config.yml => quay.io/deconst/preparer-jekyll

// pull request build - issue temporary API key

// run the preparer container with:
// - content path volume-mounted to /var/content
// - environment with: api key, content store URL
// note exit code

// pull request build - revoke temporary API key

// walk complete: exit with worst exit code
