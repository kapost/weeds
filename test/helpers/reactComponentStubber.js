// Method to stub out React components (by stubbing React.createElement).
// Inspired by https://gist.github.com/TimothyRHuertas/d7d06313c5411fe242bb
//
// You should use this through specHelper like sinon (this.stubComponent).

import React from "react";

const originalCreateElement = React.createElement;

class ReactComponentStubber {
  constructor(sinon) {
    this.sinon = sinon;
    this.reactStubbed = false;
    this.stubbedComponents = {};

    this.stubComponent = this.stubComponent.bind(this);
    this.generateTestComponent = this.generateTestComponent.bind(this);
    this.clean = this.clean.bind(this);
    this.stubReact = this.stubReact.bind(this);
    this.registerStubbedComponent = this.registerStubbedComponent.bind(this);
  }

  stubComponent(Component, replacement) {
    const stubbedComponent = replacement || this.generateTestComponent(Component.displayName);

    this.registerStubbedComponent(Component.displayName, stubbedComponent);
    this.stubReact();
    return stubbedComponent;
  }

  generateTestComponent(displayName) {
    return React.createClass({
      displayName: `Stubbed${displayName}`,
      propTypes: {},

      render() {
        return (
          <div>{displayName}</div>
        );
      }
    });
  }

  clean() {
    this.reactStubbed = false;
    this.stubbedComponents = {};
  }

  // private

  // Make you match how React.createElement works if updated
  stubReact() {
    if (!this.reactStubbed) {
      const stubbedComponents = this.stubbedComponents;

      this.sinon.stub(React, "createElement", function(component, _props, ...children) {
        const Stub = stubbedComponents[component.displayName];

        if (Stub) {
          const props = _props || {};

          // Mirror how React passes down children arguments
          if (children.length > 0) {
            props.children = children.length === 1 ? children[0] : children;
          }

          return <Stub {...props} />;
        } else {
          return originalCreateElement.apply(React, arguments);
        }
      });

      this.reactStubbed = true;
    }
  }

  registerStubbedComponent(key, StubbedComponent) {
    this.stubbedComponents[key] = StubbedComponent;
  }
}

export default ReactComponentStubber;
