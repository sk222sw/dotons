const DotDesignDAL = require("../models/DAL/dotDesignDAL.js");
const PriceListDAL = require("../models/DAL/priceListDAL");

const ctrl = function() {};

const CART_SESSION_KEY = "SHOPPING_CART";

ctrl.prototype.show = function(req, res) {
  if (req.xhr) {
    // Send the caret
    res.send({ cart: getCart(req.session) });
  } else {
    // Render the cart
    res.render("cart", {
      cart: getCart(req.session),
      active: { cart: true }
    });
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
  var removed = removeFromCart(req.session, req.body.buttonID);
  if (removed) {
    res.send({ success: true, cart: getCart(req.session) });
  } else {
    res.send({ success: false });
  }
};

module.exports = new ctrl();

function getCart(session) {
  if (session.cart) {
    return session.cart;
  }
  session.cart = [];
  return session.cart;
}

function removeFromCart(session, designId) {
  var removed = false;
  
  if (!session.cart || !Array.isArray(session.cart)) {
    return false;
  }  
  
  session.cart.forEach((design, index) => {
    console.log(design._id);
    console.log(designId);
    if (design._id === designId) {
      
      console.log("Removed design " + design.name);

      session.cart.splice(index, 1);
      removed = true;
    }
  });
  console.log("ITEMS IN CART NOW:    ");
  if (session.cart.length > 0) {
    session.cart.forEach((item, index) => {
    console.log(index + ". " + item.name);
  });    
  }
  
  session.save();
  return removed;
}


function addToCart(session, design) {
  if (!session.cart || !Array.isArray(session.cart)) {
    console.log("Cart did not exist or was not an array, created upon adding");
    session.cart = [];
  }

  const containsDesign = session.cart.length === 0 ? false :
    session.cart.some(element => {
      console.log(element._id === design.id);
      return element._id === design.id;
    });


  if (!containsDesign) {
    console.log("Added to cart!");
    session.cart.push(design);
    session.save(); // Idk why it does not save session without this...
  }
  console.log("ITEMS IN CART NOW:    ");
  if (session.cart.length > 0) {
    session.cart.forEach((item, index) => {
    console.log(index + ". " + item.name);
  });    
  }
}
