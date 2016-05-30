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
    User.find({}, (err, users) => {
      if (err) {
        const error = new Error("Something went wrong, try again");
        error.status = 400;
        next(error);
      }
      const orders = [];

      users.forEach(user => {
        user.orders.forEach(order => {
          order.user = user.email;
          orders.push(order);
        });
      });

      orders.sort((a, b) => {
        return new Date(b.orderDate) - new Date(a.orderDate);
      });

      res.render("orders", {
        orders
      });
    });
  } else {
    User.findById(req.user.id, (err, user) => {
      if (err) {
        const error = new Error("Something went wrong, try again");
        error.status = 400;
        next(error);
      }
      else if (!user) {
        const error = new Error("Could not find the resource");
        error.status = 404;
        next(error);
      }
      res.render("orders", {
        orders: user.orders
      });
    });
  }


};

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
  // if (req.user.role === ROLES.ADMIN) {
  //   User.find({}, (err, users) => {
  //     users.forEach(user => {
  //       user.orders.forEach(order => {
  //         console.log(order.id);
  //         console.log(req.params.id);
  //         console.log(req.params.id === order.id);
  //         if (req.params.id === order.id) {
  //           console.log("TRUE MOTHACLUXKA");
  //           res.render("order", {
  //             order
  //           });
  //         }
  //       });
  //     });
  //   });
  // } else {
  // }
};



ctrl.prototype.create = function(req, res) {

  const order = new Order(); 
  var itemsProcessed = 0;
  req.body.order.forEach((orderItem => {

    order.totalPrice = 0;
    dotDesignDAL.getUserDesignByID(req.user.id, orderItem.id)
      .then(design => {
        console.log("dotDesignDAL___________: ")
        console.log("dotDesignDAL_____________")
        if (orderItem.ordered10mm) {
          console.log("CRETING A LINE IN ORDER");
          const line10 = createOrderLine("10mm", orderItem.quantity10mm, req.session.price);
          console.log(design);
          line10.design = design;
          order.totalPrice += line10.price;
          order.lines.push(line10);
        }
        if (orderItem.ordered11mm) {
          console.log("CREATING A LINE IN ORDER");
          const line11 = createOrderLine("11mm", orderItem.quantity11mm, req.session.price);
          line11.design = design;
          order.totalPrice += line11.price;
          order.lines.push(line11);
        }
        itemsProcessed++;
        if (itemsProcessed === req.body.order.length) {
          orderDAL.addOrderToUser(req.user.id, order)
            .then(order => {
              console.log("hehe    here is das order");
              console.log(order);
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
