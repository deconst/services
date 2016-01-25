#!/usr/bin/env node

var path = require('path');
var async = require('async');
var strider = require('strider');
var logger = require('strider/lib/logger').logger;

var user = require('./user');
var project = require('./project');

var extPath = path.join(__dirname, "node_modules");

var launchStrider = function (callback) {
  strider(extPath, {}, callback);
};

async.series([
  launchStrider,
  user.createSystemUser,
  project.createControlProject
], function (err) {
  if (err) {
    logger.error("Unable to initialize Strider.", err);
    process.exit(1);
  }

  logger.info("Deconst Strider server is initialized and running.");
});
