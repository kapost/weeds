import keyMirror from "keymirror";

const FETCH_PROGRESS_VALUES = keyMirror({
  INITIAL: null,
  LOADING: null,
  LOADED: null,
  FAILED: null
});

const WRITE_PROGRESS_VALUES = keyMirror({
  INITIAL: null,
  STARTED: null,
  SUCCEEDED: null,
  FAILED: null
});

export { FETCH_PROGRESS_VALUES, WRITE_PROGRESS_VALUES };
