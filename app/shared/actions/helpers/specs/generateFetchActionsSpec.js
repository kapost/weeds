/* eslint-disable no-unused-expressions, max-nested-callbacks */

import "specHelper";

import generateFetchActions from "../generateFetchActions";
import * as devWarnings from "util/universalHelpers/devWarn";

describe("generateFetchActions", () => {
  const generateSuccessPromise = () => {
    return Promise.resolve({ data: "response" });
  };

  const { LOADING, LOADED, FAILED, fetch, fetchIfNecessary } = generateFetchActions(
    "PREFIX", "path", generateSuccessPromise
  );

  describe("constants", () => {
    it("LOADING is prefixed", () => {
      expect(LOADING).to.equal("PREFIX_LOADING");
    });

    it("LOADED is prefixed", () => {
      expect(LOADED).to.equal("PREFIX_LOADED");
    });

    it("FAILED is prefixed", () => {
      expect(FAILED).to.equal("PREFIX_FAILED");
    });
  });

  describe("generation", () => {
    context("when the prefix is taken", () => {
      it("throws a development warning", function() {
        const devErrorStub = this.sinon.stub(devWarnings, "devError");

        generateFetchActions("PREFIX", "path", generateSuccessPromise);
        expect(devErrorStub).to.be.calledWithMatch("prefix \"PREFIX\" has already been used");
      });
    });
  });

  describe("fetch", () => {
    beforeEach(function() {
      this.dispatchSpy = this.sinon.spy();
      this.getState = () => { return { path: { progress: "LOADED" } }; };
    });

    it("passes action arguments to promise function", function(done) {
      const generateSpyPromise = () => {
        return Promise.resolve({ data: { response: "response" } });
      };

      const promiseSpy = this.sinon.spy(generateSpyPromise);
      const { fetch: fakeFetch } = generateFetchActions("FAKE", "path", promiseSpy);

      fakeFetch("arg1", "arg2")(this.dispatchSpy, this.getState).then(() => {
        expect(promiseSpy.calledWith(this.sinon.match.defined, "arg1", "arg2")).to.be.ok;
        done();
      });
    });

    context("when response is successful", () => {
      it("fires LOADING and LOADED actions in request lifecycle", function(done) {
        const thunk = fetch({ foo: "bar" });

        thunk(this.dispatchSpy, this.getState).then(() => {
          expect(this.dispatchSpy.firstCall).to.be.calledWith({ type: "PREFIX_LOADING" });

          expect(this.dispatchSpy.secondCall).to.be
            .calledWith({ type: "PREFIX_LOADED", data: "response" });

          done();
        });
      });
    });

    context("when response fails", () => {
      const generateFailurePromise = () => {
        return Promise.reject("failure response");
      };

      const { fetch: failingFetch } = generateFetchActions(
        "FAILING", "path", generateFailurePromise
      );

      it("fires LOADING and FAILED actions in request lifecyle", function(done) {
        const thunk = failingFetch({ foo: "bar" });

        thunk(this.dispatchSpy, this.getState).then(() => {
          expect(this.dispatchSpy.firstCall).to.be.calledWith({ type: "FAILING_LOADING" });

          expect(this.dispatchSpy.secondCall).to.be
            .calledWith({ type: "FAILING_FAILED", data: "failure response" });

          done();
        });
      });

      context("with real dispatch errors", () => {
        beforeEach(function() {
          this.dispatchSpy = this.sinon.stub();
          this.dispatchSpy.onSecondCall().throws("bad error!!!");
        });

        it("rethrows errors", function(done) {
          const thunk = failingFetch({ foo: "bar" });

          thunk(this.dispatchSpy, this.getState).catch((err) => {
            expect(err.name).to.equal("bad error!!!");
            done();
          });
        });
      });
    });
  });

  describe("fetchIfNecessary", () => {
    beforeEach(function() {
      this.dispatchSpy = this.sinon.spy();
    });

    context("with LOADING state", () => {
      beforeEach(function() {
        this.getState = () => { return { path: { progress: "LOADING" } }; };
      });

      it("returns without dispatching", function(done) {
        const thunk = fetchIfNecessary({ foo: "bar" });

        thunk(this.dispatchSpy, this.getState).then(() => {
          expect(this.dispatchSpy).to.not.have.beenCalled;
          done();
        });
      });
    });
  });
});
