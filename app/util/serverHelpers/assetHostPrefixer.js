import { appConfig } from "./config";

const assetHostPrefixer = (route) => {
  if (appConfig.env === "production") {
    return appConfig.assetHost + route;
  } else {
    return route;
  }
};

export default assetHostPrefixer;
