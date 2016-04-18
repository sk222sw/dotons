module.exports = function(role) {
  return function(req, res, next) {
    if (req.user && req.user.role === role.toLowerCase()) {
      next();
    } else {
      console.log("unahtorazed")
      res.redirect("/login");
    }
  };
};
