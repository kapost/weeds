/* eslint-disable react/jsx-no-bind, no-unused-expressions */

import "specHelper";

import React from "react";
import { shallow, mount } from "enzyme";

import DefaultFailed from "../defaultFailed";

describe("<DefaultFailed />", () => {
  it("renders", () => {
    const wrapper = shallow(<DefaultFailed onRetryFetch={() => {}} />);
    expect(wrapper.find(".progress-message")).to.be.present();
  });

  it("triggers retry fetch on click", function() {
    const retrySpy = this.sinon.spy();
    const wrapper = mount(<DefaultFailed onRetryFetch={retrySpy} />);
    wrapper.find("a").simulate("click");
    expect(retrySpy).to.have.been.calledOnce;
  });
});
