import env from "util/universalHelpers/env";

const envReducer = (state = env, _action) => {
  return { ...state, development: __DEVELOPMENT__, relativeRoot: __RELATIVE_ROOT__ };
};

export default envReducer;
