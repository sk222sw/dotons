const User = require("../models/user");
const DotDesign = require("../models/dotDesign").model;
const Order = require("../models/order").model;
const orderDAL = require("../models/DAL/orderDAL");

/**
 * Constructor function for the AdminController
 */
const ctrl = function() {};

/**
 * GET /admin
 *
 * @param req - request object
 * @param res - response object
 */
ctrl.prototype.index = function(req, res) {
  const context = {};
  // Get the count of users
  User.count({}, (err, userCount) => {
    context.userCount = userCount;

    // WHen done, get the count of designs
    DotDesign.count({}, (error, dotCount) => {
      context.dotCount = dotCount;
      
      // Get the designs and filter out the non shipped ones
      orderDAL.getOrders()
        .then(orders => {
          return orders.filter(order => {
            return !order.shipped;
          });
        })
        .then(notShipped => {
          context.nonShippedCount = notShipped.length;
          res.render("adminDashboard", context);
        })
        .catch(error => {
          const err = new Error("Something went wrong");
          console.log(error);
          err.status = "500";
          next(err);
        })
    });
  });
};

module.exports = new ctrl();
