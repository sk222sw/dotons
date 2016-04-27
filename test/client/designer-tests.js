// const expect = require("chai").expect;
import { expect } from "chai";
import Designer from "../../app/designer";

const fabric = document.createElement("script");
fabric.type = "text/javascript";
fabric.src = "https://cdnjs.cloudflare.com/ajax/libs/fabric.js/1.6.0/fabric.min.js";

describe("designer", () => {
  const designer = new Designer();
  describe("resize image()", () => {
    it("should change image size to max size if width > max width", () => {
      let image = {
        width: 100,
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
