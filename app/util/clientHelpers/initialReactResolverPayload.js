import { unescapeJsonParse } from "../universalHelpers/htmlSafeJson";

const initialReactResolverPayload = unescapeJsonParse(window.__REACT_RESOLVER_PAYLOAD__);

export default initialReactResolverPayload;
