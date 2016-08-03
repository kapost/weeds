// See docs/api.md for usage.

import _ from "lodash";

import { WRITE_PROGRESS_VALUES as progressValues } from "shared/values/apiProgressValues";

export const generateInitialState = (initialData = {}) => {
  return {
    apiProgress: progressValues.INITIAL,
    apiError: null,
    data: initialData,
    backup: null,
    lastRequestTimestamp: null
  };
};

const defaultOptions = {
  onStarted: (state, action) => {
    let data;

    if (_.isPlainObject(state.data) && _.isPlainObject(action.data)) {
      data = { ...state.data, ...action.data };
    } else {
      data = action.data;
    }

    return { data };
  },

  onSucceeded: (_state, action) => {
    return { data: action.data };
  },

  onFailed: (state, _action) => {
    return { data: state.backup };
  }
};

const generateWriteReducer = (STARTED, SUCCEEDED, FAILED, options = {}) => {
  options = _.extend({}, defaultOptions, options);

  const initialState = options.initialState || generateInitialState();

  return (state = initialState, action) => {
    switch (action.type) {
      case STARTED:
        return {
          ...state,
          apiError: null,
          ...options.onStarted(state, action),
          apiProgress: progressValues.STARTED,
          backup: state.data,
          lastRequestTimestamp: action.timestamp
        };
      case SUCCEEDED:
        return {
          ...state,
          apiError: null,
          ...options.onSucceeded(state, action),
          apiProgress: progressValues.SUCCEEDED,
          backup: null
        };
      case FAILED:
        return {
          ...state,
          apiError: action.data,
          ...options.onFailed(state, action),
          apiProgress: progressValues.FAILED,
          backup: null
        };
      default:
        return state;
    }
  };
};

export default generateWriteReducer;
