/* eslint-disable no-console */

import _ from "lodash";
import configureMockStore from "redux-mock-store";

import React from "react";
import { Resolver } from "react-resolver";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

// Use root reducer for initial app state in `provideStore`
import appReducer from "boot/reducer";

// Export redux-mock-store with middleware
const mockStore = configureMockStore([thunk]);

// Private, use `withMockData` to generate a new object with additional contents
// Add default data as needed (profile, env)
const mockStoreFixture = {
  env: {
    HOST: "localhost"
  },
  request: {
    host: "test.localhost"
  }
};

const extendMockState = (additionalData = {}) => {
  return _.merge({}, mockStoreFixture, additionalData);
};

// Wraps a component with a react-redux Provider (putting store on context).
const provideStore = (element, initialState = {}) => {
  const store = createStore(appReducer, initialState, applyMiddleware(thunk));

  return (
    <Provider store={store}>
      {element}
    </Provider>
  );
};

const resolveWithStore = (reactElement, state, callback) => {
  const container = provideStore(reactElement, state);

  Resolver
    .resolve(() => container)
    .then(({ Resolved }) => {
      if (callback) callback(Resolved);
    })
    .catch((err) => {
      console.log(err);
    });
};

const resolveWithMockStore = (reactElement, state, callback) => {
  const store = mockStore(state);

  Resolver
    .resolve(() => <Provider store={store}>{reactElement}</Provider>)
    .then(({ Resolved }) => {
      if (callback) callback(Resolved, store);
    })
    .catch((err) => {
      console.log(err);
    });
}

export { mockStore, provideStore, extendMockState, resolveWithStore, resolveWithMockStore };
