const mongoose = require("mongoose");
const dotDesignSchema = require("./dotDesign").schema;
const userSchema = require("./user")

const line = mongoose.Schema({
  design: dotDesignSchema,
  size: {
    type: String,
    required: [true, "A size is required, 11 or 10mm"]
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: 500 // idk if this is correct min for ordering
  },
  price: {
    type: Number,
    required: [true, "Price is required"]
  }
});

const orderSchema = mongoose.Schema({
  orderDate: { type: Date, default: Date.now },
  lines: [line],
  user: userSchema,
  shipped: { type: Boolean, default: false }
});

const Order = mongoose.model("Order", orderSchema);


module.exports = {
  schema: orderSchema,
  model: Order
};
