import "specHelper";

import generateResetAction from "../generateResetAction";

describe("generateResetAction", () => {
  const resetAction = generateResetAction("my-reset-action");

  it("returns object containing the action type", () => {
    expect(resetAction()).to.deep.equal({
      type: "my-reset-action"
    });
  });
});
