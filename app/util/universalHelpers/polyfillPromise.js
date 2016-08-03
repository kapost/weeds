/* eslint-disable no-console */

// There are many promise polyfills--we are using Yaku.
//
// This setup file customizes the unhandled rejection event to give more info and be noisier.
//
// https://github.com/ysmood/yaku#unhandled-rejection
// https://github.com/domenic/unhandled-rejections-browser-spec
// https://github.com/stefanpenner/es6-promise/issues/70 (es6-promise missing `unhandledRejection`)

const polyfillPromise = (context) => {
  const Yaku = require("yaku");

  if (__DEVELOPMENT__) {
    Yaku.enableLongStackTrace();
  }

  Yaku.unhandledRejection = (reason, _p) => {
    const err = reason.longStack || reason;
    if (__DEVELOPMENT__) { console.error(err); }
  };

  context.Promise = Yaku;
};

export default polyfillPromise;
