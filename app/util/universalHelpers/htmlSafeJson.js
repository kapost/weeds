// Inspired by https://github.com/Radagaisus/escape-html-in-json

import escapeHtml from "escape-html";
import unescapeHtml from "unescape-html";

const stringifyReplacer = (_key, value) => {
  return typeof value === "string" ? escapeHtml(value) : value;
};

const parseReviver = (_key, value) => {
  return typeof value === "string" ? unescapeHtml(value) : value;
};

const escapeJsonStringify = (obj) => {
  return JSON.stringify(obj, stringifyReplacer);
};

const unescapeJsonParse = (obj) => {
  return JSON.parse(obj, parseReviver);
};

// Double stringify for browser html, as it is interpolated into the string template
const safeEscapedObjectToWindow = (obj) => {
  return JSON.stringify(escapeJsonStringify(obj));
};

export { escapeJsonStringify, unescapeJsonParse, safeEscapedObjectToWindow };
