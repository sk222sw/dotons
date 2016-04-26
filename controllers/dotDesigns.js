const fs = require("fs");
const upload = require("../config/multer.js");
const isValidImage = require("../modules/isValidImage");
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
    if (err) return res.end("Something went wrong");
    if (!isValidImage(req.file.buffer)) return res.end("Wrong file format");

    const filename = sanitizeFileName(req.file.originalname);
    console.log(filename);
    fs.writeFile(UPLOAD_PATH + filename, req.file.buffer, error => {
      if (error) {
        next(error);
      } else {
        res.end("Success!");
      }
    });
  });
};

function sanitizeFileName(filename) {
  const parts = filename.split(".");
  const ext = parts[parts.length - 1];
  const name = parts.splice(0, parts.length - 1).join(".");
  const sanitized = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  return sanitized + "." + ext;
}

module.exports = new ctrl();
