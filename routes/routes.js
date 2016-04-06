const DotDesign = require('../models/dotDesign');
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

function validateUser(email, password) {
  console.log(email, password);
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  },
    function(email, password, done) {
      User.findOne({ email: email }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));
}

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

  app.post("/login", (req, res) => {
    User.findOne({ "email": "user@user.com"}, (err, user) => {
      if (err) console.log(err);
      console.log("user", user);
    });
    // console.log(validateUser(req.body.email, req.body.password));
    // console.log("validate:", validate);
    res.render("login", {
      title: "dotons - loggalainen"
    });
  });
};
