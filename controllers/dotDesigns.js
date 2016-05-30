const fs = require("fs");
const path = require("path");
const upload = require("../config/multer.js");
const isValidImage = require("../modules/isValidImage");
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const DotDesign = require("../models/dotDesign").model;
const uploadImage = require("../modules/uploadImage");
const convertToPDF = require("../modules/convertToPdf");



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

  res.render("dotDesigner", {
    title: "dotons - designer",
    csrfToken: req.csrfToken(),
    active: { designer: true }
  });
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
    if (!req.file) return res.send("no-imgage"); // send flash that no image was sent
    if (!isValidImage(req.file.buffer)) return res.send("not-valid-image"); // send flash that file is wrong format

    // save the dot-design full size image
    const dot = new DotDesign();
    const filenames = dot.sanitizeFilename(req.file.originalname);
    dot.name = filenames.original;
    dot.imageUrl = UPLOAD_PATH + dot.name;


    uploadImage(req.file.buffer, dot.imageUrl)
      .then(() => {
        dot.pdf10Url = UPLOAD_PATH + filenames.pdf10mm;
        dot.pdf11Url = UPLOAD_PATH + filenames.pdf11mm;
        convertToPDF(10, dot.name, filenames.pdf10mm, UPLOAD_PATH);
        convertToPDF(11, dot.name, filenames.pdf11mm, UPLOAD_PATH);
      })
      .then(() => {
        return dotDesignDAL.addDotDesignToUser(req.user.id, dot);
      })
      .then(() => {
        // Send a message, maybe something nicer.
        // Since image is posted with AJAX we need an indication
        // of wheter if succeeded or if maybe the user wasnt logged in
        // to correctly redirect the user.
        res.send("success");
      })
      .catch(error => {
        console.log(error);
        res.send("error");
      });
  });
};

ctrl.prototype.getImage = function(req, res) {
  const imagename = req.params.imagename;
  res.sendFile(path.resolve("uploads/dot_designs/" + imagename));
};


module.exports = new ctrl();
