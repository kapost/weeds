import "specHelper";

import deepFreeze from "deep-freeze-strict";
import reduceReducers from "../reduceReducers";

describe("reduceReducers", () => {
  let noState;

  const reducerA = (state = deepFreeze({ reducer: "A", random: "data" }), action) => {
    switch (action.type) {
      case "A":
        return {
          ...state,
          random: "changed from action A by reducerA"
        };
      case "SHARED":
        return {
          ...state,
          random: "changed from action SHARED by reducerA"
        };
      case "SAME_KEY":
        return {
          ...state,
          reducer: "A modified by reducerA"
        };
      default:
        return state;
    }
  };

  const reducerB = (state = deepFreeze({ reducer: "B", other: "data" }), action) => {
    switch (action.type) {
      case "B":
        return {
          ...state,
          other: "changed from action B by reducerB"
        };
      case "SHARED":
        return {
          ...state,
          other: "changed from action SHARED by reducerB"
        };
      case "SAME_KEY":
        return {
          ...state,
          reducer: "B modified by reducerB"
        };
      default:
        return state;
    }
  };

  const reducedReducer = reduceReducers(reducerA, reducerB);

  describe("initial reduction", () => {
    it("extends reducers' states", () => {
      expect(reducedReducer(noState, { type: "initial" })).to.deep.equal({
        reducer: "B",
        random: "data",
        other: "data"
      });
    });
  });

  describe("actions", () => {
    const initialState = deepFreeze(reducedReducer(noState, { type: "initial" }));

    it("updates first reducer with action", () => {
      expect(reducedReducer(initialState, { type: "A" })).to.deep.equal({
        reducer: "B",
        random: "changed from action A by reducerA",
        other: "data"
      });
    });

    it("updates second reducer with action", () => {
      expect(reducedReducer(initialState, { type: "B" })).to.deep.equal({
        reducer: "B",
        random: "data",
        other: "changed from action B by reducerB"
      });
    });

    it("updates both reducers with a common action", () => {
      expect(reducedReducer(initialState, { type: "SHARED" })).to.deep.equal({
        reducer: "B",
        random: "changed from action SHARED by reducerA",
        other: "changed from action SHARED by reducerB"
      });
    });

    it("prefers the last reducer for any shared key changes", () => {
      expect(reducedReducer(initialState, { type: "SAME_KEY" })).to.deep.equal({
        reducer: "B modified by reducerB",
        random: "data",
        other: "data"
      });
    });
  });
});
