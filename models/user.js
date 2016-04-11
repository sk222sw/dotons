const mongoose = require("mongoose");
const bcrypt = require("bcrypt-node");

var info;
const isCompany = true;

if (isCompany) {
  info = mongoose.Schema({
    companyName: String,
    blabla: String
  });
} else {
  info = mongoose.Schema({
    firstName: String,
    lastName: String
  });
}


const userSchema = mongoose.Schema({
  email: String,
  password: String,
  accountType: Number,
  info
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
