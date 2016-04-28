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
    failureRedirect: "/signup",
    failuerFlash: true
  }));
  app.post("/login", passport.authenticate("local-login", {
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
    // DRY DRY DRY THIS IS SO DRYYY
    // cant redirect from posts so need to send something
    // to the client that indicates that u need to login to
    // save a design to disk.
    if (req.isAuthenticated()) {
      next();
    } else {
      res.send({ redirect: "/login" });
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
