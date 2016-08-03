/* eslint-disable no-unused-expressions */

import "specHelper";

import generateWriteAction from "../generateWriteAction";
import * as devWarnings from "util/universalHelpers/devWarn";

describe("generateWriteAction", () => {
  const generateSuccessPromise = () => {
    return Promise.resolve({ data: "response" });
  };

  const { STARTED, SUCCEEDED, FAILED, action } = generateWriteAction(
    "PREFIX", "path", generateSuccessPromise
  );

  describe("constants", () => {
    it("STARTED is prefixed", () => {
      expect(STARTED).to.equal("PREFIX_STARTED");
    });

    it("SUCCEEDED is prefixed", () => {
      expect(SUCCEEDED).to.equal("PREFIX_SUCCEEDED");
    });

    it("FAILED is prefixed", () => {
      expect(FAILED).to.equal("PREFIX_FAILED");
    });
  });

  describe("generation", () => {
    context("when the prefix is taken", () => {
      it("throws a development warning", function() {
        const devErrorStub = this.sinon.stub(devWarnings, "devError");

        generateWriteAction("PREFIX", "path", generateSuccessPromise);
        expect(devErrorStub).to.be.calledWithMatch("prefix \"PREFIX\" has already been used");
      });
    });
  });

  describe("action", () => {
    beforeEach(function() {
      this.dispatchSpy = this.sinon.spy();
      this.getState = () => { return { path: { lastRequestTimestamp: 10 } }; };
    });

    context("when response is recent", () => {
      it("dispatches the success action", function(done) {
        const thunk = action({ foo: "bar" });

        thunk(this.dispatchSpy, this.getState).then(() => {
          expect(this.dispatchSpy.secondCall).to.be.calledWith(
            { type: "PREFIX_SUCCEEDED", data: "response", originalData: { foo: "bar" } }
          );
          done();
        });
      });

      it("calls an optional callback", function(done) {
        const successCallback = this.sinon.spy();
        const thunk = action({ foo: "bar" }, { onSucceeded: successCallback });

        thunk(this.dispatchSpy, this.getState).then(() => {
          expect(successCallback).calledWith(this.dispatchSpy, this.getState);
          done();
        });
      });
    });

    context("when response is stale", () => {
      it("ignores the action", function(done) {
        const thunk = action({ foo: "bar" });

        this.sinon.stub(Date, "now").returns(5);

        thunk(this.dispatchSpy, this.getState).then(() => {
          expect(this.dispatchSpy).to.be.calledOnce;
          done();
        });
      });
    });

    context("when response fails", () => {
      const generateFailurePromise = () => {
        return Promise.reject("failure response");
      };

      const {
        action: failureAction
      } = generateWriteAction("PREFIX", "path", generateFailurePromise);

      it("dispatches the failed action", function(done) {
        const thunk = failureAction({ foo: "bar" });

        thunk(this.dispatchSpy, this.getState).then(() => {
          expect(this.dispatchSpy.secondCall).to.be.calledWith(
            { type: "PREFIX_FAILED", data: "failure response", originalData: { foo: "bar" } }
          );
          done();
        });
      });

      it("calls an optional callback", function(done) {
        const failureCallback = this.sinon.spy();
        const thunk = failureAction({ foo: "bar" }, { onFailed: failureCallback });

        thunk(this.dispatchSpy, this.getState).then(() => {
          expect(failureCallback).calledWith(this.dispatchSpy, this.getState);
          done();
        });
      });
    });

    context("with real dispatch errors", () => {
      beforeEach(function() {
        this.dispatchSpy = this.sinon.stub();
        this.dispatchSpy.onSecondCall().throws("bad error!!!");
      });

      it("rethrows errors", function(done) {
        const thunk = action({ foo: "bar" });

        thunk(this.dispatchSpy, this.getState).catch((err) => {
          expect(err.name).to.equal("bad error!!!");
          done();
        });
      });
    });

    context("when state path doesn't match", () => {
      it("throws a development warning", function(done) {
        const devErrorStub = this.sinon.stub(devWarnings, "devError");
        const invalidPathState = () => { return { bad: null }; };
        const thunk = action({ foo: "bar" });

        thunk(this.dispatchSpy, invalidPathState).then(() => {
          expect(devErrorStub).to.be.calledWithMatch("path does not exist");
          done();
        });
      });
    });
  });
});
