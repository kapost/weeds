// Setup inspired by Enzyme initialization guide
// http://airbnb.io/enzyme/docs/guides/jsdom.html

const _ = require("lodash");
const jsdom = require("jsdom").jsdom;

global.document = jsdom('<!doctype html><html><body><div id="react-view"></div></body></html>', {
  url: `https://localhost/${__RELATIVE_ROOT__}` // Set url for react-router
});
global.window = document.defaultView;
global.navigator = _.extend(window.navigator, {
  userAgent: "node.js"
});

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === "undefined") {
    global[property] = document.defaultView[property];
  }
});
