// Client honeybadger reporter

import Honeybadger from "honeybadger-js";
import env from "../universalHelpers/env";

Honeybadger.configure({
  api_key: env.HONEYBADGER_API_KEY,
  environment: env.DEPLOY_ENV,
  ssl: true
});

Honeybadger.setContext({
  inBrowser: true
});

const honeybadgerErrorWrapper = (func, store) => {
  if (__DEVELOPMENT__) {
    func(); // don't mess with stack trace in development
  } else {
    try {
      func();
    } catch (error) {
      Honeybadger.notify(error, {
        environment: env.DEPLOY_ENV,
        context: {
          store: store.getState()
        }
      });
      throw error;
    }
  }
};

const throwHoneybadgerError = (error, store) => {
  honeybadgerErrorWrapper(() => { throw error; }, store);
};

export { honeybadgerErrorWrapper, throwHoneybadgerError };
export default Honeybadger;
