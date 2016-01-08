var fs = require('fs');
var path = require('path');
var dockerode = require('dockerode');
var async = require('async');

var logger = require('./logger');
var heuristic = require('./heuristic');

var docker;

var preparerWhitelist = (function () {
  var whitelist = process.env.DECONST_BUILD_WHITELIST;

  if (whitelist) {
    return whitelist.split(/\s*,\s*/);
  } else {
    return [
      "quay.io/deconst/preparer-sphinx",
      "quay.io/deconst/preparer-jekyll"
    ];
  }
})();

exports.connect = function () {
  docker = new Docker();
};

var choosePreparer = function (state) {
  return function (callback) {
    var filename = path.join(state.root, '_deconst.json');

    fs.readFile(filename, { encoding: 'utf-8' }, function (err, contents) {
      var config = {};
      try {
        config = JSON.parse(contents);
      } catch (e) {
        logger.error('Unable to parse _deconst.json file in %s', state.filename);
        return callback(new Error('Unable to parse _deconst.json'));
      }

      if (config.preparer) {
        // Ensure that the preparer is in the whitelist
        if (preparerWhitelist.indexOf(config.preparer) === -1) {
          return callback(new Error('Preparer container not on the whitelist'));
        }

        state.preparer = config.preparer;
        return callback(null);
      } else {
        // Infer from directory contents
        heuristic.guessPreparer(state.root, function (err, preparer) {
          state.preparer = preparer;
          return callback(err);
        });
      }
    });
  };
};

var createPreparerContainer = function (state) {
  return function (callback) {
    docker.createContainer({
      Image: state.preparer,
      Env: [
        "CONTENT_STORE_URL=",
        "CONTENT_STORE_APIKEY=",
        "TRAVIS_PULL_REQUEST=false"
      ]
    }, function (err, container) {
      state.container = container;
      callback(err);
    });
  };
};

var startPreparerContainer = function (state) {
  return function (callback) {
    state.container.start(callback);
  };
};

var waitForCompletion = function (state) {
  return function (callback) {
    state.container.wait(function (err, result) {
      state.status = result.StatusCode;
      callback(null);
    });
  };
};

exports.prepare = function (root, callback) {
  var state = {
    root: root,
    container: null,
    status: 0
  };

  async.series([
    choosePreparer(state),
    createPreparerContainer(state),
    startPreparerContainer(state),
    waitForCompletion(state)
  ], callback);
};
