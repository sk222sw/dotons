const fs = require("fs");
const upload = require("../config/multer.js");
const isValidImage = require("../modules/isValidImage");
const ctrl = function() {};

const UPLOAD_PATH = "uploads/dot_designs/";

ctrl.prototype.index = function(req, res) {
  res.render("dotDesigner");
};

ctrl.prototype.upload = function(req, res, next) {
  upload(req, res, err => {
    if (err) return res.end("Something went wrong");
    if (!isValidImage(req.file.buffer)) return res.end("Wrong file format");

    const filename = UPLOAD_PATH + req.file.originalname;
    fs.writeFile(filename, req.file.buffer, error => {
      if (error) {
        next(error);
      } else {
        res.end("Success!");
      }
    });
  });
};

module.exports = new ctrl();
