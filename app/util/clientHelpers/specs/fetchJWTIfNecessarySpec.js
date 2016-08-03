/* eslint-disable max-nested-callbacks, no-unused-expressions */
import "specHelper";

import _ from "lodash";
import nock from "nock";
import { extendMockState } from "helpers/reduxTestUtils";

import fetchJWTIfNecessary from "../fetchJWTIfNecessary";

describe("fetchJWTIfNecessary", () => {
  context("profile token present", () => {
    it("resolves", function() {
      const mockData = extendMockState({ user: { fakeToken: "Fake JWT" } });
      const store = {
        getState: this.sinon.stub().returns(mockData)
      };

      const response = fetchJWTIfNecessary(store);
      const p = Promise.resolve();

      expect(response).to.deep.equal(p);
    });
  });

  context("profile token not present", () => {
    const userFixture = { user: {} };

    beforeEach(() => {
      const loggedInFixture = _.cloneDeep(userFixture);
      nock("https://test.localhost")
        .get("/api/v1/profile")
        .reply(200, loggedInFixture);
    });

    it("fetches token", function() {
      const mockData = extendMockState({ user: { fakeToken: null } });
      const store = {
        getState: this.sinon.stub().returns(mockData),
        dispatch: this.sinon.spy()
      };

      fetchJWTIfNecessary(store).then(() => {
        expect(store.dispatch).to.have.been.calledOnce;
      });
    });
  });
});
