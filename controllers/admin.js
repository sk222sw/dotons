const User = require("../models/user");
const DotDesign = require("../models/dotDesign").model;

const ctrl = function() {};

/**
 * GET /admin
 *
 * @param req (description)
 * @param res (description)
 */
ctrl.prototype.index = function(req, res) {
  const context = {};
  User.count({}, (err, userCount) => {
    context.userCount = userCount;

    DotDesign.count({}, (error, dotCount) => {
      context.dotCount = dotCount;
      res.render("adminDashboard", context);
    });
  });
};

module.exports = new ctrl();
