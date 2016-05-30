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

  console.log(orderDAL);

  console.log(req.body);
  const order = new Order();
  // req.body.order.forEach((orderItem => {
  //   dotDesignDAL.getUserDesignByID(req.user.id, orderItem.id)
  //     .then(design => {
  //       if (orderItem.ordered10mm) {
  //         const line10 = new Line();
  //         line10.size = "10mm";
  //         line10.quantity =  orderItem.quantity10mm;
  //         line10.price = orderItem.quantity10mm * req.session.price;
  //         order.lines.push(line10);
  //       }
  //       if (orderItem.ordered11mm) {
  //         const line11 = new Line();
  //         line11.size = "11mm";
  //         line11.quantity = orderItem.quantity11mm;
  //         line11.price = orderItem.quantity11mm * req.session.price;
  //         order.lines.push(line11);
  //         console.log("PUSHING LINE TO ORDER");
  //       }
  //     })
  //     .catch(error => {
  //       console.log(error);
  //       res.send({ success: false });
  //     })
  // }));

  
  req.body.order.forEach((orderItem => {
    console.log(orderItem.quantity10mm);
    console.log(orderItem.quantity11mm);
    order.totalPrice = 0;
    

    if (orderItem.ordered10mm) {
      const line10 = createOrderLine("10mm", orderItem.quantity10mm, req.session.price);
      line10.design = mongoose.Types.ObjectId(orderItem.id);
      order.totalPrice += line10.price;
      order.lines.push(line10);
    }
    if (orderItem.ordered11mm) {
      const line11 = createOrderLine("11mm", orderItem.quantity11mm, req.session.price);
      line11.design = mongoose.Types.ObjectId(orderItem.id);
      order.totalPrice += line11.price;
      order.lines.push(line11);
      console.log("PUSHING LINE TO ORDER");
    }
  }));
  console.log(order);
  orderDAL.addOrderToUser(req.user.id, order)
    .then(order => {
      console.log("hehe");
      req.session.cart = null;
      res.send({ success: true, order });
    })
    .catch(error => {
      console.log(error);
      res.send({ success: false, error });
    });

};

function createOrderLine(size, quantity, dotPrice) {
  const line = new Line();
  line.size = size;
  line.quantity = quantity;
  line.price = quantity * dotPrice;
  
  return line;
  
}


module.exports = new ctrl();
