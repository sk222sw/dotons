// const expect = require("chai").expect;
import { expect } from "chai";
import Designer from "../../app/designer";

describe("designer", () => {
  const designer = new Designer();
  describe("resize image()", () => {
    it("should change image size to max size if width > max width", () => {
      let image = {
        width: 1000,
        height: 100
      };

      const expected = {
        width: 100,
        height: 100
      };

      image = designer.resize(image);
      expect(image.width).to.equal(expected.width);
    });
  });
});
