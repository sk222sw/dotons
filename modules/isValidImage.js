const fileType = require('file-type');

/**
 * Checks if the buffer is of a valid image type.
 * Supported types are jpg and png. Checks both the
 * extension and the real mime type
 * 
 * @param {Buffer} buffer - Buffer representing the image
 * @returns {bool} - if the image is valid
 */
module.exports = function(buffer) {
  const validExtensions = ["jpg", "png"];
  const validMimes = ["image/jpeg", "image/png"];
  const blob = fileType(buffer);

  // if the filetype is not supported by fileType, it returns null.
  // if it returns null, the extension is not supported
  return blob !== null && validExtensions.indexOf(blob.ext) !== -1 &&
         validMimes.indexOf(blob.mime) !== -1;
};
