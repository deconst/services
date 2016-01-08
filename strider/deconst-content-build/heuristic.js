var fs = require('fs');
var path = require('path');

exports.guessPreparer = function (root, callback) {
  fs.readdir(root, function (err, files) {
    if (err) return callback(err);

    if (files.indexOf('conf.py') !== -1) {
      return callback(null, 'quay.io/deconst/preparer-sphinx');
    }

    if (files.indexOf('_config.yml') !== -1) {
      return callback(null, 'quay.io/deconst/preparer-jekyll');
    }

    return callback(new Error('Unable to infer preparer'));
  });
};
