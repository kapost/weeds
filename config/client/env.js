// Variables that should be visible to the client

var EXPOSED_CLIENT_ENV_VARIABLES = [
  "NODE_ENV",
  "DEPLOY_ENV",
  "HOST",
  "HONEYBADGER_API_KEY",
];

var _ = require("lodash");
var env = require("../server/env");

module.exports = _.pick(env, EXPOSED_CLIENT_ENV_VARIABLES);
