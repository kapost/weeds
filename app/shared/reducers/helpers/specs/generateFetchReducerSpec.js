/* eslint-disable max-nested-callbacks */

import "specHelper";

import deepFreeze from "deep-freeze-strict";
import generateFetchReducer from "../generateFetchReducer";

describe("generateFetchReducer", () => {
  const fetchReducer = generateFetchReducer("loading", "loaded", "failed");
  let noState;

  describe("initial reduction", () => {
    it("returns default fetch state", () => {
      expect(fetchReducer(noState, { type: "initial" })).to.deep.equal({
        progress: "INITIAL",
        data: {},
        loadedCount: 0
      });
    });
  });

  describe("actions", () => {
    context("with initial state", () => {
      const initialState = deepFreeze(fetchReducer(noState, { type: "initial" }));

      it("handles loading action", () => {
        expect(fetchReducer(initialState, { type: "loading" })).to.deep.equal({
          progress: "LOADING",
          data: {},
          loadedCount: 0
        });
      });

      it("handles loaded action", () => {
        expect(fetchReducer(initialState, { type: "loaded", data: { user: "me" } })).to.deep.equal({
          progress: "LOADED",
          data: { user: "me" },
          loadedCount: 1
        });
      });

      it("handles failed action", () => {
        expect(fetchReducer(initialState, { type: "failed", data: ":(" })).to.deep.equal({
          progress: "FAILED",
          data: ":(",
          loadedCount: 0
        });
      });
    });
  });
});
