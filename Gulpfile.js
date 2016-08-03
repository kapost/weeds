/* eslint-disable */

var path = require("path");
var gulp = require("gulp");
var filesToJson = require("gulp-files-to-json");
var sass = require("gulp-sass");
var svgmin = require("gulp-svgmin");
var gutil = require("gulp-util");
var hash = require("gulp-hash");
var autoprefixer = require("gulp-autoprefixer");
var webpack = require("webpack");
var _ = require("lodash");

var config = require("./config/app");
var webpackProdConfig = require("./config/webpack/prod.config")

// development only dependencies
if (process.env.NODE_ENV !== "production") {
  var watch = require("gulp-watch");
  var livereload = require("gulp-livereload");
  var sourcemaps = require("gulp-sourcemaps");
  var nodemon = require("gulp-nodemon")

  var webpackDevConfig = require("./config/webpack/dev.config")
  var createWebpackDevServer = require("./config/webpack/webpack-dev-server");
  var webpackDevServerPort = config.port + 2;
}

var buildDirectory = "./build/"
var staticDirectory = "./app/assets/static/"
var svgDirectory = "./app/assets/svg/"
var sassDirectory = "./app/";
var sassEntry = sassDirectory + "/boot/app.scss";

// Configurations
// --------------------------------------------------------------------------------

var sassConfig = {
  errLogToConsole: true,
  includePaths: [
    path.join(__dirname, "app"),
    path.join(__dirname, "node_modules") // for vendor files through npm
  ]
};

var autoprefixerConfig = {
  browsers: ["last 2 versions", "IE >= 10", "> 5%", "Firefox ESR"]
};

var nodemonConfig = {
  script: "index.js",
  watch: (config.serverRendering) ? ["app/", "config/"] : ["app/server.jsx", "app/util/serverHelpers/", "config/"],
  ignore: ["**Spec.js"],
  ext: "js jsx",
  env: { NODE_PATH: "./app" }, // match webpack config resolve.root
  execMap: {
    "js": "node --harmony"
  }
};

var svgoConfig = {
  plugins: [
    {
      removeDimensions: true
    }
  ]
}


// Helper functions
// --------------------------------------------------------------------------------

var gulpErrorHandler = function(err) {
  var displayErr = gutil.colors.red(err);
  gutil.log(displayErr);
  gutil.beep();
};

// Custom parser for filename with directory under svg folder.
// Used by gulp-file-to-json for mapping
var filesToJsonNameParser = function(name) {
  var regex = /(?:app\/assets\/svg\/)(.*)/;
  var pathKey = path.basename(name, ".svg");

  var dirnameMatch = regex.exec(path.dirname(name));
  if (dirnameMatch != null) {
    pathKey = dirnameMatch[1] + "/" + pathKey;
  }
  return pathKey;
}


// Tasks
// --------------------------------------------------------------------------------

// Styles
//
// Build sass files with sourcemaps, autoprefixer, and livereload.
// Livereload script is included in the dev HTML through `serverHelpers/livereloadScript`
// for livereload over network addresses (0.0.0.0)
// ----------------------------------------
gulp.task("styles-dev", function () {
  gulp.src(sassEntry)
    .pipe(sourcemaps.init())
    .pipe(sass(sassConfig)
    .on("error", gulpErrorHandler))
    .pipe(autoprefixer(autoprefixerConfig))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(buildDirectory))
    .pipe(livereload());
});

gulp.task("styles-build", function () {
  return gulp.src(sassEntry)
    .pipe(sass(sassConfig).on("error", gulpErrorHandler))
    .pipe(autoprefixer(autoprefixerConfig))
    .pipe(gulp.dest(buildDirectory));
});

gulp.task("styles-build-production", function () {
  return gulp.src(sassEntry)
    .pipe(sass(sassConfig).on("error", gulpErrorHandler))
    .pipe(autoprefixer(autoprefixerConfig))
    .pipe(hash({ hashLength: 16 }))
    .pipe(gulp.dest(buildDirectory))
    .pipe(hash.manifest("static-assets.json"))
    .pipe(gulp.dest(buildDirectory));
});

// // watch all files and rerun build step if necessary
gulp.task("styles-watch", function() {
  livereload.listen();
  gulp.watch(sassDirectory + "**/*.scss", ["styles-dev"]);
});


// Static files
//
// Copies all static files to `build`.
// ----------------------------------------
gulp.task("copy-static", function() {
  return gulp.src(staticDirectory + "**/*")
             .pipe(gulp.dest(buildDirectory));
});

gulp.task("copy-static-production", function() {
  return gulp.src(staticDirectory + "**/*")
             .pipe(hash({ hashLength: 16 }))
             .pipe(gulp.dest(buildDirectory))
             .pipe(hash.manifest("static-assets.json"))
             .pipe(gulp.dest(buildDirectory));
});

gulp.task("copy-static-watch", function() {
  gulp.src(staticDirectory + "**/*")
    .pipe(watch(staticDirectory + "**/*"))
    .pipe(gulp.dest(buildDirectory));
});


// SVG Json File
//
// Task to generate svg/index.json file containing keys pointing to optimised svg strings
// Helpful for isomorphic requring in node and client. NOTE: this is less intelligent that
// webpack loading so don't include a bunch of files you don't need, as this will increase client
// weight. I wish `svg-loader` worked in node land.
//
// Example:
//
// { "test/icon" : "<svg width=\"364\" height=\"191\ ..." }
// ----------------------------------------
gulp.task("create-svg-json", function() {
  return gulp.src(svgDirectory + "**/*.svg")
             .pipe(svgmin(svgoConfig))
             .pipe(filesToJson("index.json", { nameParser: filesToJsonNameParser }))
             .pipe(gulp.dest(svgDirectory))
});

gulp.task("create-svg-json-watch", function() {
  gulp.src(svgDirectory + "**/*.svg")
   .pipe(watch(svgDirectory + "**/*.svg", function() {
      gulp.start("create-svg-json");
    }));
});


// Webpack
//
// Compiles all the client assets using the dev webpack config. The dev server
// takes the configured dev server and listens on the network address.
// ----------------------------------------
var webpackBuildFunction = function(webpackConfig) {
  return function(callback) {
      // run webpack
    webpack(webpackConfig, function(err, stats) {

      if (err) throw new gutil.PluginError("webpack", err);
      gutil.log("[webpack]", stats.toString({
        colors: true,
        chunks: false
      }));

      if (!webpackConfig.watch) {
        callback();
      }
    });
  };
};


gulp.task("webpack", webpackBuildFunction(webpackDevConfig));
gulp.task("webpack-production", webpackBuildFunction(webpackProdConfig));

gulp.task("webpack-watch", webpackBuildFunction(
  _.extend({}, webpackDevConfig, { watch: true }))
);

gulp.task("webpack-dev-server", function() {
  createWebpackDevServer().listen(webpackDevServerPort, "0.0.0.0", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
  });
});


// Nodemon
//
// Kick off the server with config.
// ----------------------------------------
gulp.task("nodemon", function () {
  nodemon(nodemonConfig)
    .on("restart", function () {
      gutil.log("==> 🔄  Nodemon restarting server.");
    })
});

// Task Groups
// ----------------------------------------
// remove this and put the svg watch back in tasks once we update to Gulp 4
// (with series and parallel support). We need a prebuild step as everything runs in parallel
// and webpack depends on the `create-svg-json` task. See package.json scripts
gulp.task("prebuild", [
  "create-svg-json"
]);

gulp.task("default", [
  "copy-static-watch",
  "styles-dev",
  "styles-watch",
  "webpack-watch",
  "nodemon"
]);

gulp.task("development-hot", [
  "copy-static-watch",
  "styles-dev",
  "styles-watch",
  "nodemon",
  "webpack-dev-server"
]);

gulp.task("build", [
  "copy-static",
  "styles-build",
  "webpack"
]);

gulp.task("build-production", [
  "copy-static-production",
  "styles-build-production",
  "webpack-production"
]);

gulp.task("server", [
  "nodemon"
]);

// Hacks
// --------------------------------------------------------------------------------

// Fix for double `control-c` exit, which fixes `npm start`
// Check on https://github.com/JacksonGariety/gulp-nodemon/pull/91 to remove in future.
process.once("SIGINT", function() { process.exit(0); });
