import React from "react";
import ReactDOM from "react-dom";

if (__DEVELOPMENT__) {
  const a11y = require("react-a11y-alt").default;

  // These rules come from the romeovs/react-a11y docs. To add/remove rules,
  // refer to: https://github.com/romeovs/react-a11y/tree/master/docs/rules
  a11y(React, ReactDOM, {
    rules: {
      "img-uses-alt": "warn",
      "mouse-events-map-to-key-events": "warn",
      "no-unsupported-elements-use-aria": "warn",
      "onclick-uses-tabindex": "warn"
    }
  });
}
