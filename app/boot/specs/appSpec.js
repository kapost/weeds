/* eslint-disable no-unused-expressions */

import "specHelper";

import React from "react";
import { shallow } from "enzyme";

import App from "../app";

describe("<App />", () => {
  it("renders children", () => {
    const children = <div>children</div>;
    const wrapper = shallow(<App>{children}</App>);
    expect(wrapper.find(children)).to.be.present;
  });
});
