var crypto = require('crypto');

var async = require('async');
var request = require('request');
var models = require('strider/lib/models');
var logger = require('strider/lib/logging');

var config = require('./config');

var User = models.User;

exports.systemUser = null;

// Create the Strider user named by STRIDER_SYSTEM_EMAIL if one is specified.
exports.createSystemUser = function (callback) {
  var email = config.striderSystemEmail;

  if (!email) {
    logger.info("Not creating system user because STRIDER_SYSTEM_EMAIL is unset.");
    return callback(null);
  }

  var state = {
    githubProfile: null,
    user: null
  };

  var discoverExistingUser = function (cb) {
    logger.debug("Checking for an existing Strider user.");

    User.find({ email: email }, function (err, results) {
      if (err) return cb(err);

      cb(null, results.length > 0);
    });
  };

  var fetchGitHubAccount = function (cb) {
    logger.debug("Fetching GitHub profile information.");

    request({
      url: 'https://api.github.com/user',
      headers: {
        Authorization: 'token ' + config.githubToken,
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'request strider-github-auth'
      },
      json: true
    }, function (err, resp, body) {
      if (err) return cb(err);

      state.githubProfile = body;
      cb(null);
    });
  };

  var createUser = function (cb) {
    var user = new User();
    user.email = email;
    user.created = new Date();
    user.set('password', crypto.randomBytes(256).toString('utf-8'));
    user.projects = [];
    user.accounts = [{
      provider: 'github',
      id: githubProfile.id,
      display_url: githubProfile.profileUrl,
      title: githubProfile.username,
      config: {
        accessToken: config.githubToken,
        login: githubProfile.username,
        email: email,
        gravatarId: githubProfile._json.gravatar.id,
        name: githuhProfile.displayName
      },
      cache: []
    }];

    user.save(function (err) {
      if (err) return cb(err);

      state.user = user;
      cb(null);
    });
  };

  discoverExistingUser(function (err, existing) {
    if (err) return callback(err);

    if (existing) {
      logger.info("Strider system user %s already exists.", email);
      return callback(null);
    }

    async.series([
      fetchGitHubAccount,
      createUser
    ], function (err) {
      if (err) return callback(err);
      logger.info("Strider system user %s created.", email);

      exports.systemUser = state.user;

      callback(null);
    });
  });
};
