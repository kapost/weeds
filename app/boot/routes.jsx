// Add any routes you need to this file. All routes should be nested under the "app" route, as
// it handles relativeRoot and authentication.

import React from "react";
import { Route, IndexRoute, Redirect } from "react-router";

import App from "boot/app";

import { pageChanged } from "shared/actions/pageChangedActions";

import Example from "../examples/index";
import EmojisContainer from "../examples/emojis/emojiContainer";

const createRoutes = (store) => {
  const handleClearStores = () => {
    store.dispatch(pageChanged());
  };

  const pageDefaults = {
    onLeave: handleClearStores
  };

  return (
    <Route >
      <Route path={`/${__RELATIVE_ROOT__}`} component={App}>
        <IndexRoute {...pageDefaults} component={Example} />
        <Route {...pageDefaults} path="emojis" component={EmojisContainer} />
        {/* Add more routes here! */}
      </Route>
      <Redirect from="*" to={`/${__RELATIVE_ROOT__}`} />
    </Route>
  );
};

export default createRoutes;
