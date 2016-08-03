// We build a fully qualified URL for each API request on the server and this helper provides
// the base part (protocol, host, and port).


const build = (state) => {
  if (state.request && state.request.host) {
    return `http://${state.request.host}`;
  } else if (__SERVER__) {
    throw new Error("No x-forwarded-host header was found.");
  } else {
    // No x-forwarded-host header set by client. Use relative URL
    return "";
  }
};

export default build;
