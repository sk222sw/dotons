const fs = require("fs");
const upload = require("../config/multer.js");
const isValidImage = require("../modules/isValidImage");
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const DotDesign = require("../models/dotDesign").model;
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

    const dot = new DotDesign();
    dot.name = dot.sanitizeFilename(req.file.originalname);
    dot.imageUrl = UPLOAD_PATH + dot.name;

    fs.writeFile(dot.imageUrl, req.file.buffer, error => {
      console.log(req.file);
      if (error) {
        next(error);
      } else {
        dotDesignDAL.addDotDesignToUser(req.user.id, dot);
        res.end("Success!");
      }
    });
  });
};

module.exports = new ctrl();
