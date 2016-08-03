import "specHelper";

import { escapeJsonStringify, unescapeJsonParse, safeEscapedObjectToWindow } from "../htmlSafeJson";

describe("HTML-safe JSON helper", () => {
  const badObject = { name: "<script>alert('hacked');</script>" };
  const escapedBadObject = '{"name":"&lt;script&gt;alert(&#39;hacked&#39;);&lt;/script&gt;"}';

  describe("#escapeJsonStringify", () => {
    it("escapes html characters for string values", () => {
      expect(escapeJsonStringify(badObject)).to.equal(escapedBadObject);
    });
  });

  describe("#unescapeJsonParse", () => {
    it("escapes html characters for string values", () => {
      expect(unescapeJsonParse(escapedBadObject)).to.deep.equal(badObject);
    });
  });

  describe("#safeEscapedObjectToWindow", () => {
    it("double stringifies for string interpolation", () => {
      const doubleHTMLStringifiedObj = JSON.stringify(escapedBadObject);
      expect(safeEscapedObjectToWindow(badObject)).to.equal(doubleHTMLStringifiedObj);
    });
  });
});
