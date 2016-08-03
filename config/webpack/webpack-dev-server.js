var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./dev.config');
var appConfig = require('../app');

// Server currently used by Gulpfile. Could also be used by node API.
var createWebpackDevServer = function() {

  // Add dev server entry to dev config
  webpackConfig.entry.unshift(
    "webpack-dev-server/client?http://lvh.me:" + (appConfig.port + 2),
    "webpack/hot/only-dev-server"
  );

  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  webpackConfig.plugins.push(new webpack.NoErrorsPlugin());

  webpackConfig.output.publicPath = "http://lvh.me:" + (appConfig.port + 2) + webpackConfig.output.publicPath;

  return new WebpackDevServer(webpack(webpackConfig), {
    // Console output settings
    stats: { colors: true },
    quiet: true,

    // Hot module settings--need to have hot loader and entry in webpack config.
    hot: true,
    lazy: false,

    // Potentially useful for react router routes, not 100% on this
    historyApiFallback: true,

    // Should help with CORS.
    headers: {'Access-Control-Allow-Origin': '*'},

    // If you need webpack to use HTTPS in development, you can point to the cert files here
    // https: {
    //   key: fs.readFileSync(path.resolve(...)),
    //   cert: fs.readFileSync(path.resolve(...)),
    //   ca: fs.readFileSync(path.resolve(...))
    // },

    // Dev server will take priority over express static middleware on `assets` route.
    // This allows both hot loading and a built version without any config change.
    publicPath: webpackConfig.output.publicPath
  });
};

module.exports = createWebpackDevServer;
