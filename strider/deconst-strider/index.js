#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var async = require('async');
var strider = require('strider');
var logger = require('strider/lib/logging');

var user = require('./user');
var project = require('./project');

var extPath = path.join(__dirname, "node_modules");

process.umask(02);
fs.chmodSync('/workspace', 06755);

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
