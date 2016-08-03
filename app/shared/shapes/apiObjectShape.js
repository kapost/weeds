import _ from "lodash";
import React from "react";

import { FETCH_PROGRESS_VALUES as progressValues } from "shared/values/apiProgressValues";

const { shape, oneOf, oneOfType, array, object } = React.PropTypes;

const apiObjectShape = shape({
  progress: oneOf(_.keys(progressValues)).isRequired,
  data: oneOfType([array, object]).isRequired
});

export default apiObjectShape;
