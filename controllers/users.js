const PriceListDal = require("../models/DAL/priceListDAL");
const _ = require("lodash");

const ctrl = function() {};

const ROLES = {
  ADMIN: {
    ROLE_ID: 1,
    Name: "Admin"
  },
  BUSINESS: {
    ROLE_ID: 2,
    NAME: "Business account"
  },
  PRIVATE: {
    ROLE_ID: 3,
    NAME: "Private account"
  },
  PRIVATE_RETAIL: {
    ROLE_ID: 4,
    NAME: "Private-retail account"
  },
  BUSINESS_RETAIL: {
    ROLE_ID: 5,
    NAME: "Business-retail account"
  }
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

  var a = { a: 1 };
  var b = { a: 1 };

  console.log(a.a === b.a);
  var context = {};
  context.roles = _.cloneDeep(ROLES);
  delete context.roles.ADMIN; // dont want to create admin accounts


  context.title = "dotons - signup";
  console.log(context);
  console.log("Hehehe");
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
        case ROLES.BUSINESS:
          price = priceList.businessPrice;
          break;
        case ROLES.PRIVATE:
          price = priceList.privatePrice;
          break;
        case ROLES.PRIVATE_RETAIL:
          price = priceList.privateRetailsPrice;
          break;
        case ROLES.BUSINESS_RETAIL:
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
