const DotDesign = require('../models/dotDesign');
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
    res.render('login', {
      title: 'dotons - login!'
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

  app.post("/signup", passport.authenticate(("local-signup"), {
    successRedirect: "/",
    failuerRedirect: "login"
  }));

  app.post("/login", passport.authenticate("local-login", {
    successRedirect: "/",
    failuerRedirect: "/login",
    failuerFlash: false
  }));
};
