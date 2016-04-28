const PriceListDal = require("../models/DAL/priceListDAL");
const _ = require("lodash");
const ROLES = require("../models/enums/roles").roles;

/**
 * Controller for handling users
 */
const ctrl = function() {};


/**
 * GET /login
 *
 * Action for user login
 *
 * @param req (description)
 * @param res (description)
 */
ctrl.prototype.login = function(req, res) {
  // TODO: Separate controller for login and users?
  // Like SessionsController - login && UsersController for creating/updating users?
  if (req.isAuthenticated()) { res.redirect("/profile"); }
  res.render('login', {
    title: 'dotons - login!',
    message: req.flash("loginMessage"),
  });
};


/**
 * GET /signup
 *
 * @param req (description)
 * @param res (description)
 */
ctrl.prototype.signup = function(req, res) {
  // TODO: rename action to new?
  var context = {};
  context.roles = _.cloneDeep(ROLES);
  delete context.roles.ADMIN; // dont want to create admin accounts

  context.title = "dotons - signup";

  // set flash message if exists
  context.message = req.flash("signupMessage");

  res.render("signup", context);
  
};

/**
 *  GET /profile
 * 
 * @param req (description)
 * @param res (description)
 */
ctrl.prototype.profile = function(req, res) {
  // TODO: rename action to show?

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
        price,
        designs: req.user.designs
      });
    })
    .catch((error) => {
      console.log(error);
    });
};


module.exports = new ctrl();
