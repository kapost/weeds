import generateResetReducer from "./generateResetReducer";
import { generateInitialState } from "./generateFetchReducer";

const generateFetchResetReducer = (RESET, initialState = {}) => {
  return generateResetReducer(RESET, generateInitialState(initialState));
};

export default generateFetchResetReducer;
