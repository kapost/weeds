/* eslint-disable no-console */

const runIfDev = (callback) => {
  if (__DEVELOPMENT__) {
    callback();
  }
};

const devWarning = (...args) => {
  runIfDev(() => {
    console.warn(...args);
  });
};

const devError = (message) => {
  runIfDev(() => {
    throw new Error(message);
  });
};

export { devWarning, devError };
