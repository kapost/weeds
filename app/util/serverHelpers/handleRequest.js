// React and redux
import React from "react";
import { match, RouterContext } from "react-router";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { Resolver } from "react-resolver";

// Error handling
import ythrow from "yaku/lib/throw"; // throw error outside of promise in dev

// Config
import { appConfig } from "./config";

// App entry
import createRoutes from "boot/routes";
import appReducer from "boot/reducer";
import reduxDevStateFreeze from "../universalHelpers/reduxDevStateFreeze";

// Server helpers
import serverLog from "./serverLog";
import { honeybadgerErrorWrapper, throwHoneybadgerError } from "./honeybadger";
import renderServerHTML from "./renderServerHTML";
import fetchJWT from "./fetchJWT";

import { updateUser } from "user/ducks/userDuck";
import { setHost, setOriginalUrl } from "shared/actions/requestActions";

// Main request handler, called through `run` below.
class RequestHandler {
  constructor(req, res) {
    this.req = req;
    this.res = res;
    this.store = createStore(appReducer, applyMiddleware(reduxDevStateFreeze, thunk));
    this.store.dispatch(setOriginalUrl(this.req.originalUrl));
    this.store.dispatch(setHost(this.req.headers["x-forwarded-host"]));

    // Bind all callback methods to context
    this.return200 = this.return200.bind(this);
    this.return302 = this.return302.bind(this);
    this.return404 = this.return404.bind(this);
    this.return500 = this.return500.bind(this);
    this.matchRoute = this.matchRoute.bind(this);
    this.onAuthSuccess = this.onAuthSuccess.bind(this);
    this.renderReactTree = this.renderReactTree.bind(this);
    this.renderHTML = this.renderHTML.bind(this);
    this.onUnauthorized = this.onUnauthorized.bind(this);
    this.onPromiseFailure = this.onPromiseFailure.bind(this);
    this.onHoneybadgerFailure = this.onHoneybadgerFailure.bind(this);
  }

  run() {
    return fetchJWT(this.req, this.store)        // fetch JWT and save req host in store
             .then(this.onAuthSuccess)           // save auth in store for routing / api usage
             .then(this.matchRoute)              // match req with routes (through react-router)
             .catch(this.onUnauthorized)         // redirect to sign-in if error is 401
             .catch(this.onPromiseFailure)       // catch errors and report to honeybadger
             .catch(this.onHoneybadgerFailure);  // catch reporting errors so response doesn't hang
  }

  matchRoute() {
    const routes = createRoutes(this.store);

    match({ routes, location: this.req.url }, (err, redirectLocation, renderProps) => {
      if (err) {
        throw err;
      } else if (redirectLocation) {
        this.return302(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        this.render(renderProps);
      } else {
        this.return404();
      }
    });
  }

  render(renderProps) {
    if (appConfig.serverRendering) {
      this.fetchDataAndRender(renderProps);
    } else {
      this.return200(renderServerHTML());
    }
  }

  fetchDataAndRender(renderProps) {
    return Resolver.resolve(this.renderReactTree(renderProps))
      .then(this.renderHTML)
      .catch(this.onPromiseFailure)
      .catch(this.onHoneybadgerFailure);
  }

  renderReactTree(renderProps) {
    return () => {
      return (
        <Provider store={this.store} key="provider">
          <RouterContext {...renderProps} />
        </Provider>
      );
    };
  }

  renderHTML({ Resolved, data }) {
    const html = renderServerHTML(this.store, data, <Resolved />);
    this.return200(html);
  }

  return200(html) {
    this.res.status(200).end(html);
  }

  return302(redirectUrl) {
    this.res.redirect(302, redirectUrl);
  }

  return404() {
    this.res.status(404).end("Not found.");
  }

  return500() {
    this.res.status(500).end("Internal server error");
  }

  onAuthSuccess(auth) {
    this.store.dispatch(updateUser(auth)); // populate store with auth response
  }

  onUnauthorized(error) {
    if (error.response && error.response.status === 401) {
      const redirectUrl = `http://${this.req.hostname}${this.req.originalUrl}`;
      this.return302(`${redirectUrl}/signin/page/for/your/app`);
    } else {
      throw error;
    }
  }

  onPromiseFailure(error) {
    return throwHoneybadgerError(error, this.return500, {
      store: this.store.getState(),
      caughtError: error
    });
  }

  // If honeybadger fails too, don't hang.
  onHoneybadgerFailure(err) {
    if (__DEVELOPMENT__) {
      ythrow(err);
    } else {
      this.return500();
      serverLog("HONEYBADGER ERROR: could not report error to honeybadger.");
      console.log(err); // eslint-disable-line no-console
    }
  }
}

// Entry point for node request callback. We wrap the entire request in a honeybadger error wrapper,
// which will catch all non-promise errors.
const runRequestHandler = (req, res) => {
  return () => {
    res.type("html");
    new RequestHandler(req, res).run();
  };
};

const curriedRender500 = (res) => {
  return () => { res.status(500).end("Internal server error"); };
};

const handleRequest = (req, res) => {
  honeybadgerErrorWrapper(runRequestHandler(req, res), curriedRender500(res), {
    message: "Failed to create store before auth and route"
  });
};

export { RequestHandler };
export default handleRequest;
