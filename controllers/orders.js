const orderDAL = require("../models/DAL/orderDAL");
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const Order = require("../models/order").model;
const Line = require("../models/order").line;

const ctrl = function() {};

ctrl.prototype.index = function(req, res) {

}

ctrl.prototype.show = function(req, res) {

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
