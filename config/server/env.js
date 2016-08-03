// Import all ENV variables here to avoid `process.env`s all over the app.
// If a variable is marked as required and not present, the app will error.

var REQUIRED_ENV_VARIABLES = [
  "NODE_ENV",              // Run node and webpack in different modes (development|production)
  "DEPLOY_ENV",            // name of app environment (ex: development, staging, production)
  "HOST",                  // Hostname of app
  "HONEYBADGER_API_KEY"    // Private API key for honeybadger project
];

var OPTIONAL_ENV_VARIABLES = [
  "PORT",                  // Port node server will run on
  "ASSET_HOST",            // CDN route that will be prefixed in production environments
  "HOT",                   // Lets server know webpack is running with hot reloading
  "NO_SERVER_RENDERING",   // Disables rendering of react tree on server (useful for debugging in dev)
  "HEROKU_SLUG_ID"         // Identifier of heroku release (https://devcenter.heroku.com/articles/dyno-metadata)
];

var _ = require("lodash");

var failNoisilyIfMissing = function(envName, value) {
  if (typeof value === "undefined") {
    throw new Error("Could not load ENV—missing ENV variable `" + envName + "`.");
  }
};

var fetch = function(envName, required) {
  var value = process.env[envName];
  if (required) { failNoisilyIfMissing(envName, value); }
  return value;
};

var fetchList = function(envList, required) {
  var envVars = {};
  _.each(envList, function(envVar) {
    envVars[envVar] = fetch(envVar, required);
  });
  return envVars;
};

var env = _.extend({},
  fetchList(REQUIRED_ENV_VARIABLES, true),
  fetchList(OPTIONAL_ENV_VARIABLES, false)
);

module.exports = env;
