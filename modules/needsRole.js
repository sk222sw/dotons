/**
 * Checks wheter the current user has the correct role
 * 
 * @param {String} role - name of the role
 * @param {String} redirectTo - route to redirect to if not authorized
 * @returns {Function} - the function(middleware) that redirects
 */
module.exports = function(role, redirectTo) {
  if (typeof(redirectTo) === "undefined") redirectTo = "/login";
  return function(req, res, next) {
    if (req.user && req.user.role.toLowerCase() === role.toLowerCase()) {
      console.log("authorized");
      next();
    } else {
      console.log("unahtorazed");
      res.redirect(redirectTo);
    }
  };
};
