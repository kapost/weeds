import { appConfig } from "./config";
import assetHostPrefixer from "./assetHostPrefixer";

// Use bundle path based on environment

const determineBundlePath = () => {
  if (appConfig.env === "production") {
    // Use cache-busted path for production
    return require("../../../build/webpack-assets.json").main.js;
  } else if (appConfig.hot) {
    // Use different host for webpack dev server
    return `http://localhost:${appConfig.port + 2}/${appConfig.relativeRoot}/assets/js/bundle.js`;
  } else {
    // Default route to static assets in express
    return `/${appConfig.relativeRoot}/assets/js/bundle.js`;
  }
};

// Calculate path once to export
const BUNDLE_PATH = assetHostPrefixer(determineBundlePath());

export default BUNDLE_PATH;
