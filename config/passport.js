const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");
const mailer = require("../modules/mailer");

/**
 * Configures passport.js for authentication of the app
 * 
 * @param passport (description)
 */
module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  /**
   * Passport strategy for registration
   */
  passport.use("local-signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  }, (req, email, password, done) => {
    process.nextTick(() => {
      User.findOne({ email }, (err, user) => {
        if (err) { return done(err); }
        if (user) {
          return done(null, false, req.flash("signupMessage", "Email is already registered"));
        }
        const role = req.body.role.toLowerCase();
        if (role === "admin") {
          return done(null, false, req.flash("signupMessage", "something went wrong"));
        }

        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        newUser.role = req.body.role;
        
        console.log(newUser.role);
        
        
        newUser.activated = role === "private";

        newUser.save((saveErr, user) => {
          if (err) { throw saveErr; }
          if (role === "business") {
          var text = "<h1>Welcome to dotons!</h1>";
          text += "<p>Please await activation of your account before you can order dots</p>";
          mailer.sendMail({
            recipient: user.email,
            subject: "Welcome to dotons!",
            html: "<p>Hello and welcome to dotons!</p>"
          });
          
          const activationLink = "http://localhost:3000/users/" + user.id;
          
          mailer.sendMail({
            recipient: "ad222kr@student.lnu.se",
            subject: "New business account awaiting activation",
            html: "<p>A new account needs activating</p>" + 
                  "<a href='www.google.com'>Google</a>" +
                  "<a href='" + activationLink + "'>Activate</a>" +
                  "<p>localhost:3000/users/" + user.id + "</p>" + 
                  "<a href='http://localhost:3000/users/5740726b33df889c1c07dad3'>Test</a>"
          });
        }
          
          return done(null, newUser);
        });
      });
    });
  }));
  
  /**
   * Passport strategy for login
   */
  passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        return done(null, false, req.flash("loginMessage",
          "Can't find a user with that email"));
      }
      if (!user.validPassword(password)) {
        return done(null, false, req.flash("loginMessage", "Wrong password"));
      }
      return done(null, user);
    });
  }));
};
