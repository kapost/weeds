import "specHelper";

import unionProgressState from "../unionProgressState";
import { FETCH_PROGRESS_VALUES as progressValues } from "shared/values/apiProgressValues";

const { LOADING, LOADED, FAILED } = progressValues;

describe("UnionProgressState", () => {
  context("default", () => {
    const progressValue = [{}, {}];
    it("returns INITIAL", () => {
      expect(unionProgressState(...progressValue)).to.equal("INITIAL");
    });
  });

  context("some loading", () => {
    const progressValue = [{ progress: LOADING }, { progress: LOADED }, { progress: LOADED }];
    it("returns LOADING", () => {
      expect(unionProgressState(...progressValue)).to.equal("LOADING");
    });
  });

  context("all loaded", () => {
    const progressValue = [{ progress: LOADED }, { progress: LOADED }];
    it("returns LOADED", () => {
      expect(unionProgressState(...progressValue)).to.equal("LOADED");
    });
  });

  context("some failed", () => {
    const progressValue = [{ progress: FAILED }, { progress: LOADING }, { progress: LOADED }];
    it("returns FAILED", () => {
      expect(unionProgressState(...progressValue)).to.equal("FAILED");
    });
  });
});
