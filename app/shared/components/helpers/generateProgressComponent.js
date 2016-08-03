import _ from "lodash";
import React from "react";

import DefaultLoading from "shared/components/api/defaultLoading";
import DefaultFailed from "shared/components/api/defaultFailed";
import unionProgressState from "shared/helpers/unionProgressState";
import apiObjectShape from "shared/shapes/apiObjectShape";
import { FETCH_PROGRESS_VALUES as progressValues } from "shared/values/apiProgressValues";

const { LOADED, LOADING, INITIAL } = progressValues;

const { objectOf, func, any } = React.PropTypes;

const apiProgress = (apiObjects) => {
  const apiValues = _.values(apiObjects);
  return unionProgressState(...apiValues);
};

const apiData = (apiObjects) => {
  return _.mapValues(apiObjects, (apiObject) => apiObject.data);
};

const generateProgressComponent = ({
  LoadingComponent = DefaultLoading,
  FailedComponent = DefaultFailed,
  getProgress = apiProgress,
  getData = apiData
} = {}) => {
  const ProgressComponent = React.createClass({
    propTypes: {
      component: any.isRequired,
      apiObjects: objectOf(apiObjectShape).isRequired,
      fetchIfNecessary: func.isRequired
    },

    render() {
      switch (this.getProgress()) {
        case LOADED:
          return this.renderLoaded();
        case INITIAL:
        case LOADING:
          return this.renderLoading();
        default:
          return this.renderFailed();
      }
    },

    renderLoaded() {
      const Component = this.props.component;
      return <Component {...this.props} {...this.getData()} />;
    },

    renderLoading() {
      return <LoadingComponent {...this.props} />;
    },

    renderFailed() {
      return <FailedComponent {...this.props} onRetryFetch={this.props.fetchIfNecessary} />;
    },

    getProgress() {
      return getProgress(this.props.apiObjects);
    },

    getData() {
      return getData(this.props.apiObjects);
    }
  });

  return ProgressComponent;
};

export default generateProgressComponent;
