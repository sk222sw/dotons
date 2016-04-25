const mongoose = require("mongoose");

const dotDesignSchema = mongoose.Schema({
  name: String,
  imageUrl: String
});

module.exports = dotDesignSchema;
