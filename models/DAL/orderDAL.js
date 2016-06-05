const Order = require("../order").model;
const User = require("../user");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const _ = require("lodash");
const dateUtils = require("../../modules/dateUtils");

const orderDAL = {
  /**
   * @param {string|ObjectId} userid
   * @param {Order} order
   * 
   * @returns {Promise} - resolves if the orders was added
   */
  addOrderToUser: (userid, order) => {
    return new Promise((resolve, reject) => {
      User.findById(userid, (err, user) => {
        console.log("In User.findById aaaaaaaaaight");
        user.orders.push(order);
        user.save(error => {
          console.log("In user.save aaaaaaaaight");
          if (error) return reject(error);
          return resolve(order);
        });  
      });
    }); 
  },
  
  /**
   * @param {string|ObjectId} orderid
   * 
   * @return {Promise} - resolves if the order was found
   */
  getOrderByID: (orderid) => {
    return new Promise((resolve, reject) => {
      User.find({}, (err, users) => {
        if (err) return reject(err);
        var order;
        console.log("forEach starts");
        users.forEach(user => {
          order = user.orders.find((ord) => {
            console.log(ord.id === orderid);
            return ord.id === orderid;
          });
          if (order) return resolve(order);
        });
        console.log("forEach end");

        if (!order) return reject("No order found");
      })
    });  
  },

  /**
   * Gets an order belonging to the current logged in user
   * 
   * @param {string|ObjectId} - userid
   * @param {string|ObjectId} - orderid
   * 
   * @return {Promise} - resolves if the order was found
   */
  getCurrentUserOrderByID: (userid, orderid) => {
    return new Promise((resolve, reject) => {
      User.findById(userid, (err, user) => {
        if (err) return reject(err);
        var order = user.orders.find((ord) => {
          return ord.id === orderid;
        });
        if (!order) return reject("No order found");
        order.populate("design");
        resolve(order);
      });
    });
  },
  
  /**
   * @param {string|ObjectId} orderid
   * 
   * @return {Promise} - resolves if the operation was succesful
   */
  setOrderShipped: (orderid) => {
    return new Promise((resolve, reject) => {
      User.find({}).exec()
        .then(users => {
          const orders = [];
          users.forEach(user => {
            user.orders.forEach(order => {
              orders.push(order);
            })
          });  
          return orders;
        })
        .then(orders => {
          console.log(orders);
          const order = orders.find(ord => {
            return ord.id === orderid;
          });
          return order
        })
        .then(order => {
          order.shipped = true;
          order.parent().save(err => {
            if (err) return reject(err);
            return resolve("Order shipped");
          })
        })
        .catch(error => {
          reject(error);
        })
      // User.find({}, (err, users) => {
      //   if (err) return reject(err);
      //   var order;
      //   var orderUser;
      //   users.forEach(user => {
      //     order = user.orders.find((ord) => {
      //       return ord.id === orderid;
      //     });
      //     if (order){
      //       console.log("FOUND ORDER");
      //       orderUser = user;
      //       order.shipped = true;
      //       orderUser.save(err => {
      //         if (err) return reject(err);
      //         return resolve("Order shipped");
      //       })
      //     } 
      //   });
      //   if (!order) return reject("No order found");
      //   // order.shipped = true;
      //   // orderUser.save(err => {
      //   //   if (err) return reject(err);
      //   //   console.log(order);
      //   //   resolve();
      //   // });
      // });
    });
  },
  
  /**
   * Gets all orders
   * 
   * @return {Promise} - resolves if the orders was found
   */
  getOrders: () => {
    return new Promise((resolve, reject) => {
      User.find({}).exec()
        .then(users => {
          const orders = [];
          users.forEach(user => {
            user.orders.forEach(order => {
              order.user = user.email
              orders.push(order);
            })
          });
          return orders;  
        })
        .then(orders => {
          orders = dateUtils.sortCollectionByDate(orders);
          orders = dateUtils.formatCollectionDates(orders);
          return orders;
        })
        .then(orders => {
          resolve(orders);
        })
        .catch(error => {
          reject(error);
        })
    })
  },
}

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

module.exports = orderDAL;

