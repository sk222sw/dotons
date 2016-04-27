const fs = require("fs");
const upload = require("../config/multer.js");
const isValidImage = require("../modules/isValidImage");
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const DotDesign = require("../models/dotDesign").model;
const PDFDocument = require("pdfkit");


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
ctrl.prototype.new = function(req, res) {
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
    if (!isValidImage(req.file.buffer)) return res.end("Wrong file format");

    // save the dot-design full size image
    const dot = new DotDesign();
    const filenames = dot.sanitizeFilename(req.file.originalname);
    dot.name = filenames.original;
    dot.imageUrl = UPLOAD_PATH + dot.name;

    fs.writeFile(dot.imageUrl, req.file.buffer, error => {
      if (error) {
        next(error);
      } else {
        // create a pdf with 11mmx11mm¨
        convertToPDF(11, dot.name, filenames.pdf11mm, UPLOAD_PATH);
        dot.pdf11Url = UPLOAD_PATH + filenames.pdf11mm;

        // create a pdf with 10mmx10mm

        convertToPDF(10, filenames.original, filenames.pdf10mm, UPLOAD_PATH);
        dot.pdf10Url = UPLOAD_PATH + filenames.pdf10mm;

        // finally we save the dot to db and end
        dotDesignDAL.addDotDesignToUser(req.user.id, dot);
        res.end("Success!");
      }
    });
  });
};

/**
 * Creates a PDF-file of the given image
 * 
 * @param {Number} imageSize - size in mm
 * @param {String} imagename - name of the original image
 * @param {String} pdfname - the name of the output pdf file
 * @param {String} path - path to where the file will be uploaded
 */
function convertToPDF(imageSize, imagename, pdfname, path) {
  console.log(imagename);
  console.log(path);
  const pdfPointSize = imageSize * (72 / 25.4); // magic pdf numbers
  const doc = new PDFDocument({
    size: [pdfPointSize, pdfPointSize]
  });
  doc.pipe(fs.createWriteStream(path + pdfname));
  doc.image(UPLOAD_PATH + imagename, 0, 0, { width: pdfPointSize, height: pdfPointSize });
  doc.end();
}

module.exports = new ctrl();
