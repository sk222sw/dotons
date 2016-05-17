const User = require("../user");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const userDAL = {
  getUserById: (userid) => {
    return User.findById(userid).exec();
  },
  
  getUsers: () => {
    return User.find({}).exec();
  },

  activateUser: (userid) => {
    return User.update({ _id: userid }, { $set: { activated: true } }).exec();
  },

  deactivateUser: (userid) => {
    return User.update({ _id: userid }, { $set: { activated: false } }).exec();
  }
};

module.exports = userDAL;
