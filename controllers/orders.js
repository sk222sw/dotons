const orderDAL = require("../models/DAL/orderDAL");
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const User = require("../models/user");
const ROLES = require("../models/enums/roles").roles;
const Order = require("../models/order").model;
const Line = require("../models/order").line;
const userDAL = require("../models/DAL/userDAL");
const mongoose = require("mongoose");

/**
 * Constructor function for the OrdersController
 */
const ctrl = function() {};

/**
 * Shows all orders if admin. Shows all users orders if non-admin
 * 
 * GET /orders
 * 
 * @param req - request object
 * @param res - response object
 * @param next - next callback
 */
ctrl.prototype.index = function(req, res, next) {
  if (req.user.role === ROLES.ADMIN) {S    
    orderDAL.getOrders()
      .then(orders => {
          res.render("orders", {
          orders,
          csrfToken: req.csrfToken()
        });
      })
      .catch(errors => {
        return next(error);  
      });
      
    
  } else {
    userDAL.getUserById(req.user.id)
      .then(user => {
        var orders = sortOdersByDate(user.orders);
        orders = formatOrderDates(orders);
        res.render("orders", {
          orders
        });  
      })
      .catch(error => {
        const err = new Error("Something went wrong, try again");
        err.status = 400;
        next(err);
      });
  }
};

/**
 * Sets an order to shipped status
 * 
 * POST /orders/:id/ship
 * 
 * @param req - request object
 * @param res - response object
 * @param next - next callback
 */
ctrl.prototype.ship = (req, res, next) => {
  orderDAL.setOrderShipped(req.params.id)
    .then(() => {
      req.flash = "Shipped!";
      res.redirect("/orders/" + req.params.id);
    })
    .catch(error => {
      console.log(err);
      req.flash = "Something went wrong... Try again";
      res.redirect("/orders");
    });
};

/**
 * Sorts an array of orders by date
 * 
 * @param {array} orders 
 */
const sortOdersByDate = (orders) => {
  return orders.sort((a, b) => {
    return new Date(b.orderDate) - new Date(a.orderDate);
  });
};

/**
 * Takes an array of orders and formats their dates to an ISO-string
 * 
 * @param {array} orders
 */
const formatOrderDates = (orders) => {
  return orders.map((order) => {
    const newOrder = order; //NWO
    console.log(new Date(order.orderDate).toISOString().slice(0, 10));
    console.log(newOrder.orderDate);
    newOrder.orderDate = new Date(order.orderDate).toISOString().slice(0, 10);
    newOrder.displayDate = new Date(order.orderDate).toISOString().slice(0, 10);
    console.log(newOrder.orderDate);
    return newOrder;
  });
}

/**
 * Shows a single order
 * 
 * GET /orders/:id
 * 
 * @param req - request object
 * @param res - response object
 * @param next - next callback
 */
ctrl.prototype.show = function(req, res, next) {
  // buildin pyramids for sure
  if (req.user.role === ROLES.ADMIN) {
    orderDAL.getOrderByID(req.params.id)
      .then(order => {
        res.render("order", {
          order
        });
      })
      .catch(error => {
        console.log(error);
        next(error); 
      });
  } else {
    orderDAL.getCurrentUserOrderByID(req.user.id, req.params.id)
      .then(order => {
        console.log(order);
        res.render("order", {
          order
        });
      })
      .catch(error => {
        console.log(error);
        next(error);
      });
  }
};

/**
 * Create an order
 * 
 * POST /orders/create
 * 
 * @param req - reques object
 * @param res - response object
 */
ctrl.prototype.create = function(req, res) {

  const order = new Order(); 
  var itemsProcessed = 0;
  req.body.order.forEach((orderItem => {

    order.totalPrice = 0;
    dotDesignDAL.getUserDesignByID(req.user.id, orderItem.id)
      .then(design => {
        if (orderItem.ordered10mm) {
          const line10 = createOrderLine("10mm", orderItem.quantity10mm, req.session.price);
          console.log(design);
          line10.design = design;
          order.totalPrice += line10.price;
          order.lines.push(line10);
        }
        if (orderItem.ordered11mm) {
          const line11 = createOrderLine("11mm", orderItem.quantity11mm, req.session.price);
          line11.design = design;
          order.totalPrice += line11.price;
          order.lines.push(line11);
        }
        itemsProcessed++;
        if (itemsProcessed === req.body.order.length) {
          orderDAL.addOrderToUser(req.user.id, order)
            .then(order => {
              req.session.cart = null;
              res.send({ success: true, order });
            })
            .catch(error => {
              console.log(error);
              res.send({ success: false, error });
            });  
        }
      }); 
  }));
  

};

/**
 * Creates an order line
 * 
 * @param {string} size - size of the dotDesignDAL
 * @param {number} quantity - number of dots ordered
 * @param {number} dotPrice - single price of dot
 */
function createOrderLine(size, quantity, dotPrice) {
  const line = new Line();
  line.size = size;
  line.quantity = quantity;
  line.price = quantity * dotPrice;
  
  return line;
  
}


module.exports = new ctrl();
