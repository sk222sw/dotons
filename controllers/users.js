const PriceListDal = require("../models/DAL/priceListDAL");
const _ = require("lodash");
const ROLES = require("../models/enums/roles").roles;
const colour = require("colour");

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
const uploadImage = require("../modules/uploadImage");
const DotDesign = require("../models/dotDesign").model;
const UPLOAD_PATH = "uploads/dot_designs/";
const convertToPDF = require("../modules/convertToPDF");
const dotDesignDAL = require("../models/DAL/dotDesignDAL");
const create = require("../controllers/dotDesigns").create;

/**
 *  GET /profile
 *
 * @param req (description)
 * @param res (description)
 */
ctrl.prototype.profile = function(req, res, next) {
  // TODO: NEEDS REFACTOR REALLY BADLY 
  if (req.session.image) {
    console.log("RAINBOW IMAGE IN TEH SESSION MOTHAFUCKA".red);
    console.log(req.session.image.originalname);
    create(req, res, next);
    
  } else {
    PriceListDal.getPriceList()
    .then((priceList) => {
      return getPriceByRole(priceList, req.user.role);
    })
    .then((price) => {
      
      console.log("______RENDERING PROFILE______________".green);
      res.render("profile", {
        email: req.user.email,
        price,
        designs: req.user.designs
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }
  //console.log(create);
  
  
  /*
  if (req.session.image) {
    console.log("USER PROFILE USER PROFILE USER PROFILE");
    console.log("1. IMAGE IN SESSION".green);
    const dot = new DotDesign();
    const filenames = dot.sanitizeFilename(req.session.image.originalname);
    dot.name = filenames.original;
    dot.imageUrl = UPLOAD_PATH + dot.name;
    console.log("2. IMAGE UPLOAD STARTED".green);
    uploadImage(req.session.image, dot.imageUrl, error => {
      if (error) {
        console.log("IMAGE UPLOAD FAAAAILED".red);
        next(error);
      } else {
        // BUG: cannot convert to pdf here.........
        // convertToPDF(11, dot.name, filenames.pdf11mm, UPLOAD_PATH);
        // convertToPDF(10, dot.name, filenames.pdf10mm, UPLOAD_PATH);
        dotDesignDAL.addDotDesignToUser(req.user.id, dot)
          .then(() => {
            req.session.image = null;
            console.log("RETURNING PRICE FROM THEN AFTER SESSUIB IMG SAVED".rainbow);
            PriceListDal.getPriceList()
              .then((priceList) => {
                return getPriceByRole(priceList, req.user.role);
              })
              .then((price) => {
                const designs = req.user.designs;
                designs.push(dot);
                console.log("______RENDERING PROFILE______________".green);
                res.render("profile", {
                  email: req.user.email,
                  price,
                  designs
                });
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  } else {

    // TODO: rename action to show?
    PriceListDal.getPriceList()
      .then((priceList) => {
        return getPriceByRole(priceList, req.user.role);
      })
      .then((price) => {
        console.log("______RENDERING PROFILE______________".green);
        res.render("profile", {
          email: req.user.email,
          price,
          designs: req.user.designs
        });
      })
      .catch((error) => {
        console.log(error);
      });
    
    }
    */
};

function getPriceByRole(priceList, role) {
  var price;
  switch (role) {
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
  return price;
}

function uploadImageInSession() {



}

module.exports = new ctrl();
