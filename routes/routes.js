const DotDesign = require('../models/dotDesign').model;
const isLoggedIn = require("../modules/isLoggedIn");
const needsRole = require("../modules/needsRole");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const users = require("../controllers/users");
const admin = require("../controllers/admin");
const dotDesigner = require("../controllers/dotDesigns.js");
const fs = require("fs");
const path = require("path");
const isValidImage = require("../modules/isValidImage");
const csrf = require("csurf");
const bodyParser = require('body-parser');

const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {
  app.get('/', csrfProtection, (req, res) => {
    res.render('index', {
      title: 'dotons - wielkommen!',
      csrfToken: req.csrfToken()
    });
  });

  app.get('/designs', (req, res) => {
    DotDesign.find((err, dotDesigns) => {
      const context = {
        dots: dotDesigns.map(dot => {
          return {
            name: dot.name,
            imageUrl: dot.imageUrl
          };
        })
      };
      res.render('dot', context);
    });
  });

  app.get("/signup", csrfProtection, users.signup);
  app.get("/login", csrfProtection, users.login);
  app.get("/profile", isLoggedIn, users.profile);
  app.post("/signup", parseForm, csrfProtection, passport.authenticate(("local-signup"), {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failuerFlash: true
  }));
  app.post("/login", parseForm, csrfProtection, passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
  }));
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
  // tool
  app.get("/designer", dotDesigner.new);

  app.post("/designer/upload", (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      // User wants to save a design but is not logged in..
      // get the uploaded file via multer mem-storage and 
      // save it in session until the user has logged in
      const upload = require("../config/multer");
      upload(req, res, err => {
        req.session.image = req.file;
        res.redirect("/profile");
      });
    }
  }, dotDesigner.create);

  app.get("/uploads/dot_designs/:imagename", isLoggedIn, (req, res) => {
    const imagename = req.params.imagename;
    fs.readFile("uploads/dot_designs/" + imagename, (err, data) => {
      if (err) console.log(err);
      res.sendFile(path.resolve("uploads/dot_designs/" + imagename));
    });
  });

  // admin routes
  app.get("/admin", needsRole("Admin", "/"), admin.index);
};
