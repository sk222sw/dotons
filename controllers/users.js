const PriceListDal = require("../models/DAL/priceListDAL");

const ctrl = function() {};

const ACCOUNT_TYPES = {
  BUSINESS: 1,
  PRIVATE: 2,
  PRIVATE_RETAIL: 3,
  BUSINESS_RETAIL: 4
};

// GET /login
ctrl.prototype.login = function(req, res) {
  if (req.isAuthenticated()) { res.redirect("/profile"); }
  res.render('login', {
    title: 'dotons - login!',
  });
};

// GET /signup
ctrl.prototype.signup = function(req, res) {
  // Store account types in database later probably
  const context = {
    roles: {
      1: "Business",
      2: "Private",
      3: "Store retail",
      4: "Business retail"
    },
    title: "dotons - signup"
  };
  res.render("signup", context);
};

// GET /profile
ctrl.prototype.profile = function(req, res) {
  console.log(req.user.role);
  const priceListPromise = PriceListDal.getPriceList();
  priceListPromise
    .then((priceList) => {
      var price;
      switch (req.user.role) {
        case ACCOUNT_TYPES.BUSINESS:
          price = priceList.businessPrice;
          break;
        case ACCOUNT_TYPES.PRIVATE:
          price = priceList.privatePrice;
          break;
        case ACCOUNT_TYPES.PRIVATE_RETAIL:
          price = priceList.privateRetailsPrice;
          break;
        case ACCOUNT_TYPES.BUSINESS_RETAIL:
          price = priceList.businessRetailPrice;
          break;
        default:
          price = priceList.privatePrice;
      }

      res.render("profile", {
        email: req.user.email,
        price
      });
    })
    .catch((error) => {
      console.log(error);
    });
  console.log("PROFILE PAGE");
};

module.exports = new ctrl();
