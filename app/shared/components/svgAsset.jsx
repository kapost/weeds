import React from "react";
import SvgIndex from "assets/svg/index";

const { string } = React.PropTypes;

const SvgAsset = React.createClass({
  propTypes: {
    className: string,
    path: string.isRequired
  },

  render() {
    const svg = SvgIndex[this.props.path];
    if (!svg) { console.error(`No SVG found with ${this.props.path}`); }
    return <div className={this.props.className} dangerouslySetInnerHTML={{ __html: svg }} />;
  }
});

export default SvgAsset;
