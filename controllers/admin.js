const User = require("../models/user");
const DotDesign = require("../models/dotDesign").model;
const Order = require("../models/order").model;
const orderDAL = require("../models/DAL/orderDAL");
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
