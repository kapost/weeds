// Promise polyfill
import polyfillPromise from "util/universalHelpers/polyfillPromise";
polyfillPromise(window);

// React / react-router / redux imports
import React from "react";
import { Router, browserHistory } from "react-router";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { syncHistoryWithStore } from "react-router-redux";
import { Resolver } from "react-resolver";
import thunk from "redux-thunk";

// App entry and utils
import createRoutes from "./boot/routes";
import appReducer from "./boot/reducer";
import initialState from "./util/clientHelpers/initialState";
import initialReactResolverPayload from "./util/clientHelpers/initialReactResolverPayload";
import { throwHoneybadgerError } from "./util/clientHelpers/honeybadger";
import reduxDevStateFreeze from "./util/universalHelpers/reduxDevStateFreeze";
import fetchJWTIfNecessary from "./util/clientHelpers/fetchJWTIfNecessary";
import "./util/universalHelpers/a11y";

// Hydrate boot objects with initial data and store.
const store = createStore(appReducer, initialState, applyMiddleware(reduxDevStateFreeze, thunk));
const history = syncHistoryWithStore(browserHistory, store);
const routes = createRoutes(store);

// Render the app and dispatch any browser-feature-specific actions
const boot = () => {
  Resolver.render(
    () => {
      return (
        <Provider store={store} key="provider">
          <Router children={routes} history={history} />
        </Provider>
      );
    },
    document.getElementById("react-view"),
    initialReactResolverPayload
  );
};

// Error handling methods
const handlePromiseError = (error) => {
  throwHoneybadgerError(error, store);
};

// Run the app
fetchJWTIfNecessary(store)
  .then(boot)
  .catch(handlePromiseError);
