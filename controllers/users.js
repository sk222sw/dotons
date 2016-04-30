const PriceListDal = require("../models/DAL/priceListDAL");
const _ = require("lodash");
const ROLES = require("../models/enums/roles").roles;
const uploadImage = require("../modules/uploadImage");
const DotDesign = require("../models/dotDesign").model;
const UPLOAD_PATH = "uploads/dot_designs/";
const dotDesignDAL = require("../models/DAL/dotDesignDAL");

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
ctrl.prototype.profile = function(req, res, next) {
  // TODO: NEEDS REFACTOR (NOT SO) REALLY BADLY (ANYMORE)
  // Still DRY compared to the create action in the dotDesign-controller
  // Move the uploading code out to separate module / BLL-class that handles it probably
  if (req.session.image) {
    // User tried to save an image but was not logged in
    // Create the image from session and then render profile
    const dot = new DotDesign();
    const filenames = dot.sanitizeFilename(req.session.image.originalname);
    dot.name = filenames.original;
    dot.imageUrl = UPLOAD_PATH + dot.name;

    uploadImage(req.session.image, dot.imageUrl)
      .then(() => {
        return dotDesignDAL.addDotDesignToUser(req.user.id, dot);
      })
      .then(() => {
        // Image uploaded and saved to db, should be safe
        // to push the dot to req.user.designs so the dot
        // renders without another roundtrip to the server
        req.user.designs.push(dot);
        req.session.image = null;
      })
      .then(() => {
        renderProfile(req.user, res);
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    // User was already logged in, just render the view
    req.flash("message", "Welcome back");
    renderProfile(req.user, res);
  }
};


/**
 * Gets the pricelist and then renders the user profile
 * Moved to separate method to eliminate DRY
 * 
 * @param user (description)
 * @param res (description)
 */
function renderProfile(user, res, flash) {
  PriceListDal.getPriceList()
    .then((priceList) => {
      return getPriceByRole(priceList, user.role);
    })
    .then((price) => {
      res.render("profile", {
        email: user.email,
        price,
        designs: user.designs,
        message: flash
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function getPriceByRole(priceList, role) {
  // This should probably be a User-model instance method?
  switch (role) {
    case ROLES.BUSINESS:
      return priceList.businessPrice;
    case ROLES.PRIVATE:
      return priceList.privatePrice;
    case ROLES.PRIVATE_RETAIL:
      return priceList.privateRetailsPrice;
    case ROLES.BUSINESS_RETAIL:
      return priceList.businessRetailPrice;
    default:
      return priceList.privatePrice;
  }
}

module.exports = new ctrl();
