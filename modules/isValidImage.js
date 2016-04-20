const fileType = require("file-type");

module.exports = function(buffer) {
  // Should be sufficient to verify that an image is the right format
  const validExtensions = ["jpg", "png", "gif", "bmp"];
  const validMimes = ["image/jpeg", "image/png", "image/gif", "image/bmp"];
  const blob = fileType(buffer);


  return validExtensions.indexOf(blob.ext) !== -1 &&
         validMimes.indexOf(blob.mime) !== -1;
};
