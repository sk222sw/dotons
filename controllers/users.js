const PriceListDal = require("../models/DAL/priceListDAL");
const _ = require("lodash");
const ROLES = require("../models/enums/roles").roles;
const uploadImage = require("../modules/uploadImage");
const DotDesign = require("../models/dotDesign").model;
const UPLOAD_PATH = "uploads/dot_designs/";
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const userDAL = require("../models/DAL/userDAL");
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
  userDAL.getUsers()
    .then(users => {
      res.render("users", { 
        users,
        active: { users: true } 
      });
    })
    .catch(error => {
      // db error
      console.log("DB error");
      console.log(error);
    });
};

ctrl.prototype.activate = function (req, res) {
  userDAL.activateUser(req.params.id)
    .then((user) => {
      console.log(user);
      res.redirect("/users");
    })
    .catch(error => {
      console.log(error);
    });


};

ctrl.prototype.deactivate = function (req, res) {
  userDAL.deactivateUser(req.params.id)
    .then((user) => {
      console.log(user);
      res.redirect("/users");
    })
    .catch(error => {
      console.log(error);
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
  const userId = req.params.id;
  console.log(userId);
  userDAL.getUserById(userId)
    .then(user => {
      console.log(user);
      renderProfile(user, res, req);
    })
    .catch(error => {
      console.log("DB error");
      console.log(error);
    });
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
  delete context.roles.PRIVATE_RETAIL; // no suport for this type of account yet
  delete context.roles.BUSINESS_RETAIL; // no support for this type of account yet

  console.log(context.roles);

  context.title = "dotons - signup";
  context.active = { signup: true };

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
        renderProfile(req.user, res, req);
      })
      .catch(error => {
        console.log(error);
      });
  } else {
    // User was already logged in, just render the view
    console.log("CSRFTOKEN IN PROFILE:    " + req.csrfToken());
    req.flash("message", "Welcome back");
    renderProfile(req.user, res, req);
  }
};


/**
 * Gets the pricelist and then renders the user profile
 * Moved to separate method to eliminate DRY
 *
 * @param user (description)
 * @param res (description)
 */
function renderProfile(user, res, req, flash) {
  PriceListDal.getPriceList()
    .then((priceList) => {
      req.session.price = user.getUserPrice(priceList, user.role)
      return user.getUserPrice(priceList, user.role);
    })
    .then((price) => {
      console.log("renderProfile() called. CSRF: " + req.csrfToken());
      const designs = setOrderedDesignsToNonOrderable(user.designs, req.session.cart);
      res.render("profile", {
        user,
        email: user.email,
        price,
        designs,
        message: flash,
        csrfToken: req.csrfToken(),
        active: { profile: true }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}


function setOrderedDesignsToNonOrderable(designs, cart) {
  if (!cart) return designs;
  if (cart.length === 0) return designs;
  cart.forEach(elem => {
    console.log("         __ cart item: " + elem.name);
  });


  const ret = designs.map((design) => {
    design.ordered = cart.some(element => {
      return element._id === design.id;
    });

    return design;
  });
  
  return ret;
}



module.exports = new ctrl();
