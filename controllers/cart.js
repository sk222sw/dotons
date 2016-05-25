const DotDesignDAL = require("../models/DAL/dotDesignDAL.js");

const ctrl = function() {};

const CART_SESSION_KEY = "SHOPPING_CART";

ctrl.prototype.show = function(req, res) {
  if (req.xhr) {
    // Send the caret
    res.send({ cart: getCart(req.session) });
  } else {
    // Render the cart
  }
};

ctrl.prototype.add = function(req, res) {

  DotDesignDAL.getUserDesignByID(req.user.id, req.body.buttonID)
    .then((design, err) => {
      if (err) return res.send({ success: false });
      

      addToCart(req.session, design);
      
      return res.send({ success: true, cart: getCart(req.session) });
    })
    .catch(error => {
      console.log(error);
      res.send({ success: false });
    });
};

ctrl.prototype.remove = function(req, res) {
  var cart = req.session.cart || [];
};

module.exports = new ctrl();

function getCart(session) {
  if (session.cart) {
    return session.cart;
  }
  session.cart = [];
  return session.cart;
}

function addToCart(session, design) {
  if (!session.cart || !Array.isArray(session.cart)) {
    console.log("Cart did not exist or was not an array, created upon adding");
    session.cart = [];
  }
  console.log("Added to cart!");
  session.cart.push(design);
  session.save(); // Idk why it does not save session without this...
}
