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
   * @param {String} userid - id of the current user
   * @param {DotDesign} dotDesign - to be added
   */
  addDotDesignToUser: (userid, dotDesign) => {
    User.findById(userid, (err, user) => {
      user.designs.push(dotDesign);
      user.save(error => {
        if (error) console.log(err);
        console.log("User saved a design!");
      });
    });
  }


};

module.exports = dotDesignDAL;
