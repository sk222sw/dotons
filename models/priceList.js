const mongoose = require("mongoose");

const priceListSchema = mongoose.Schema({
  businessPrice: Number,
  privatePrice: Number,
  privateRetailsPrice: Number,
  businessRetailPrice: Number
});

const PriceList = mongoose.model("PriceList", priceListSchema);

module.exports = PriceList;
