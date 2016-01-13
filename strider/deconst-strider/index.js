#!/usr/bin/env node

var path = require('path');
var strider = require('strider');

var extPath = path.join(__dirname, "node_modules");

strider(extPath);
