const mocha = require("mocha");
const assert = require("chai").assert;
const fs = require("fs");

const isValidImage = require("../modules/isValidImage");



describe("isValidImage-module", () => {
  // TODO: More test-cases with different types of images.
  // could be good to test files that have a changed extension
  // to ensure that the isValidImage-module checks the real 
  // mime-type of the image and not just for extension.
  describe("isValidImage()", () => {
    it("1. should return true on .png", () => {
      const image = fs.readFileSync("public/images/dotons-product.png");
      assert.equal(isValidImage(image), true);
    });

    it("2. should return true on .jpg", () => {
      const image = fs.readFileSync("test/assets/ladda_ned.jpg");
      assert.equal(isValidImage(image), true);
    });


    it("3. should return false on .ico", () => {
      const image = fs.readFileSync("test/assets/favicon.ico");
      assert.equal(isValidImage(image), false);
    });
    
    it("4. should return falce in .gif", () => {
      const image = fs.readFileSync("test/assets/ajax-loader.gif");
      assert.equal(isValidImage(image), false);
    });
    
    it("5 . should return false on corrupted png(false mimetype)", () => {
      const image = fs.readFileSync("test/assets/corrupted.png");
      assert.equal(isValidImage(image), false);
    });
  });
});



