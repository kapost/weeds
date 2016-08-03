import "specHelper";

import { appConfig } from "../config";
import serverLog from "../serverLog";

describe("serverLog.js", () => {
  let envBackup;

  beforeEach(() => {
    envBackup = appConfig.env;
    appConfig.env = "development";
  });

  afterEach(() => {
    appConfig.env = envBackup;
  });

  it("should prefix log with '[server]'", function() {
    const consoleSpy = this.sinon.stub(console, "log");
    serverLog("log me");
    expect(consoleSpy).to.have.been.calledWith("[ server ] log me");
    consoleSpy.restore(); // restore console for test output;
                          // sinon cleaned up automatically with specHelper
  });
});
