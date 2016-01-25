var config = require('./config');

var models = require('strider/lib/models');
var logger = require('strider/lib/logging').logger;

var User = models.User;

// Create the Strider user named by STRIDER_SYSTEM_EMAIL if one is specified.
exports.createSystemUser = function (callback) {
  var email = config.striderSystemEmail;

  if (!email) {
    logger.info("Not creating system user because STRIDER_SYSTEM_EMAIL and STRIDER_SYSTEM_PASSWORD are unset.");
    return callback(null);
  }

  User.find({ email: email }, function (err, results) {
    if (err) return callback(err);

    if (results.length > 0) {
      logger.info("System user %s already exists.", email);
      return callback(null);
    }

    var user = new User();
    user.email = email;
    user.created = new Date();
    user.set('password', password);
    user.projects = [];

    user.save(function (err) {
      if (err) return callback(err);

      logger.info("Created system user %s.", email);

      callback(null);
    });
  });
};
