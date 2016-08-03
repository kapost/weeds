import _ from "lodash";
import React from "react";
import classNames from "classnames";

const { string } = React.PropTypes;

const FontIcon = React.createClass({
  propTypes: {
    name: string.isRequired,
    className: string
  },

  render() {
    const iconClassName = `fa fa-${this.props.name}`;
    const passDownProps = _.omit(this.props, "name", "className");

    return (
      <i {...passDownProps} className={classNames(this.props.className, iconClassName)}></i>
    );
  }
});

export default FontIcon;
