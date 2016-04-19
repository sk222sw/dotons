const mocha = require("mocha");
const assert = require("chai").assert;
const readChunk = require("read-chunk");

const isValidImage = require("../modules/isValidImage");

describe("isValidImage-module", () => {
  // Probably needs more test cases
  describe("isValidImage()", () => {
    it("should return true on .png", () => {
      const buffer = readChunk.sync("./public/images/dotons-product.png", 0, 12);
      assert.equal(isValidImage(buffer), true);
    });

    it("should return false on .ico", () => {
      const buffer = readChunk.sync("./public/images/favicon.ico", 0, 12);
      assert.equal(isValidImage(buffer), false);
    });
  });
});
