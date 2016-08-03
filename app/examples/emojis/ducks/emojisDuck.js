import axios from "axios";

import generateFetchActions from "shared/actions/helpers/generateFetchActions";
import generateFetchReducer from "shared/reducers/helpers/generateFetchReducer";

const generateFetchPromise = () => {
  return axios.get("https://api.github.com/emojis");
};

export const {
  LOADING,
  LOADED,
  FAILED,
  fetchIfNecessary
} = generateFetchActions("weeds/examples/EMOJIS", "emojis", generateFetchPromise);

const reducer = generateFetchReducer(LOADING, LOADED, FAILED);
export default reducer;
