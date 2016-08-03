/* eslint-disable max-nested-callbacks */

import "specHelper";

import { devWarning, devError } from "../devWarn";

describe("devWarn", () => {
  beforeEach(function() {
    this.originalDevelopment = __DEVELOPMENT__;
    global.__DEVELOPMENT__ = true;
  });

  afterEach(function() {
    global.__DEVELOPMENT__ = this.originalDevelopment;
  });

  context("#devWarning", () => {
    it("logs a console warning", function() {
      const warnSpy = this.sinon.spy(console, "warn");
      devWarning("oops");
      expect(warnSpy).to.have.been.calledWith("oops");
    });
  });

  context("#devError", () => {
    it("throws an error", function() {
      expect(devError.bind(null, "oops")).to.throw("oops");
    });
  });
});
