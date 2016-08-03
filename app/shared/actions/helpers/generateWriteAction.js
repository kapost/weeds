// See docs/api.md for usage.

import _ from "lodash";
import { devWarning, devError } from "util/universalHelpers/devWarn";
import generateValidatePrefix from "./generateValidatePrefix";

const validatePrefix = generateValidatePrefix();

const validateTimestamp = (timestamp, statePath) => { // eslint-disable consistent-ret
  if (timestamp === 0) {
    return devError(
      `The apiObject at ${statePath} does not exist. Check the
      \`generateWriteAction\` call`);
  } else {
    return timestamp;
  }
};

const getApiObjectTimestamp = (getState, statePath) => {
  const timestamp = _.get(getState(), `${statePath}.lastRequestTimestamp`, 0);
  return validateTimestamp(timestamp, statePath);
};

const latestRequest = (getState, statePath, requestTimestamp) => {
  return (requestTimestamp >= getApiObjectTimestamp(getState, statePath));
};

const generateProgressActions = (prefix) => {
  validatePrefix(prefix);

  const STARTED = `${prefix}_STARTED`;
  const SUCCEEDED = `${prefix}_SUCCEEDED`;
  const FAILED = `${prefix}_FAILED`;

  const setStarted = (data, timestamp) => {
    return { type: STARTED, data, timestamp };
  };

  const setSucceeded = (data, originalData) => {
    return { originalData, type: SUCCEEDED, data };
  };

  const setFailed = (data, originalData) => {
    return { originalData, type: FAILED, data };
  };

  return { STARTED, SUCCEEDED, FAILED, setStarted, setSucceeded, setFailed };
};

const generateAction = (statePath, apiPromiseGenerator, actions) => {
  return (actionData, options = {}) => { // action
    return (dispatch, getState) => { // thunk
      const timestamp = Date.now();

      dispatch(actions.setStarted(actionData, timestamp));

      return apiPromiseGenerator(getState, actionData)
        .then((response) => {
          if (latestRequest(getState, statePath, timestamp)) {
            dispatch(actions.setSucceeded(response.data, actionData));
            if (options.onSucceeded) {
              options.onSucceeded(dispatch, getState, response, actionData, options);
            }
          }
        })
        .catch((response) => {
          if (_.isError(response)) { throw response; }

          if (latestRequest(getState, statePath, timestamp)) {
            devWarning("Failed to perform write action", response);
            dispatch(actions.setFailed(response, actionData));

            if (options.onFailed) {
              options.onFailed(dispatch, getState, response, actionData, options);
            }
          }
        });
    };
  };
};

const generateWriteAction = (prefix, statePath, apiPromiseGenerator) => {
  const {
    STARTED,
    SUCCEEDED,
    FAILED,
    setStarted,
    setSucceeded,
    setFailed
  } = generateProgressActions(prefix);

  const action = generateAction(
    statePath,
    apiPromiseGenerator,
    { setStarted, setSucceeded, setFailed }
  );

  return { STARTED, SUCCEEDED, FAILED, action };
};

export default generateWriteAction;
