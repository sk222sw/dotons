const PriceListDal = require("../models/DAL/priceListDAL");
const _ = require("lodash");
const ROLES = require("../models/enums/roles").roles;
const uploadImage = require("../modules/uploadImage");
const DotDesign = require("../models/dotDesign").model;
const UPLOAD_PATH = "uploads/dot_designs/";
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const User = require("../models/user");

/**
 * Controller for handling users
 */
const ctrl = function() {};


/**
 * GET /users
 *
 * Lists all the users for the admin
 *
 * @param req (description)
 * @param res (description)
 */
ctrl.prototype.index = function(req, res) {
  User.find({}, (err, users) => {
    res.render("users", {
      users
    });
  });
};


/**
 * GET /users/:id
 *
 * Shows a single user. For the admin.
 * Kinda same as /profile but not really
 * Argument for two different actions (profile and show) is
 * that the admin needs a more compact view of the user. Or does he?
 * Probably not.. Use the same or what?
 *
 * @param req (description)
 * @param res (description)
 */
ctrl.prototype.show = function(req, res) {

};

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
    csrfToken: req.csrfToken()
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
  context.csrfToken = req.csrfToken();

  res.render("signup", context);

};

const convertToPDF = require("../modules/convertToPdf");

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
  console.log(req.user);
  if (req.session.image) {
    // User tried to save an image but was not logged in
    // Creating a new instance of a buffer object with the buffer in the session
    // mysteriosly fixes the bug of creating a corrupt 1kb image from the session..
    const imagebuf = new Buffer(req.session.image.buffer);
    const dot = new DotDesign();
    const filenames = dot.sanitizeFilename(req.session.image.originalname);
    dot.name = filenames.original;
    dot.imageUrl = UPLOAD_PATH + dot.name;

    uploadImage(imagebuf, dot.imageUrl)
      .then(() => {
        dot.pdf10Url = UPLOAD_PATH + filenames.pdf10mm;
        dot.pdf11Url = UPLOAD_PATH + filenames.pdf11mm;
        convertToPDF(10, dot.name, filenames.pdf10mm, UPLOAD_PATH);
        convertToPDF(11, dot.name, filenames.pdf11mm, UPLOAD_PATH);
      })
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
    console.log(req.session.image);
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
        user,
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
