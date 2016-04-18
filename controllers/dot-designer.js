const multer = require("multer");
const upload = multer({ dest: "uploads/dot_designs"}).single("dot-design");
const path = require("path");
const fs = require("fs");

const ctrl = function() {};

ctrl.prototype.index = function(req, res) {
  res.render("dotDesigner");
};

ctrl.prototype.uploadToMemory = function(req, res) {

  upload(req, res, err => {
    if (err) return res.end("Error uploading file");
    // test to save File
    console.log(req.file);
    res.end(req.file.buffer);
  });
};

ctrl.prototype.saveFile = function(req, res, next) {
  const fileName = "uploads/dot_designs/" + req.file.originalname;
  fs.writeFile(fileName, req.file.buffer, err => {
    if (err) return next(err);
    res.end("Success!");
  });
};


module.exports = new ctrl();
