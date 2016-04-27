const mongoose = require("mongoose");

const dotDesignSchema = mongoose.Schema({
  name: String,
  imageUrl: String
});

dotDesignSchema.methods.sanitizeFilename = function(filename) {
  const parts = filename.split(".");
  const ext = parts[parts.length - 1];
  const name = parts.splice(0, parts.length - 1).join(".");
  const sanitized = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();

  return sanitized + "." + ext;
};

const DotDesign = mongoose.model("DotDesign", dotDesignSchema);



module.exports = {
  schema: dotDesignSchema,
  model: DotDesign
};
