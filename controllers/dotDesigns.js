const fs = require("fs");
const upload = require("../config/multer.js");
const isValidImage = require("../modules/isValidImage");
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const DotDesign = require("../models/dotDesign").model;
const uploadImage = require("../modules/uploadImage");
const convertToPDF = require("../modules/convertToPDF");



/**
 * Controller for dot designs.
 * Handles the dotDesign model
 */
const ctrl = function() {};


const UPLOAD_PATH = "uploads/dot_designs/";

/**
 * Shows all generic dots
 *
 * @param req (description)
 * @param res (description)
 */
ctrl.prototype.index = function(req, res) {

};

/**
 * Renders the dot-designer
 *
 * @param req (description)
 * @param res (description)
 */
ctrl.prototype.new = function(req, res, next) {

  res.render("dotDesigner");
};

/**
 * Creates a new dot design. Saves the dot design image as 3
 * separate files - the original image, one 11x11mm pdf, one
 * 10x10mm pdf.
 *
 * @param req (description)
 * @param res (description)
 * @param next (description)
 */
ctrl.prototype.create = function(req, res, next) {
  upload(req, res, err => {
    if (err) return res.end(err.code);
    if (!req.file && !req.session.image) return res.render("dotDesigner"); // send flash that no image was sent
    const image = req.file || req.session.image;
    console.log(image);
    console.log("HAEHHAEHAEHAEHAEHA".rainbow)
    if (!isValidImage(image)) return res.render("dotDesigner"); // send flash that file is wrong format
    console.log("IMAGE IS VALID".green)
    // save the dot-design full size image
    const dot = new DotDesign();
    const filenames = dot.sanitizeFilename(image.originalname);
    dot.name = filenames.original;
    dot.imageUrl = UPLOAD_PATH + dot.name;
    uploadImage(image, dot.imageUrl, error => {
      if (error) {
        next(error);
      } else {
        convertToPDF(11, dot.name, filenames.pdf11mm, UPLOAD_PATH);
        convertToPDF(10, dot.name, filenames.pdf10mm, UPLOAD_PATH);
        dotDesignDAL.addDotDesignToUser(req.user.id, dot)
          .then(() => {
            res.redirect("/profile");
          });
      }
    });
  });
};


module.exports = new ctrl();
