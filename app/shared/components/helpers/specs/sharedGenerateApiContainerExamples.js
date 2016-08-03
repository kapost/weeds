// Shared Examples for container components with default loading and failed components.
// Pass in the **Unwrapped** container (generated container *without* the connect and provideHooks
// wrappers) with all expected apiKeys.

/* eslint-disable react/jsx-no-bind, no-unused-expressions */

import _ from "lodash";
import React from "react";
import { mount } from "enzyme";

const sharedGenerateApiContainerExamples = (UnwrappedContainer, ...apiKeys) => {
  describe("when loading", () => {
    const blankLoadingObject = { progress: "LOADING", data: [] };
    const props = {};
    _.each(apiKeys, (apiKey) => { props[apiKey] = blankLoadingObject; });

    it("renders default loading object", () => {
      const wrapper = mount(
        <UnwrappedContainer {...props}
                            fetchIfNecessary={() => {}} />
      );

      expect(wrapper.find(".progress-message")).to.be.present();
    });
  });

  describe("when failed", () => {
    const blankFailedObject = { progress: "FAILED", data: [] };
    const props = {};
    _.each(apiKeys, (apiKey) => { props[apiKey] = blankFailedObject; });

    it("renders default loading object", () => {
      const wrapper = mount(
        <UnwrappedContainer {...props}
                            fetchIfNecessary={() => {}} />
      );

      expect(wrapper.find(".progress-message")).to.be.present();
    });

    it("triggers refetch on mount", function() {
      const fetchSpy = this.sinon.spy();

      mount(
        <UnwrappedContainer {...props}
                            fetchIfNecessary={fetchSpy} />
      );

      expect(fetchSpy).to.have.been.calledTwice;
    });
  });
};

export default sharedGenerateApiContainerExamples;
