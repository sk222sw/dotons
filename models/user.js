const mongoose = require("mongoose");
const bcrypt = require("bcrypt-node");

const roles = require("./enums/roles").getRoleValues;
const ROLES = require("./enums/roles").roles;
const dotDesignSchema = require("./dotDesign").schema;
const orderSchema = require("./order").schema;

const userInfo = mongoose.Schema({
  firstName: String,
  lastName: String
});

const companyInfo = mongoose.Schema({
  companyName: String,
});




const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    minlength: [3, "Email is too short"],
    maxlength: [100, "Email is too long"]
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password is too short"],
    maxlength: [200, "Password is too long"]
  },
  role: {
    type: String,
    required: [true, "No role for user"],
    enum: roles()
  },
  activated: {
    type: Boolean,
    default: false
  },
  userInfo,
  companyInfo,
  designs: [dotDesignSchema],
  orders: [orderSchema]
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * Gets the dot price for a user based on their role
 *
 * @param priceList
 * @returns {Number}
 */
userSchema.methods.getUserPrice = function(priceList) {

  switch (this.role) {
    case ROLES.BUSINESS:
      return priceList.businessPrice;
    case ROLES.PRIVATE:
      return priceList.privatePrice;
    case ROLES.PRIVATE_RETAIL:
      return priceList.privateRetailsPrice;
    case ROLES.BUSINESS_RETAIL:
      return priceList.businessRetailPrice;
    default:
      return priceList.privatePrice;
  }
};



module.exports = mongoose.model("User", userSchema);
