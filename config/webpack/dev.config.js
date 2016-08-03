/* eslint-disable */

var path = require("path");
var webpack = require("webpack");
var appConfig = require("../app");
var clientEnv = require("../client/env");

var BUILD_PATH = path.join(appConfig.projectRoot, 'build');
var LOADER_EXCLUDE_REGEX = /node_modules\/[^@]/;

module.exports = {
  // Config should be in context of project
  context: path.resolve(appConfig.projectRoot),

  // Debug tool of choice -- inlining a source map within webpack output
  devtool: "inline-source-map",

  // Entry points, using some dev server and hot loading magic. Using 0.0.0.0
  // so mobile can get updates with IP address!
  entry: [
    // Dev server entries are added in `webpack-dev-server` script.
    "./app/client"
  ],

  // Output all files to the /build folder, with the browser path set to `/assets`.
  output: {
    path: path.join(BUILD_PATH, "js"),
    filename: "bundle.js",
    publicPath: '/' + appConfig.relativeRoot + '/assets/js/'
  },
  resolve: {
    // use app for recursive loading like with NODE_PATH
    root: path.resolve(appConfig.projectRoot, "app"),
    modulesDirectories: ["node_modules"],
    extensions:         ["", ".js", ".jsx", ".json"]
  },

  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/),
    new webpack.DefinePlugin({
      "__CLIENT__": true,
      "__SERVER__": false,
      "__DEVELOPMENT__": true,
      "__RELATIVE_ROOT__": JSON.stringify(appConfig.relativeRoot)
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ],

  module: {
    loaders: [
      {
        test:    /\.jsx?$/,
        loaders: ["react-hot", "babel"],
        exclude: LOADER_EXCLUDE_REGEX
      },
      {
        test:    /\.json$/,
        loaders: ["json"],
        exclude: LOADER_EXCLUDE_REGEX
      }
    ]
  }
};
