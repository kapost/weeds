import generateResetReducer from "./generateResetReducer";
import { generateInitialState } from "./generateFetchReducer";
import { PAGE_CHANGED } from "../../actions/pageChangedActions";

const defaultInitialState = generateInitialState();

const generateGlobalResetReducer = (initialState = defaultInitialState) => {
  return generateResetReducer(PAGE_CHANGED, initialState);
};

export default generateGlobalResetReducer;
