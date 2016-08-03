const generateResetReducer = (RESET, resetState) => {
  return (state = {}, action) => {
    switch (action.type) {
      case RESET:
        return {
          ...state,
          ...resetState
        };
      default:
        return state;
    }
  };
};

export default generateResetReducer;
