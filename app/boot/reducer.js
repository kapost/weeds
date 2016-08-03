// Primary reducer for the app.
// All reducers neeed to be rolled up to this parent.

import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import env from "shared/reducers/envReducer";
import request from "shared/reducers/requestReducer";
import user from "user/ducks/userDuck";
import emojis from "../examples/emojis/ducks/emojisDuck";

const appReducer = combineReducers({
  routing: routerReducer, // `routing` key is reserved for react-router-redux
  env,
  request,
  user,
  emojis
});

export default appReducer;
