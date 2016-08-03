// See docs/api.md for usage.

import _ from "lodash";
import { devWarning, devError } from "util/universalHelpers/devWarn";
import generateValidatePrefix from "./generateValidatePrefix";
import { FETCH_PROGRESS_VALUES as progressValues } from "shared/values/apiProgressValues";

const validatePrefix = generateValidatePrefix();

const validateProgressState = (progressPath, progressState) => {
  if (!progressState) {
    devError(
      `The state at ${progressPath}.progress is undefined. Check the
      \`generateFetchActions\` call`);
  }
};

const generateProgressActions = (prefix) => {
  validatePrefix(prefix);

  const LOADING = `${prefix}_LOADING`;
  const LOADED = `${prefix}_LOADED`;
  const FAILED = `${prefix}_FAILED`;

  const setLoading = () => {
    return {
      type: LOADING
    };
  };

  const setLoaded = (response) => {
    return {
      type: LOADED,
      data: response
    };
  };

  const setFailed = (response) => {
    return {
      type: FAILED,
      data: response
    };
  };

  return { LOADING, LOADED, FAILED, setLoading, setLoaded, setFailed };
};

const checkIfNecessary = (statePath) => {
  return (getState) => {
    const progressState = _.get(getState(), `${statePath}.progress`, false);

    validateProgressState(statePath, progressState);

    if (progressState === progressValues.LOADED || progressState === progressValues.LOADING) {
      return Promise.resolve();
    } else {
      return false;
    }
  };
};

const generateAction = (generateFetchPromise, preloadFunction, actions) => {
  return (...actionArgs) => {
    return (dispatch, getState) => {
      const preloadValue = preloadFunction(getState);

      if (preloadValue) {
        return preloadValue;
      }

      dispatch(actions.setLoading());

      return generateFetchPromise(getState, ...actionArgs)
        .then((response) => {
          dispatch(actions.setLoaded(response.data));
          return true;
        })
        .catch((response) => {
          // can catch bad response vs. real error
          if (_.isError(response)) { throw response; }

          devWarning("Failed to fetch", response);
          dispatch(actions.setFailed(response));
          return false;
        });
    };
  };
};

const generateFetchActions = (prefix, statePath, generateFetchPromise) => {
  const {
    LOADING,
    LOADED,
    FAILED,
    setLoading,
    setLoaded,
    setFailed
  } = generateProgressActions(prefix);

  const fetch = generateAction(generateFetchPromise, () => {},
    { setLoading, setLoaded, setFailed }
  );

  const fetchIfNecessary = generateAction(generateFetchPromise, checkIfNecessary(statePath),
    { setLoading, setLoaded, setFailed }
  );

  return { LOADING, LOADED, FAILED, fetch, fetchIfNecessary };
};

export default generateFetchActions;
