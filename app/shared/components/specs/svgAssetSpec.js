import "specHelper";

import React from "react";
import { shallow, mount } from "enzyme";

import SvgAsset from "../svgAsset";

describe("<SvgAsset />", () => {
  it("warns when file is missing", function() {
    const errorSpy = this.sinon.stub(console, "error");
    shallow(<SvgAsset path="garbage" />);
    expect(errorSpy).to.have.been.calledWith("No SVG found with garbage");
  });

  it("renders svg when file is found", () => {
    const wrapper = mount(<SvgAsset path="test/sample" />);
    expect(wrapper).to.have.html().match(/<svg/);
  });
});
