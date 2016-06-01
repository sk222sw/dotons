const mocha = require("mocha");
const assert = require("chai").assert;
const DotDesign = require("../models/dotDesign").model;
const mongoose = require("mongoose");
const db = require("../models/mongo");

describe("dotDesign model", () => {
  describe("sanitizeFilename()", () => {
    it("1. should return a sanitized, URL-friendly filename", () => {
      // setup
      const input = "ladda NED this picture.png";
      const expected = "ladda_ned_this_picture"; // expect only filename without ext
      const dot = new DotDesign();

      // act
      // split the filename, do not compare ext and timestamp, just the name
      const toAssert = dot.sanitizeFilename(input).original.split(".")[0];
      console.log(toAssert);

      // assert
      assert.equal(toAssert, expected);
    });
  });
});
