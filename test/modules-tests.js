const mocha = require("mocha");
const assert = require("chai").assert;
const fs = require("fs");

const isValidImage = require("../modules/isValidImage");


describe("isValidImage-module", () => {
  /*
    file-upload is handled by multer. since multers req.file object
    looks something like this:
    {
      mimetype: "image/png",
      originalname: "testimage.png"
    }
    it should be sufficient to simply make an object that looks
    the same and send it to isValidImage.
  */
  describe("isValidImage()", () => {
    it("1. should return true on .png", () => {
      const image = {
        mimetype: "image/png",
        originalname: "testimage.png"
      };
      assert.equal(isValidImage(image), true);
    });

    it("2. should return true on .jpg", () => {
      const image = {
        mimetype: "image/jpg",
        originalname: "testimage.jpg"
      };
      assert.equal(isValidImage(image), true);
    });



    it("should return false on .ico", () => {
      const image = {
        mimeType: "image/ico",
        originalname: "favicon.ico"
      };
      assert.equal(isValidImage(image), false);
    });
  });
});
