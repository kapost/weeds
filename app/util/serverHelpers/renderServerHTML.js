/* eslint-disable max-len */

import _ from "lodash";
import { renderToString } from "react-dom/server";

import { appConfig, clientEnv } from "./config";

import { safeEscapedObjectToWindow } from "../universalHelpers/htmlSafeJson";
import livereloadScript from "./livereloadScript";
import bundleScript from "./bundleScript";
import localAssetPath from "./localAssetPath";

const faviconLink = localAssetPath("favicon.ico");
const cssLink = localAssetPath("app.css");

const renderServerHTML = (store = null, reactResolverPayload = {}, ReactComponent = null) => {
  let componentHTML = "";

  if (!_.isNull(ReactComponent) && appConfig.serverRendering) {
    componentHTML = renderToString(ReactComponent);
  }

  const reduxState = (appConfig.serverRendering && !_.isNull(store)) ? store.getState() : {};

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Weeds Examples</title>
        <link rel="shortcut icon" href="${faviconLink}" type="image/x-icon" />
        <link rel="stylesheet" href="${cssLink}" type="text/css" />
      </head>
      <body>
        <div class="global-top-nav-loading"></div>
        <div id="react-view">${componentHTML}</div>
        <script type="application/javascript">
          window.__REACT_RESOLVER_PAYLOAD__ = ${safeEscapedObjectToWindow(reactResolverPayload)};
          window.__CLIENT_ENV__ = ${JSON.stringify(clientEnv)};
          window.__INITIAL_STATE__ = ${safeEscapedObjectToWindow(reduxState)};
        </script>
        <script type="application/javascript" src="${bundleScript}"></script>
        ${livereloadScript}
      </body>
    </html>
  `;
};

export default renderServerHTML;
