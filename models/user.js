const mongoose = require("mongoose");
const bcrypt = require("bcrypt-node");

const userSchema = mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

User.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = User;
