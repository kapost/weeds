import { SET_HOST, SET_ORIGINAL_URL } from "../actions/requestActions";

const requestReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_HOST:
      return {
        ...state,
        host: action.host
      };
    case SET_ORIGINAL_URL:
      return {
        ...state,
        originalUrl: action.originalUrl
      };
    default:
      return state;
  }
};

export default requestReducer;
