/**
 * The reason for using multers memorystorage is to
 * check the real mimetype on the server as well. 
 * If diskstorage is used, the mimetype is based on the
 * extension of the file which is not good. Since memorystorages
 * stores the image as a buffer, it is easier to check the mimetype.
 */

const multer = require("multer");

/** The storage */
const storage = multer.memoryStorage();
const limits = {
  fileSize: 1000000, //max file size change to something relevant later
  files: 1
};

/** 
 * The exported upload function from multer.
 * Accepts a single field named dot-design
 */
const upload = multer({ storage, limits }).single("dot-design");

module.exports = upload;
