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
      active: { cart: true },
      csrfToken: req.csrfToken(),
    });
  }
};

/**
 * Adds an item to the cart. An item in the cart looks like this:
 *  {
 *    design: DotDesign, // The Model-class 
 *    selected10mm: true,
 *    selected11mm: false,
 *    quantity10mm: 10000,
 *    quantity11mm: 0 
*   }
    selected10/11 comes from a checkbox in the form
 */

ctrl.prototype.add = function(req, res) {
  console.log(req.body);
  DotDesignDAL.getUserDesignByID(req.user.id, req.body.buttonID)
    .then((design, err) => {
      if (err) return res.send({ success: false });
      // design found
      addToCart(req.session, {
        design,
        "10mm": {
          ordered: req.body.selected10mm,
          quantity: req.body.quantity10mm,
          price: req.body.selected10mm ?
            req.session.price * req.body.quantity10mm : 0
        },
        "11mm": {
          ordered: req.body.selected11mm,
          quantity: req.body.quantity11mm,
          price: req.body.selected11mm ?
            req.session.price * req.body.quantity11mm : 0
        }
      });

      return res.send({ success: true, cart: getCart(req.session) });
    })
    .catch(error => {
      console.log(error);
      res.send({ success: false });
    });
};

ctrl.prototype.remove = function(req, res) {
  console.log(req.body);
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
  
  session.cart.forEach((cartItem, index) => {
    console.log("CARTITEM ID " + cartItem.design._id);
    console.log("DESIGN ID : " + designId);
    if (cartItem.design._id === designId) {
      
      console.log("Removed design " + cartItem.design.name);

      session.cart.splice(index, 1);
      removed = true;
    }
  });
  console.log("ITEMS IN CART NOW:    ");
  if (session.cart.length > 0) {
    session.cart.forEach((item, index) => {
    console.log(index + ". " + item.design.name);
  });    
  }
  
  session.save();
  return removed;
}


function addToCart(session, cartItem) {
  if (!session.cart || !Array.isArray(session.cart)) {
    console.log("Cart did not exist or was not an array, created upon adding");
    session.cart = [];
  }

  const containsDesign = session.cart.length === 0 ? false :
    session.cart.some(element => {
      console.log(element.design._id === cartItem.design.id);
      return element.design._id === cartItem.design.id;
    });


  if (!containsDesign) {
    console.log("Added to cart!");
    session.cart.push(cartItem);
    session.save(); // Idk why it does not save session without this...
  }
  console.log("ITEMS IN CART NOW:    ");
  if (session.cart.length > 0) {
    session.cart.forEach((item, index) => {
    console.log(index + ". " + item.name);
  });    
  }
}
