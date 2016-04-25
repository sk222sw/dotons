module.exports = function(role, redirectTo) {
  if (typeof(redirectTo) === "undefined") redirectTo = "/login";
  return function(req, res, next) {
    if (req.user && req.user.role === role.toLowerCase()) {
      next();
    } else {
      console.log("unahtorazed")

      res.redirect(redirectTo);
    }
  };
};
