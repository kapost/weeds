import { createJwtHelper } from "../universalHelpers/createApiHelper";

// TODO: cache response in node memory (with TTL matching JWT token) for performance
const jwtPromise = (req, store) => {
  // Make request without cookie if necessary.
  // Express requires that the headers not have null values
  // const headers = (req.headers.cookie) ? { Cookie: req.headers.cookie } : {};

  return createJwtHelper(store.getState())
    .get("/api/user")
    .then((response) => {
      return Promise.resolve(response.data.response);
    });
};

export default jwtPromise;
