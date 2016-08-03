# Javascript Mocha Test Suite

This folder contains the config and setup for the Mocha test suite. Actual specs are found within pods in the `app/` folder. This README serves as a guide to writing tests.

## Pod-style specs

You should add a child `specs` folder for any file(s) you want to test. Ensure the file is suffixed with `Spec` to be found by mocha.

Example:

```
myFeature/
  components/
    specs/
      myComponent1Spec.js
      myComponent2Spec.js
    myComponent1.jsx
    myComponent2.jsx
  reducers/
    specs/
      myReducerSpec.js
    myReducer.js
  specs/
    entrySpec.js
  entry.js

util/
  serverHelpers/
    specs/
      myHelperSpec.js
    myHelper.js
```

## Debugging specs

You can debug specs with the node debugger. Add a `debugger` statement anywhere in a spec and run `npm run test-debug`. The node debugger can be confusing, mainly due to the fact that you need to to continue (`c`) to the breakpoint, then manually enter a REPL at the context of the breakpoint (`repl`). You should read [the node debugger documentation](https://nodejs.org/api/debugger.html).

## Available Tools in Suite

The test suite is built using the following tools. Relevant tools are exposed as globals or within Mocha text context (`this` within mocha blocks such as `it` and `beforeEach`).


### Imported

| Tool                       | Usage / Import                     | Notes                                                                                               |
|:---------------------------|:-----------------------------------|:----------------------------------------------------------------------------------------------------|
| [Mocha][mocha]             | *none*                             | Test runner, configured with mocha.opts, `helpers` folder, and `specHelper.js`                      |
| [Chai][chai]               | `global.expect`, `global.chai`     | Assertion library with many nice matchers. Note that only the `expect` style is used in this suite. |
| [Sinon][sinon]             | `this.sinon`                       | Sinon (a sinon sandbox) is exposed through mocha context. The sandbox is restored on every test.    |
| [Enzyme][enzyme]           | `import { ... } from "enzyme";`    | React testing utility for rendering and asserting on output. Read the docs on this one!             |
| [Sinon Chai][sinon-chai]   | through `global.expect`            | Sinon helpers for Chai. Adds convenient matchers to `expect` for spies, stubs, and mocks.           |
| [Chai Enzyme][chai-enzyme] | through `global.expect`            | Enzyme helpers for Chai. Adds convenient matchers to `expect` for enzyme / JSX.                     |
| [supertest][supertest]     | `import request from "supertest";` | `superagent`-style test helper making api requests (server spec)                                    |
| [nock][nock]               | `import nock from "nock";`         | Stubs out urls for API tests                                                                        |


### Internal

| Tool                      | Usage / Import                                  | Notes                                                                                                           |
|:--------------------------|:------------------------------------------------|:----------------------------------------------------------------------------------------------------------------|
| specHelper.js             | `import specHelper;`                            | Import in each file. Adds some global aliases and context variables (such as `sinon` with setup/teardown hooks) |
| helpers/reduxTestUtils.js | `import { ... } from "helpers/reduxTestUtils";` | Gives helper functions related to mocking out or providing redux store in components.                           |



## Test Style

### Imports

Prefer relative imports. Should be simple with the embedded `specs` folder.

```js
// boot/specs/appSpec.js
import App from "../app";
```

### ESLint

ESLint applies to spec files locally to help catch errors. (It does not affect code climate). The some of following rules will likely need to be disabled for specs. Add necessary disable line with necessary rules to the top of your spec file as warnings appear. Example:

```js
/* eslint-disable max-nested-callbacks, no-unused-expressions, react/jsx-no-bind */

// max-nested-callbacks: Incorrectly triggers on deeply nested describe blocks.
// no-unused-expressions: Incorrectly triggers on chai matchers that do not end in called functions.
// react/jsx-no-bind: Warns on defining callbacks in JSX. This is a perf issue that should not affect tests.
```

Do not disable any warnings other than the 3 above.

### Enzyme

Prefer shallow rendering (`shallow`) over mounting (`mount`) for tests that don't need the full tree.

### Async Tests

Avoid `setTimeout` unless you are literally testing a timing function (such as something with `setInverval`). Instead, use the optional `done` callback provided through mocha and run in some callback if possible. Your test has two seconds to call `done` before timing out.

```js
it("tests an async function", (done) => {
  someAsyncAction((result) => {
    // onEnd callback
    expect(result).to.equal("something");
    done();
  })
});
```

### Block Functions

Prefer ES2015 arrow functions in tests (until you need dynamic context), like so:

```js
describe("a great test", () => {
  it("does a thing", () => {
    expect("string").to.exist;
  });
});
```

Use the standard ES5 `function` if you need variables on the dynamic mocha context. Only use on the block that needs the scope.

For example, using `sinon` to stub out a test.

```js
describe("a great test", () => {
  it("does a thing", function() {
    const mySpy = this.sinon.spy(MyComponent, "render");
    ...
    expect(mySpy).to.have.been.called;
  });
});
```

If you just need setup variables persisted you can just use normal javascript scope:

```js
describe("a great test", () => {
  const user = { ... };

  it("does a thing", () => {
    expect(user).to.exist;
  });
});
```

If you need variables created / setup per test, then `beforeEach` (and `afterEach`) with dynamic context can be more convenient.

```js
describe("a great test", () => {
  beforeEach(function() {
    this.user = { ... };
  });

  it("does a thing", function() {
    expect(this.user).to.exist;
  });
});
```

### Spys and Stubs

Here are a few techniques for spying on and stubbing out code with sinon.

#### Components

In enzyme, it's easy to test component methods by stubbing out a component's prototype. Example:

```js
const renderSpy = this.sinon.spy(Swimlane.prototype, "render"); // or
const renderSpy = this.sinon.stub(Swimlane.prototype, "render");
```

This can be very useful to test number of renders, `shouldComponentUpdate`, etc. You can also stub out methods that don't work well with JSDom.

If you pass down callbacks, you can just send down a vanilla spy:

```js
const onUpdateSpy - this.sinon.spy();
const wrapper = mount(<MyComponent onUpdate={onUpdateSpy} />);
// ...
expect(onUpdateSpy).to.have.been.called;
```

#### Classes

Very similar to components—you can stub out the methods. It's preferred to stub out on a instance rather than the class prototype, but both should work.

```js
const myMethodSpy = this.sinon.spy(myInstance, "method"); // also can `stub`
const myPrototypeMethodSpy = this.sinon.spy(MyClass.prototype, "method"); // also can `stub`
```

#### Functions / Module Imports

One of the trickiest things to spy / stub out is a bare, imported function. While you cannot stub out code that runs directly on import, you should be able to stub out any functions that are exported (even from another file).

To do this, import the entire set of imports as an aliased object. You can then spy on / stub out any function in that import object. This will apply the spy / stub across all imports for that test.

```js
// Original file
import { helperFunction } from "../helpers/myHelper";
// ... `helperFunction` used somewhere in here.

// Spec
import * as myHelper from "../../helpers/myHelper";
this.sinon.spy(myHelper.helperFunction); // or `stub`
```

## Internal Helpers

### `specHelper`

You should always import this in every test. It provides tear down of all of the stubbing libraries so you don't have to remember to clean up after yourself. It also adds a couple of block-level helpers that you can access on the test context.

#### `this.sinon`

Yields a [sinon](http://sinonjs.org/) instance that is cleaned up after each test is run. Always use this rather than importing `sinon`.

#### `this.stubComponent`

This is a helper that allows you to stub any component (even deeply nested ones) at the test level. All you need to do is import the problem component and stub it out.

```js
import "specHelper";

it("does not render a complicated child component", function() {
  this.stubComponent(ComplicatedChild);
  const wrapper = mount(<ComponentWithComplicatedChild />);
});
```

You can stub in `beforeEach` blocks as well. These stubs are automatically cleaned up per-test, so you don't have to unstub yourself.

You can use the stubbed component for matching too:

```js
import "specHelper";

it("renders the stubbed child", function() {
  const StubbedComplicatedChild = this.stubComponent(ComplicatedChild);
  const wrapper = mount(<ComponentWithComplicatedChild />);
  expect(wrapper.find(StubbedComplicatedChild)).to.be.present;
});
```

The default stub is a simple React component that renders `<div>{displayName}</div>` with the displayName of `Stubbed${displayName}`. If you need to replace the stub with something else, you can pass in a different stub as a second argument.

```js
import `specHelper`;

const NewComponentStub = (_props) => <p>A custom component stub!</p>;

beforeEach(function() {
  this.stubComponent(ComplicatedChild, NewComponentStub);
});

it("renders any stub given", () => {
  const wrapper = mount(<ComponentWithComplicatedChild />);
  expect(wrapper).to.include.text("A custom component stub!");
});
```

## Integration Tests

The integration suite starts both the app server and a stub server that impersonates Napa. Nightwatch is used to test the app via Selenium.

### Writing Integration Tests

All nightwatch tests found in test/integration will be run as part of the suite.

If your test depends on a Napa API endpoint that is not already stubbed, you must generate a stub for it using the ruby script found at `scripts/generate_napa_contracts.rb`. Once the script is modified, generate your new stubs by running `rake generate_napa_contracts`. For more granular control over the generation of contracts, you can manually manage them by creating more files in the `test/integration/contracts` folder.

### Troubleshooting Stubs

If your stub is not found, ensure all your query parameters are properly escaped. Browsers are more permissive with unescaped parameters than is the contract.

<!-- Links -->

[mocha]: http://mochajs.org
[sinon]: http://sinonjs.org/docs/
[sinon-chai]: https://github.com/domenic/sinon-chai
[enzyme]: https://github.com/airbnb/enzyme
[chai]: http://chaijs.com/api/
[chai-enzyme]: https://github.com/producthunt/chai-enzyme
[supertest]: https://github.com/visionmedia/supertest
[nock]: https://github.com/pgte/nock
