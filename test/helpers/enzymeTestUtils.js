import _ from "lodash";

const findNode = (wrapper, selector, label) => {
  return wrapper.find(selector).filterWhere((node) => {
    return node.text().includes(label);
  });
};

const findButton = (wrapper, label) => {
  return findNode(wrapper, "button", label);
};

export { findNode, findButton };
