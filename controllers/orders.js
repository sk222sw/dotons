const orderDAL = require("../models/DAL/orderDAL");
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const User = require("../models/user");
const ROLES = require("../models/enums/roles").roles;
const Order = require("../models/order").model;
const Line = require("../models/order").line;

const ctrl = function() {};

ctrl.prototype.index = function(req, res, next) {
  if (req.user.role === ROLES.ADMIN) {
    User.find({}, (err, users) => {
      if (err) {
        const error = new Error("Something went wrong, try again");
        error.status = 400;
        next(error);
      }
      if (!users) {
        const error = new Error("Resource does not exist");
        error.status = 404;
        next(error);
      }
      const orders = [];
      
      users.forEach(user => {
        user.orders.forEach(order => {
          orders.push(order);
        });
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
      if (!user) {
        const error = new Error("Could not find the resource");
        error.status = 404;
        next(error);
      }
      res.render("orders", {
        orders: user.orders
      });
    });
  }
  

}

ctrl.prototype.show = function(req, res) {
  // buildin pyramids for sure
  if (req.user.role === ROLES.ADMIN) {
    User.find({}, (err, users) => {
      users.forEach(user => {
        user.orders.forEach(order => {
          if (order.id === req.params.id) {
            res.render("order", {
              order
            });
          }  
        });
      });
      res.send(404);
    });
  } else {
    User.find
  }
}



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
  var c = 0;
  req.body.order.forEach((orderItem => {
    if (orderItem.ordered10mm) {
      const line10 = new Line();
      line10.size = "10mm";
      line10.quantity =  orderItem.quantity10mm;
      line10.price = orderItem.quantity10mm * req.session.price;
      order.lines.push(line10);
    }
    if (orderItem.ordered11mm) {
      const line11 = new Line();
      line11.size = "11mm";
      line11.quantity = orderItem.quantity11mm;
      line11.price = orderItem.quantity11mm * req.session.price;
      order.lines.push(line11);
      console.log("PUSHING LINE TO ORDER");
    }
    c++;
    if (c === req.body.order.length) {
      console.log("forEach IS MOTHEFLUCKING DONE AAAAIGHT");
       
      
    }
  }));
  orderDAL.addOrderToUser(req.user.id, order)
        .then(order => {
          console.log("hehe");
          res.send({ success: true, order });
        })
        .catch(error => {
          console.log(error);
          res.send({ success: false, error });
        });
 
};


module.exports = new ctrl();
