import _ from "lodash";

const reduceReducers = (...reducers) => {
  return (state, action) => {
    if (_.isUndefined(state)) {
      // get initial state
      const states = _.map(reducers, (reducer) => reducer(state, action));
      return _.extend({}, ...states);
    } else {
      return _.reduce(reducers, (s, reducer) => {
        return _.extend({}, s, reducer(s, action));
      }, _.cloneDeep(state));
    }
  };
};

export default reduceReducers;
