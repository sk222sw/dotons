const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

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

        newUser.save(saveErr => {
          if (err) { throw saveErr; }
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
