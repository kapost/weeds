const appConfig = require("../../config/app");

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DEVELOPMENT__ = false;
global.__RELATIVE_ROOT__ = appConfig.relativeRoot;

appConfig.port = 4111; // use unrelated port for tests
