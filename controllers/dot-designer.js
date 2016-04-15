const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage({}) }).single("dot-design");
const path = require("path");
const fs = require("fs");

const ctrl = function() {};

ctrl.prototype.index = function(req, res) {
  res.render("dotDesigner");
};

ctrl.prototype.uploadToMemory = function(req, res, next) {
  console.log("HEHEHE");
  upload(req, res, err => {
    console.log("Tjena");
    console.log("höheee");
    if (err) return res.end("Error uploading file");
    // test to save File
    console.log(req.file);
    fs.writeFile("uploads/dot_designs/" + req.file.originalname, req.file.buffer, err => {
      if (err) return next(err);
      res.end("Success!");
    });

    res.end(req.file.buffer);
  });
};


module.exports = new ctrl();
