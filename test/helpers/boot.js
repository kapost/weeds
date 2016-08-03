"use strict";

process.env.NODE_ENV = "test";
var LOADER_EXCLUDE_REGEX = /node_modules\/[^@]/;

require("babel-register")({
  // This will override `node_modules` ignoring - you can alternatively pass
  // an array of strings to be explicitly matched or a regex / glob
  ignore: LOADER_EXCLUDE_REGEX
});

// this tells mocha to also look in the root directory for modules (js-app, shared-ui)
var path = require("path");
var appPath = path.normalize(__dirname + "/../../app");
var testPath = path.normalize(__dirname + "/..");

require('app-module-path').addPath(appPath);
require('app-module-path').addPath(testPath);

global.chai = require("chai");
global.expect = chai.expect;

var sinonChai = require("sinon-chai");
var chaiEnzyme = require("chai-enzyme");

chai.use(chaiEnzyme());
chai.use(sinonChai);
