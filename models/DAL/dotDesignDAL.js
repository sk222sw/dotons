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

  getUserDesigns: (userid) => {
    return User.findById(userid).exec();
  },

  getUserDesignByID: (userID, designID) => {
    return new Promise((resolve, reject) => {
      User.findById(userID, (err, user) => {
        if (err) return reject(err);
        var design = user.designs.find((des) => {
          console.log(typeof des.id);
          console.log(typeof designID);
          return des.id === designID;
        });
        
        console.log(design);
      });
    });
  }


};

module.exports = dotDesignDAL;
