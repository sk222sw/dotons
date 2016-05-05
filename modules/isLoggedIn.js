/**
 * Middleware for checking if the a user is logged in
 *
 * @param req (description)
 * @param res (description)
 * @param next (description)
 */
module.exports = function(req, res, next) {

  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
};
