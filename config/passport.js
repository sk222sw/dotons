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
      User.findOne({ email }, (err, user) => {
        const role = req.body.role.toLowerCase();

        if (err) { return done(err); }
        if (user) {
          return done(null, false, { message: "email is already taken" });
        }
        if (role === "admin") {
          return done(null, false, { message: "something went wrong" });
        }
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.generateHash(password);
        newUser.role = req.body.role;

        newUser.save(saveErr => {
          if (err) { throw saveErr; }

          console.log("Register admin account successful shit");
          return done(null, newUser);
        });
      });
    });
  }
));

  passport.use("local-login", new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, (req, email, password, done) => {
    User.findOne({ email }, (err, user) => {
      if (err) return done(err);
      console.log("passed error chec");
      if (!user) return done(null, false, { message: "no user found" });
      console.log("passed no user found check")
      if (!user.validPassword(password)) {
        return done(null, false, { message: "wrong password" });
        console.log("passed wrong password check");
      } else {
        return done(null, user);
      }
    });
  }

  ));
};
