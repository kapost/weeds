// Use context as an alias to describe (like rspec)
global.context = describe;

// Use sinon sandbox in test context
import sinon from "sinon";
import nock from "nock";
import ReactComponentStubber from "./helpers/reactComponentStubber";

// Ensure all sinon spies, stubs, and mocks are cleaned up per test.
// This is applyed through the outermost mocha beforeEach and afterEach blocks.
beforeEach(function() {
  this.sinon = sinon.sandbox.create();
  const componentStubber = new ReactComponentStubber(this.sinon);
  this.stubComponent = componentStubber.stubComponent;
});

// Also ensure any nock calls are cleaned up.
afterEach(function() {
  this.sinon.restore();
  nock.cleanAll();
  this.stubComponent = null;
});
