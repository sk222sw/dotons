const DotDesign = require('../models/dotDesign');
const isLoggedIn = require("../modules/isLoggedIn");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

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

  app.get("/login", (req, res) => {
    if (req.isAuthenticated()) { res.redirect("/profile"); }
    res.render('login', {
      title: 'dotons - login!',
    });
  });

  app.get("/signup", (req, res) => {
    const context = {
      accountTypes: {
        1: "Private",
        2: "Retail",
        3: "Business",
        4: "Business retail"
      },
      title: "dotons - signup"
    };
    res.render("signup", context);
  });

  app.get("/profile", isLoggedIn, (req, res) => {
    console.log(req.user);
    console.log(req.user.email);

    console.log("PROFILE PAGE");
    res.render("profile", {
      email: req.user.email
    });
  });
  app.post("/signup", passport.authenticate(("local-signup"), {
    successRedirect: "/profile",
    failureRedirect: "/login"
  }));

  app.post("/login", passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: false
  }));
};
