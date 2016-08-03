import { unescapeJsonParse } from "../universalHelpers/htmlSafeJson";

const initialState = unescapeJsonParse(window.__INITIAL_STATE__);

export default initialState;
