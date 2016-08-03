/* eslint-disable react/jsx-no-bind, no-unused-expressions */

import "specHelper";

import React from "react";
import { shallow } from "enzyme";

import DefaultLoading from "../defaultLoading";

describe("<DefaultLoading />", () => {
  it("renders", () => {
    const wrapper = shallow(<DefaultLoading />);
    expect(wrapper.find(".progress-message")).to.be.present();
  });
});
