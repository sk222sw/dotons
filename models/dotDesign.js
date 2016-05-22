const mongoose = require("mongoose");
const fs = require("fs");
const UPLOAD_PATH = "uploads/dot_designs/";

const dotDesignSchema = mongoose.Schema({
  name: String,
  imageUrl: String,
  pdf10Url: String,
  pdf11Url: String
});

/**
 * Takes a filename and removes everything that isn't a
 * alphanumeric character and replaces with an underscore.
 *
 * @param {String} filename
 * @returns {Object} - name for the picture and the pdf files
 */
dotDesignSchema.methods.sanitizeFilename = function(filename) {
  const parts = filename.split(".");
  // const ext = parts[parts.length - 1];
  const name = parts.splice(0, parts.length - 1).join(".");
  const sanitized = name.replace(/[^a-z0-9]/gi, "_").toLowerCase() + Date.now();

  fs.stat("uploads/dot_designs/" + sanitized + ".png", (err, stat) => {
    if (err == null) {
      console.log("File exists!");
    } else if (err.code === "ENOENT") {
      // file does not exists
      console.log("File does not exist");
    } else {
      console.log("Some other error: ", err.code);
    }
  });

  const ret = {
    original: sanitized + ".png", // all images stored as png
    pdf11mm: "11mm." + sanitized + ".pdf",
    pdf10mm: "10mm." + sanitized + ".pdf"
  };

  return ret;
};


const DotDesign = mongoose.model("DotDesign", dotDesignSchema);


module.exports = {
  schema: dotDesignSchema,
  model: DotDesign
};
