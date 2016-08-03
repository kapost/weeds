var path = require("path");

var env = require("./server/env");

var config = {
  projectRoot: path.join(__dirname, ".."),
  port: parseInt(env.PORT) || 5001,
  host: env.HOST,
  env: env.NODE_ENV,
  serverRendering: !env.NO_SERVER_RENDERING,
  hot: env.HOT || false,
  appEnv: env.DEPLOY_ENV,
  relativeRoot: "client",
  assetHost: env.ASSET_HOST || "",
  startTime: Date.now(),
  herokuSlugId: env.HEROKU_SLUG_ID
};

module.exports = config;
