// Freezes redux store in development mode.
// In strict mode, node and the browser will throw an error if someone attempts to mutate the
// frozen state, which is helpful in preventing mutation bugs.
//
// Insprired by https://github.com/buunguyen/redux-freeze/blob/master/src/middleware.js

// Only freeze in development mode as there is significant performance hit with frozen objects
if (__DEVELOPMENT__) {
  var deepFreeze = require("deep-freeze-strict"); // eslint-disable-line no-var
}

const reduxDevStateFreeze = store => next => {
  // Freeze on initialization
  if (__DEVELOPMENT__) { deepFreeze(store.getState()); } // eslint-disable-line block-scoped-var

  return action => {
    // Freeze on chnage
    const result = next(action);
    if (__DEVELOPMENT__) { deepFreeze(store.getState()); } // eslint-disable-line block-scoped-var
    return result;
  };
};

export default reduxDevStateFreeze;
