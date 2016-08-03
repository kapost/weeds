/* eslint-disable consistent-return */

// Environment loader for server and client
// Note that only exposed environment variables from `config/client/env` are available here.

const getClientEnv = () => {
  if (__SERVER__) {
    return require("../serverHelpers/config").clientEnv;
  } else if (__CLIENT__) {
    /* istanbul ignore next */
    return window.__CLIENT_ENV__;
  }
};

export default getClientEnv();
