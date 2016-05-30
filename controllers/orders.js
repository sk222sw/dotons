const orderDAL = require("../models/DAL/orderDAL");
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const User = require("../models/user");
const ROLES = require("../models/enums/roles").roles;
const Order = require("../models/order").model;
const Line = require("../models/order").line;
const mongoose = require("mongoose");

const ctrl = function() {};

ctrl.prototype.index = function(req, res, next) {
  if (req.user.role === ROLES.ADMIN) {
    // User.find({}, (err, users) => {
    //   if (err) {
    //     const error = new Error("Something went wrong, try again");
    //     error.status = 400;
    //     next(error);
    //   }
    //   var orders = [];

    //   users.forEach(user => {
    //     user.orders.forEach(order => {
    //       order.user = user.email;
    //       orders.push(order);
    //     });
    //   });
     
    //   orders = sortOdersByDate(orders);
    //   orders = formatOrderDates(orders);     
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
    User.findById(req.user.id, (err, user) => {
      if (err) {
        const error = new Error("Something went wrong, try again");
        error.status = 400;
        next(error);
      } else if (!user) {
        const error2 = new Error("Could not find the resource");
        error2.status = 404;
        next(error2);
      }
      var orders = sortOdersByDate(user.orders);
      orders = formatOrderDates(orders);
      res.render("orders", {
        orders
      });
    });
  }
};

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

const sortOdersByDate = (orders) => {
  return orders.sort((a, b) => {
    return new Date(b.orderDate) - new Date(a.orderDate);
  });
};

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

function createOrderLine(size, quantity, dotPrice) {
  const line = new Line();
  line.size = size;
  line.quantity = quantity;
  line.price = quantity * dotPrice;
  
  return line;
  
}


module.exports = new ctrl();
