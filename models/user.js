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
  email: String,
  password: String,
  accountType: Number,
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
