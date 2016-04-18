const ctrl = function() {};

ctrl.prototype.index = function(req, res) {
  res.render("adminDashboard");
};


module.exports = new ctrl();
