import { appConfig } from "./config";
import assetHostPrefixer from "./assetHostPrefixer";

// Use bundle path based on environment

const localAssetPath = (asset) => {
  let route = `/${appConfig.relativeRoot}/assets/`;

  if (appConfig.env === "production") {
    // Use cache-busted path for production
    route += require("../../../build/static-assets.json")[asset];
  } else {
    // Default route to static assets in express
    route += asset;
  }

  return assetHostPrefixer(route);
};

export default localAssetPath;
