const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use("local-signup", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  }, (req, email, password, done) => {
    process.nextTick(() => {
      User.findOne({ email } , (err, user) => {
        if (err) { return done(err); }
        if (user) {
          return done(null, false, { message: "email is already taken" });
        } else {
          const newUser = new User();

          newUser.email = email;
          newUser.password = newUser.generateHash(password);
          newUser.accountType = req.body.accountType;

          newUser.save(saveErr => {
            if (err) { throw saveErr; }
            return done(null, newUser);
          });
        }
      });
    });
  }
));

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