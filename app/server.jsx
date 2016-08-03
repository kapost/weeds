// Promise polyfill that ensures unhandled errors are thrown.
import polyfillPromise from "util/universalHelpers/polyfillPromise";
polyfillPromise(global);

// Node
import path from "path";
import express from "express";

//  Server helpers
import { appConfig } from "./util/serverHelpers/config";
import serverLog from "./util/serverHelpers/serverLog";
import handleRequest from "./util/serverHelpers/handleRequest";
import "./util/universalHelpers/a11y";

// Require development only dependencies
/* istanbul ignore if  */
if (__DEVELOPMENT__) {
  var myip = require("quick-local-ip"); // eslint-disable-line no-var
  var color = require("cli-color"); // eslint-disable-line no-var
}

const app = express();

// Serve up built files at path `${relativeRoot}/assets`
app.use(
  `/${appConfig.relativeRoot}/assets`,
  express.static(path.join(__dirname, "..", "build"))
);

// Handle all other routes through router
app.use(handleRequest);

// Start server on port
app.listen(appConfig.port, () => {
  /* istanbul ignore if  */
  if (appConfig.env === "development" && appConfig.hot) {
    const address = color.green(`${myip.getLocalIP4()}:${appConfig.port}`); // eslint-disable-line
    serverLog(`==> 📱  Dev server running on network address ${address}`);
  } else {
    serverLog(`==> 🚀  Node server started listening on ${appConfig.port}`);
  }
});

export default app;
