const multer = require("multer");
const storage = multer.memoryStorage();
const limits = {
  fileSize: 10000, //max file size change to something relevant later
  files: 1
};
const upload = multer({ storage, limits }).single("dot-design");

module.exports = upload;
