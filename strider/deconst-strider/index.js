#!/usr/bin/env node

var strider = require('strider');

strider(__dirname, {}, function (err, initialized, appInstance) {
  if (err) {
    console.error(err);
    return;
  }

  console.log("Strider is up and running.");
});
