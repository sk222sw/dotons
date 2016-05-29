const Order = require("../order").model;
const User = require("../user");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const orderDAL = {
  
  addOrderToUser: (userid, order) => {
    return new Promise((resolve, reject) => {
      User.findById(userid, (err, user) => {
        console.log("In User.findById aaaaaaaaaight");
        user.orders.push(order);
        user.save(error => {
          console.log("In user.save aaaaaaaaight");
          if (error) return reject(error);
          console.log("PASSED ERROR CHECK AND IS NOW SUPPOSED TO FUCKING RESOLVE THIS SHIT");
          return resolve(order);
        });  
      });
    }); 
  },
  
  getOrderByID: (userid, orderid) => {
    return new Promise((resolve, reject) => {
      User.findById(userid, (err, user) => {
        if (err) return reject(err);
        var order = user.orders.find((ord) => {
          return ord.id === orderid;
        });
        if (!order) return reject("No order found");
        resolve(order);
      });
    });
  }
}

module.exports = orderDAL;

