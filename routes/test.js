module.exports = function (req, res, next) {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log("I AM AUTHENTICATED");
    next();
  } else {
    console.log("noooope not gonna pass");
    res.redirect("/login");
  }
};
