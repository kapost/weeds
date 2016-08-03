import React from "react";

import SvgAsset from "shared/components/svgAsset";

const App = React.createClass({
  render() {
    return (
      <div className="weeds-app-component">
        {this.props.children}
        <SvgAsset className="kapost-logo" path="kapost" />
      </div>
    );
  }
});

export default App;
