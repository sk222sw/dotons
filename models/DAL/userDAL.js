const User = require("../user");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const userDAL = {
  /**
   * @param {string|ObjectId} userid
   * 
   * @return {Promise} - resolves if the user was found
   */
  getUserById: (userid) => {
    return User.findById(userid).exec();
  },
  
  /**
   * @return {Promise} - resolves if the users was found
   */
  getUsers: () => {
    return User.find({}).exec();
  },

  /**
   * @param {string|ObjectId} userid
   * 
   * @return {Promise} - resolves if the user was updated
   */
  activateUser: (userid) => {
    return User.update({ _id: userid }, { $set: { activated: true } }).exec();
  },
  
  /**
   * @param {string|ObjectId} userid
   * 
   * @return {Promise} - resolves if the user was updated
   */
  deactivateUser: (userid) => {
    return User.update({ _id: userid }, { $set: { activated: false } }).exec();
  }
};

module.exports = userDAL;
