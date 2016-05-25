const DotDesignDAL = require("../models/DAL/dotDesignDAL.js");

const ctrl = function() {};

const CART_SESSION_KEY = "SHOPPING_CART";

ctrl.prototype.show = function(req, res) {
  var cart = req.session.cart || [];
};

ctrl.prototype.add = function(req, res) {
  var cart = req.session.cart || [];
  DotDesignDAL.getUserDesignByID(req.user.id, req.body.buttonID)
    .then((design, err) => {
      if (err) console.log(err);
      console.log("RESULT YAO______________");
      console.log(design);
    })

  res.send("added");
};

ctrl.prototype.remove = function(req, res) {
  var cart = req.session.cart || [];
};

module.exports = new ctrl();
