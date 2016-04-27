const mocha = require("mocha");
const assert = require("chai").assert;
const DotDesign = require("../models/dotDesign").model;

describe("dotDesign model", () => {
  describe("sanitizeFilename()", () => {
    it("1. should return a sanitized, URL-friendly filename", () => {
      // setup
      const input = "ladda NED this picture.jpeg";
      const expected = "ladda_ned_this_picture.jpeg";
      const dot = new DotDesign();

      // act
      dot.filename = dot.sanitizeFilename(input);

      // assert
      assert.equal(dot.filename, expected);
    });
  });
});
