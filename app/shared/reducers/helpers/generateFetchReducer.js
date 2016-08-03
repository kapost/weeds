// See docs/api.md for usage.

import { FETCH_PROGRESS_VALUES as progressValues } from "shared/values/apiProgressValues";

const paginate = (state, action) => {
  if (action.meta && action.meta.pagination && action.meta.pagination.current > 1) {
    return state.data.concat(action.data);
  } else {
    return action.data;
  }
};

export const generateInitialState = (initialData = {}) => {
  return {
    progress: progressValues.INITIAL,
    data: initialData,
    loadedCount: 0
  };
};

const defaultInitialState = generateInitialState();

const generateFetchReducer = (LOADING, LOADED, FAILED, {
  initialState = defaultInitialState
} = {}) => {
  return (state = initialState, action) => {
    switch (action.type) {
      case LOADING:
        return {
          ...state,
          progress: progressValues.LOADING
        };
      case LOADED:
        return {
          ...state,
          progress: progressValues.LOADED,
          data: paginate(state, action),
          loadedCount: state.loadedCount + 1
        };
      case FAILED:
        return {
          ...state,
          progress: progressValues.FAILED,
          data: action.data
        };
      default:
        return state;
    }
  };
};

export default generateFetchReducer;
