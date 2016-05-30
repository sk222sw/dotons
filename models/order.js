const mongoose = require("mongoose");

const lineSchema = mongoose.Schema({
  design: { type: mongoose.Schema.Types.ObjectId, ref: "DotDesign" },
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
  lines: [lineSchema],
  totalPrice: Number,
  shipped: { type: Boolean, default: false }
});

const Order = mongoose.model("Order", orderSchema);
const Line = mongoose.model("Line", lineSchema);


module.exports = {
  schema: orderSchema,
  model: Order,
  line: Line
};
