export const UPDATE_AUTH_PROFILE = "weeds/user/UPDATE_AUTH_PROFILE";

const reducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_AUTH_PROFILE:
      return {
        ...state,
        ...action.user
      };
    default:
      return state;
  }
};

export default reducer;

export const updateUser = (response) => {
  return {
    type: UPDATE_AUTH_PROFILE,
    user: response
  };
};
