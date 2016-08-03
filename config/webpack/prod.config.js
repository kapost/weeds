var path = require('path');
var webpack = require('webpack');
var WebpackAssetsPlugin = require('assets-webpack-plugin');

var appConfig = require('../app');
var clientEnv = require("../client/env");

var BUILD_PATH = path.join(appConfig.projectRoot, 'build');
var LOADER_EXCLUDE_REGEX = /node_modules\/[^@]/;

module.exports = {
  devtool: "source-map",

  // Config should be in context of project
  context: path.resolve(appConfig.projectRoot),

  // Entry points, using some dev server and hot loading magic. Using 0.0.0.0
  // so mobile can get updates with IP address!
  entry: [
    './app/client'
  ],

  // Output all files to the /build folder, with the browser path set to `/assets`.
  output: {
    path: path.join(BUILD_PATH, 'js'),
    filename: 'bundle.[hash].js',
    sourceMapFilename: 'bundle.[hash].js.map',
    publicPath: '/' + appConfig.relativeRoot + '/assets/js/'
  },

  resolve: {
    // use app for recursive loading like with NODE_PATH
    root: path.resolve(appConfig.projectRoot, 'app'),
    modulesDirectories: ['node_modules'],
    extensions:         ['', '.js', '.jsx', '.json']
  },

  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": '"production"',
      "__CLIENT__": true,
      "__SERVER__": false,
      "__DEVELOPMENT__": false,
      "__RELATIVE_ROOT__": JSON.stringify(appConfig.relativeRoot)
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new WebpackAssetsPlugin({
      path: BUILD_PATH
    })
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        exclude: LOADER_EXCLUDE_REGEX
      },
      {
        test:    /\.json$/,
        loaders: ['json'],
        exclude: LOADER_EXCLUDE_REGEX
      }
    ]
  }
};
