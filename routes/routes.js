const DotDesign = require('../models/dotDesign');
const isLoggedIn = require("../modules/isLoggedIn");
const needsRole = require("../modules/needsRole");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const PriceListDal = require("../models/DAL/PriceListDal");
const users = require("../controllers/users");
const admin = require("../controllers/admin");
const dotDesigner = require("../controllers/dot-designer.js");

module.exports = function (app) {
  app.get('/', (req, res) => {
    res.render('index', {
      title: 'dotons - wielkommen!'
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

  app.get("/signup", users.signup);
  app.get("/login", users.login);
  app.get("/profile", isLoggedIn, users.profile);
  app.post("/signup", passport.authenticate(("local-signup"), {
    successRedirect: "/profile",
    failureRedirect: "/signup"
  }));
  app.post("/login", passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: false
  }));
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
  // tool
  app.get("/designer", dotDesigner.index);
  app.post("/designer/upload", dotDesigner.uploadToMemory);

  // admin routes
  app.get("/admin", needsRole("admin"), admin.index);
};
