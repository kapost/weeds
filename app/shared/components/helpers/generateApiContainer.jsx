// See docs/api.md for usage.

import _ from "lodash";
import React from "react";
import { resolve } from "react-resolver";

import { devError } from "util/universalHelpers/devWarn";
import generateProgressComponent from "./generateProgressComponent";

const { string, array, object, func, oneOfType, shape } = React.PropTypes;

const apiShape = shape({
  progress: string.isRequired,
  data: oneOfType([object, array]).isRequired
});

// Curried Api fetching function used by both `resolve` and `componentDidMount`. Curry is for the
// helpful error.
const generateFetchActions = (ComponentName) => {
  return (props) => {
    if (!_.isFunction(props.fetchIfNecessary)) {
      devError(
        `${ComponentName}Container was not passed a fetchIfNecessary action and failed to fetch. ` +
        "Add the function to `mapDispatchToProps`."
      );
    }

    return props.fetchIfNecessary(props);
  };
};

const generateApiContainer = (className, { requiredApiKeys = [], fetchOnServer = true }) => {
  const apiPropTypes = {};

  _.each(requiredApiKeys, (apiKey) => {
    apiPropTypes[apiKey] = apiShape.isRequired;
  });

  // Return curried function to wrap other components (similar to ES7 decorator)
  return (Component, { ProgressComponent = generateProgressComponent() } = {}) => {
    const displayName = `${Component.displayName}ApiContainer`;
    const fetchIfNecessary = generateFetchActions(Component.displayName);

    const ApiContainer = React.createClass({
      displayName: displayName,

      propTypes: {
        ...apiPropTypes,
        fetchIfNecessary: func.isRequired,
        reset: func
      },

      componentDidMount() {
        fetchIfNecessary(this.props);
      },

      componentWillUnmount() {
        if (this.props.reset) {
          this.props.reset();
        }
      },

      render() {
        return (
          <div className={className}>
            <ProgressComponent {...this.props}
                               component={Component}
                               apiObjects={this.apiObjects()} />
          </div>
        );
      },

      apiObjects() {
        return _.pick(this.props, requiredApiKeys);
      }
    });

    if (fetchOnServer && __SERVER__) {
      // Use react-resolver to prefetch on server (reusing `fetchIfNecessary` function)
      return resolve(`${displayName}Resolved`, fetchIfNecessary)(ApiContainer);
    } else {
      // Fetch on componentDidMount instead
      return ApiContainer;
    }
  };
};

export default generateApiContainer;
