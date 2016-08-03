/* eslint-disable max-nested-callbacks */

import "specHelper";

import deepFreeze from "deep-freeze-strict";
import generateWriteReducer from "../generateWriteReducer";

describe("generateWriteReducer", () => {
  let writeReducer = generateWriteReducer("started", "succeeded", "failed");
  let noState;

  describe("initial reduction", () => {
    it("returns default write state", () => {
      expect(writeReducer(noState, { type: "initial" })).to.deep.equal({
        apiProgress: "INITIAL",
        apiError: null,
        data: {},
        backup: null,
        lastRequestTimestamp: null
      });
    });
  });

  describe("actions", () => {
    context("with initial state", () => {
      const dataState = { data: { user: "joe" } };
      const initialState = deepFreeze({
        ...writeReducer(noState, { type: "initial" }),
        ...dataState
      });
      const newData = { user: "bob", email: "foo@kapost.com" };

      context("started action", () => {
        const action = { type: "started", data: newData, timestamp: 5 };

        it("handles started action for objects", () => {
          expect(writeReducer(initialState, action)).to.deep.equal({
            apiProgress: "STARTED",
            apiError: null,
            backup: dataState.data,
            data: newData,
            lastRequestTimestamp: 5
          });
        });

        it("handles started action for arrays", () => {
          const newArrayData = ["one", "two"];
          const arrayAction = { type: "started", data: newArrayData, timestamp: 5 };

          expect(writeReducer(initialState, arrayAction)).to.deep.equal({
            apiProgress: "STARTED",
            apiError: null,
            backup: dataState.data,
            data: newArrayData,
            lastRequestTimestamp: 5
          });
        });

        it("handles custom onStarted callback", () => {
          const onStarted = (_state, _action) => {
            return { data: "hey buddy" };
          };
          writeReducer = generateWriteReducer("started", "succeeded", "failed", { onStarted });

          expect(writeReducer(initialState, action)).to.deep.equal({
            apiProgress: "STARTED",
            apiError: null,
            backup: dataState.data,
            data: "hey buddy",
            lastRequestTimestamp: 5
          });
        });
      });

      context("succeeded action", () => {
        const action = { type: "succeeded", data: newData };

        it("handles succeeded action", () => {
          expect(writeReducer(initialState, action)).to.deep.equal({
            apiProgress: "SUCCEEDED",
            apiError: null,
            backup: null,
            data: newData,
            lastRequestTimestamp: null
          });
        });

        it("handles custom onSucceeded callback", () => {
          const onSucceeded = (_state, _action) => {
            return { data: "hey buddy" };
          };
          writeReducer = generateWriteReducer("started", "succeeded", "failed", { onSucceeded });

          expect(writeReducer(initialState, action)).to.deep.equal({
            apiProgress: "SUCCEEDED",
            apiError: null,
            backup: null,
            data: "hey buddy",
            lastRequestTimestamp: null
          });
        });
      });

      context("failed action", () => {
        const action = { type: "failed", data: "sad panda" };
        const initialStateWithBackup = deepFreeze({ ...initialState, backup: dataState.data });

        it("handles failed action", () => {
          expect(writeReducer(initialStateWithBackup, action)).to.deep.equal({
            apiProgress: "FAILED",
            apiError: "sad panda",
            backup: null,
            data: dataState.data,
            lastRequestTimestamp: null
          });
        });

        it("handles custom onFailed callback", () => {
          const onFailed = (_state, _action) => {
            return { data: "hey buddy" };
          };
          writeReducer = generateWriteReducer("started", "succeeded", "failed", { onFailed });

          expect(writeReducer(initialState, action)).to.deep.equal({
            apiProgress: "FAILED",
            apiError: "sad panda",
            backup: null,
            data: "hey buddy",
            lastRequestTimestamp: null
          });
        });
      });
    });
  });
});
