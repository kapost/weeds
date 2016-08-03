import React from "react";
import { Link } from "react-router";

const Example = (_props) => {
  return (
    <div className="weeds-examples-index-component">
      <h1>Examples</h1>
      <ul>
        <li><Link to={`/${__RELATIVE_ROOT__}/emojis`}>Github Emojis</Link></li>
      </ul>
    </div>
  );
};

export default Example;
