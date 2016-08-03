import { createJwtHelper } from "../universalHelpers/createApiHelper";
import { updateUser } from "user/ducks/userDuck";

const fetchJWTIfNecessary = (store) => {
  if (store.getState().user.fakeToken) {
    return Promise.resolve();
  } else {
    return createJwtHelper(store.getState()).get("/api/user")
      .then((res) => {
        store.dispatch(updateUser(res.data));
      });
  }
};

export default fetchJWTIfNecessary;
