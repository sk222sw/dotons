const fs = require("fs");
const upload = require("../config/multer.js");
const isValidImage = require("../modules/isValidImage");
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const DotDesign = require("../models/dotDesignSchema").model;
const ctrl = function() {};

const UPLOAD_PATH = "uploads/dot_designs/";

ctrl.prototype.index = function(req, res) {
  // show generic dots here
};

ctrl.prototype.new = function(req, res) {
  res.render("dotDesigner");
};

ctrl.prototype.create = function(req, res, next) {
  upload(req, res, err => {
    if (err) return res.end(err.code);
    if (!isValidImage(req.file.buffer)) return res.end("Wrong file format");

    const filename = sanitizeFileName(req.file.originalname);

    fs.writeFile(UPLOAD_PATH + filename, req.file.buffer, error => {
      console.log(req.file);
      if (error) {
        next(error);
      } else {
        console.log(req.user);
        dotDesignDAL.addDotDesignToUser(req.user.id, new DotDesign({
          name: filename,
          imageUrl: UPLOAD_PATH + filename
        }));
        res.end("Success!");
      }
    });
  });
};

/** move out to module? */
function sanitizeFileName(filename) {
  const parts = filename.split(".");
  const ext = parts[parts.length - 1];
  const name = parts.splice(0, parts.length - 1).join(".");
  const sanitized = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  return sanitized + "." + ext;
}

module.exports = new ctrl();
