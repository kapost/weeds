import _ from "lodash";

import { FETCH_PROGRESS_VALUES as progressValues } from "shared/values/apiProgressValues";
import { devError } from "util/universalHelpers/devWarn";

const { LOADING, LOADED, FAILED, INITIAL } = progressValues;

const stateFromParam = (objectOrState) => {
  let state = objectOrState;

  if (_.isObject(state)) {
    state = state.progress;
  }

  if (__DEVELOPMENT__ && !_.some(progressValues, value => value === state)) {
    devError(
      `Invalid progress value "${state}". You must pass a valid progress state string or object.`
    );
  }

  return state;
};

const unionProgressState = (...loadedStates) => {
  const states = _.map(loadedStates, stateFromParam);

  if (_.every(states, state => state === LOADED)) {
    return LOADED;
  } else if (_.some(states, state => state === FAILED)) {
    return FAILED;
  } else if (_.some(states, state => state === LOADING)) {
    return LOADING;
  } else {
    return INITIAL;
  }
};

export default unionProgressState;
