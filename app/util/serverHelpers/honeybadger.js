/* eslint-disable consistent-return */
// Server honeybadger reporter

import _ from "lodash";
import Honeybadger from "honeybadger";
import { clientEnv } from "./config";
import ythrow from "yaku/lib/throw"; // throw error outside of promise in dev

const honeybadger = new Honeybadger({
  apiKey: clientEnv.HONEYBADGER_API_KEY,
  server: {
    environment_name: clientEnv.DEPLOY_ENV
  },
  logger: console,
  developmentEnvironments: ["development", "test"] // ignore reporting if environment in this list
});

const honeybadgerErrorWrapper = (func, handler = null, context = {}) => {
  if (__DEVELOPMENT__) {
    return func(); // don't mess with stack trace in development
  } else {
    try {
      return func();
    } catch (error) {
      honeybadger.send(error, {
        context: context
      });

      // Allow server to handle errors (with response for example)
      if (_.isFunction(handler)) {
        handler(error);
      } else {
        throw error;
      }
    }
  }
};

const throwHoneybadgerError = (error, handler, context = {}) => {
  return honeybadgerErrorWrapper(() => {
    if (__DEVELOPMENT__) {
      ythrow(error); // throw outside of promises / honeybadger if in development.
    } else {
      throw error;
    }
  }, handler, context);
};

export { honeybadgerErrorWrapper, throwHoneybadgerError };
export default honeybadger;
