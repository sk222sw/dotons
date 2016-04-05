const mongoose = require("mongoose");

const dotDesignSchema = mongoose.Schema({
  name: String,
  imageUrl: String
});

const DotDesign = mongoose.model("DotDesign", dotDesignSchema);

module.exports = DotDesign;
