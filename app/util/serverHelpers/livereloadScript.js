import { appConfig } from "./config";

// NOTE: uses nginx config to proxy livereload script.
const livereloadScript = () => {
  if (appConfig.env === "development") {
    return "<script src=\"http://localhost:35729/livereload.js\"></script>";
  } else {
    return "";
  }
};

export default livereloadScript();
