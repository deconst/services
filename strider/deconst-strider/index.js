#!/usr/bin/env node

var path = require('path');
var strider = require('strider');

var extPath = path.join(__dirname, "node_modules");

strider(extPath, {}, function (err, initialized, appInstance) {
  if (err) {
    console.error(err);
    return;
  }

  console.log("Strider is up and running.");
});
