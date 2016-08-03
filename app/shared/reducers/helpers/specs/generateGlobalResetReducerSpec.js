/* eslint-disable max-nested-callbacks */

import "specHelper";

import generateGlobalResetReducer from "../generateGlobalResetReducer";
import { generateInitialState } from "../generateFetchReducer";

describe("generateGlobalResetReducer", () => {
  let noState;

  describe("page changed reduction", () => {
    context("with default initial state", () => {
      const initialState = generateInitialState();
      const globalResetReducer = generateGlobalResetReducer(initialState);

      it("returns initial state", () => {
        expect(
          globalResetReducer(noState, { type: "PAGE_CHANGED" })
        ).to.deep.equal(initialState);
      });
    });

    context("with custom initial state", () => {
      const initialState = generateInitialState([]);
      const globalResetReducer = generateGlobalResetReducer(initialState);

      it("returns initial state", () => {
        expect(
          globalResetReducer(noState, { type: "PAGE_CHANGED" })
        ).to.deep.equal(initialState);
      });
    });
  });
});
