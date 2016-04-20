const multer = require("multer");
const isValidImage = require("../modules/isValidImage");
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("dot-design");

module.exports = upload;
