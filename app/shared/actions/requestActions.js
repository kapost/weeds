export const SET_ORIGINAL_URL = "REQUEST_SET_ORIGINAL_URL";
export const SET_HOST = "REQUEST_SET_HOST";

export const setHost = (host) => {
  return {
    type: SET_HOST,
    host: host
  };
};

export const setOriginalUrl = (originalUrl) => {
  return {
    type: SET_ORIGINAL_URL,
    originalUrl: originalUrl
  };
};
