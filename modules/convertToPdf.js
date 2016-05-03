const PDFDocument = require("pdfkit");
const fs = require("fs");

/**
 * Creates a PDF-file of the given image
 *
 * @param {Number} imageSize - size in mm
 * @param {String} imagename - name of the original image
 * @param {String} pdfname - the name of the output pdf file
 * @param {String} path - path to where the file will be uploaded
 */
function convertToPDF(imageSize, imagename, pdfname, path) {
  const pdfPointSize = imageSize * (72 / 25.4); // magic pdf numbers
  const doc = new PDFDocument({
    size: [pdfPointSize, pdfPointSize]
  });
  
  doc.pipe(fs.createWriteStream(path + pdfname));


  doc.image(path + imagename, 0, 0, { width: pdfPointSize, height: pdfPointSize });

  doc.end();

}

module.exports = convertToPDF;
