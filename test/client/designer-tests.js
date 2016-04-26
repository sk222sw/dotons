const expect = require("chai").expect;
const request = require("supertest");
const Designer = require("../../app/designer");

describe("designer", () => {
  console.log(typeof Designer);
  const designer = new Designer();
  describe("resize image()", () => {
    it("should change image size to max size if width > max width", () => {
      var image = {
        width: 100,
        height: 100
      };
      image = designer.resize(image);
      console.log(image);
    });
  });
});
