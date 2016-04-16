const mongoose = require("mongoose");
const bcrypt = require("bcrypt-node");

var info;
const isCompany = true;

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
    enum: ["Admin", "Business", "Private", "Private-retail", "Business-retail"]
  },
  userInfo,
  companyInfo
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
