const DotDesign = require('../models/dotDesign');
const isLoggedIn = require("../modules/isLoggedIn");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const PriceListDal = require("../models/DAL/PriceListDal");

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
        1: "Business",
        2: "Private",
        3: "Store retail",
        4: "Business retail"
      },
      title: "dotons - signup"
    };
    res.render("signup", context);
  });

  app.get("/profile", isLoggedIn, (req, res) => {
    console.log(req.user.accountType);
    const priceListPromise = PriceListDal.getPriceList();
    priceListPromise
      .then((priceList) => {
        var price;
        switch (req.user.accountType) {
          case 1:
            price = priceList.businessPrice;
            break;
          case 2:
            price = priceList.privatePrice;
            break;
          case 3:
            price = priceList.privateRetailsPrice;
            break;
          case 4:
            price = priceList.businessRetailPrice;
            break;
          default:
            price = priceList.privatePrice;
        }

        res.render("profile", {
          email: req.user.email,
          price
        });
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("PROFILE PAGE");
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
