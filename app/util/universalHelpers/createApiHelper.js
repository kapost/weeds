/* eslint-disable quote-props */

import axios from "axios";
import baseUrlBuilder from "./baseUrlBuilder";

const buildDefaultOptions = (state) => {
  const result = {
    timeout: __SERVER__ ? 5000 : 25000,
    headers: {
      "Accept": "application/json"
    }
  };

  const baseUrl = baseUrlBuilder(state);
  if (baseUrl) {
    result.baseURL = baseUrl;
  }
  return result;
};

const createJwtHelper = (state) => {
  return axios.create(buildDefaultOptions(state));
};

// Create axios instance with defaults
const createApiHelper = (state) => {
  const options = {
    ...buildDefaultOptions(state),
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${state.profile.token}`
    }
  };

  return axios.create(options);
};

export { createJwtHelper };
export default createApiHelper;
