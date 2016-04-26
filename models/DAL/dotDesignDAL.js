const User = require("../user");
const DotDesign = require("../dotDesign").model;
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const dotDesignDAL = {
  getGeneralDesigns: () => {

  },

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
