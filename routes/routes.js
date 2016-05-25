const DotDesign = require('../models/dotDesign').model;
const isLoggedIn = require("../modules/isLoggedIn");
const needsRole = require("../modules/needsRole");
const passport = require("passport");
const users = require("../controllers/users");
const admin = require("../controllers/admin");
const orders = require("../controllers/orders");
const dotDesigner = require("../controllers/dotDesigns.js");
const cart = require("../controllers/cart.js");
const csrf = require("csurf");
const bodyParser = require('body-parser');
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });


module.exports = function (app) {
  /**
   * Node mailer test
   */
  app.get('/', csrfProtection, (req, res) => {
    console.log(req.csrfToken());
    res.render('index', {
      title: 'dotons - wielkommen!',
      csrfToken: req.csrfToken()
    });
  });
  app.get("/signup", csrfProtection, users.signup);
  app.get("/login", csrfProtection, users.login);
  app.post("/signup", parseForm, csrfProtection, passport.authenticate(("local-signup"), {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failuerFlash: true
  }));
  app.get("/profile", csrfProtection, isLoggedIn, (req, res, next) => {
    if (req.user.role.toLowerCase() === "admin") {
      res.redirect("/admin");
    } else {
      next();
    }
  }, users.profile);
  app.post("/login", parseForm, csrfProtection, passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
  }));
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
  // order
  app.post("/order/create", parseForm, csrfProtection, orders.create);
  
  // "shopping cart"
  app.get("/cart", isLoggedIn, csrfProtection, isLoggedIn, cart.show);
  app.post("/add", parseForm, csrfProtection, cart.add);
  app.post("/remove", parseForm, csrfProtection, cart.remove);

  // tool
  app.get("/designer", csrfProtection, dotDesigner.new);

  app.post("/designer/upload", (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      // User wants to save a design but is not logged in..
      // get the uploaded file via multer mem-storage and
      // save it in session until the user has logged in
      const upload = require("../config/multer");
      upload(req, res, err => {
        if (err) { console.log(err); }
        req.session.image = req.file;
        res.send("unauthorized");
      });
    }
  }, dotDesigner.create);

  app.get("/uploads/dot_designs/:imagename", isLoggedIn, dotDesigner.getImage);

  // admin routes
  app.get("/admin", /* needsRole("Admin", "/"),*/ admin.index);
  app.get("/users", /* needsRole("Admin", "/"),*/ users.index);
  // admin view for single user exposes the id, no need for fancy /profile url here
  app.get("/users/:id", csrfProtection, /* needsRole("Admin", "/"), */ users.show);
  app.post("/users/:id/activate", parseForm, csrfProtection, users.activate);
  app.post("/users/:id/deactivate", parseForm, csrfProtection, users.deactivate);
  // TODO: move to controller
  app.get('/designs', /* needsRole("Admin", "/"), */ (req, res) => {
    DotDesign.find((err, dotDesigns) => {
      const context = {
        dots: dotDesigns.map(dot => {
          return {
            name: dot.name,
            imageUrl: dot.imageUrl
          };
        })
      };
      res.render('designs', context);
    });
  });
};
