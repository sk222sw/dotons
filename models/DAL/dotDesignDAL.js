const User = require("../user");
const DotDesign = require("../dotDesign").model;
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const dotDesignDAL = {
  /**
   * Gets all the general designs
   */
  getGeneralDesigns: () => {

  },

  /**
   * Adds a dot design to the current user
   *
   *
   * @param {String} userid - id of the current user
   * @param {DotDesign} dotDesign - to be added
   * 
   * @return {Promise} - resolves if the dot was added
   */
  addDotDesignToUser: (userid, dotDesign) => {
    return new Promise((resolve, reject) => {
      User.findById(userid, (err, user) => {


        user.designs.push(dotDesign);
        user.save(error => {
          if (error) return reject(err);
          resolve();
        });
      });
    });
  },

  /**
   * @param {string|ObjectId} userid 
   * 
   * @return {Promise} - resolves if the user designs was found
   */
  getUserDesigns: (userid) => {
    return User.findById(userid).exec();
  },

  /**
   * param {string|ObjectId} userID
   * @param {string|ObjectId} designID
   * 
   * @return {Promise} - resolves if the design was found
   */
  getUserDesignByID: (userID, designID) => {
    return new Promise((resolve, reject) => {
      User.findById(userID, (err, user) => {
        if (err) return reject(err);
        var design = user.designs.find((des) => {
          return des.id === designID;
        });
        if (!design) return reject("No design found");
        resolve(design);
      });
    });
  }


};

module.exports = dotDesignDAL;
