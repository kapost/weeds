import { appConfig } from "./config";

const serverLog = function(message) {
  if (appConfig.env === "development") {
    console.log(`[ server ] ${message}`); // eslint-disable-line no-console
  }
};

export default serverLog;
