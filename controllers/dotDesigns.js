const fs = require("fs");
const upload = require("../config/multer.js");
const isValidImage = require("../modules/isValidImage");
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const DotDesign = require("../models/dotDesign").model;
const PDFDocument = require("pdfkit");
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

    // save the dot-design full size image
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

    // create a pdf with 11mmx11mm
    const doc11 = new PDFDocument();
    doc11.image(UPLOAD_PATH + dot.name, 0, 0, 11, 11);

    console.log(doc11);
    // create a pdf with 10mmx10mm
  });
};

module.exports = new ctrl();
