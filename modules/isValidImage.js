const fileType = require('file-type');
/**
  @param buffer - Buffer
  @returns bool - if the image is a valid format
  Takes a buffer of the image-object stored in memory by multer,
  and checks wheter the file has the correct extension and mimetype.
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
