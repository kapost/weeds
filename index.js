"use strict";

/* eslint-disable */

// Server boot file, used by nodemon / gulp

var fs = require('fs');

// Setup universal constants
var appConfig = require("./config/app");
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = (appConfig.env === "development");
global.__RELATIVE_ROOT__ = appConfig.relativeRoot;

// Register Babel and then run the server
var babelrc = fs.readFileSync('./.babelrc');
var config;
var LOADER_EXCLUDE_REGEX = /node_modules\/[^@]/;

try {
  config = JSON.parse(babelrc);
  config.ignore = LOADER_EXCLUDE_REGEX;
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

require("babel-register")(config);
var server = require("./app/server");
