var config = require('./config');
var user = require('./user');

var models = require('strider/lib/models');
var logger = require('strider/lib/logging');

var Project = models.Project;
var systemUser = user.systemUser;

exports.createControlProject = function (callback) {
  callback(null);
};
