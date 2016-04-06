const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = function(passport) {
  passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
  }, (email, password, done) => {
    User.findOne({"email": email}, (err, user) => {
      if (err) return done(err);

      if (!user) return done(null, false, { message: "no user found" });

      if (!user.validPassword(password)) {
        return done(null, false, { message: "wrong password" });
      }

      return done(null, user);
    });
  }

  ));
};
