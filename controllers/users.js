const PriceListDal = require("../models/DAL/priceListDAL");
const _ = require("lodash");
const ROLES = require("../models/enums/roles").roles;

const ctrl = function() {};

// GET /login
ctrl.prototype.login = function(req, res) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) { res.redirect("/profile"); }
  res.render('login', {
    title: 'dotons - login!',
  });
};

// GET /signup
ctrl.prototype.signup = function(req, res) {

  var context = {};
  context.roles = _.cloneDeep(ROLES);
  delete context.roles.ADMIN; // dont want to create admin accounts


  context.title = "dotons - signup";
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
