/* eslint-disable max-nested-callbacks */

import "specHelper";

import deepFreeze from "deep-freeze-strict";
import generateResetReducer from "../generateResetReducer";

describe("generateResetReducer", () => {
  const resetState = { foo: "bar" };
  const resetReducer = generateResetReducer("reset", resetState);
  let noState;

  describe("initial reduction", () => {
    it("returns default reset state", () => {
      expect(resetReducer(noState, { type: "initial" })).to.deep.equal({});
    });
  });

  describe("actions", () => {
    context("with initial state", () => {
      const initialState = deepFreeze(resetReducer(noState, { type: "initial" }));

      it("handles reset action", () => {
        expect(resetReducer(initialState, { type: "reset" })).to.deep.equal(resetState);
      });
    });
  });
});
