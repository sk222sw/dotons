const User = require("../models/user");
const DotDesign = require("../models/dotDesign").model;

const ctrl = function() {};

ctrl.prototype.index = function(req, res) {
  const context = {};
  User.count({}, (err, userCount) => {
    context.userCount = userCount;
    
    DotDesign.count({}, (err, dotCount) => {
      context.dotCount = dotCount;
      res.render("adminDashboard", context);
    });
    
  });
  
};



module.exports = new ctrl();
