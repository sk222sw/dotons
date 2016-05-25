

const ctrl = function() {};

ctrl.prototype.index = function(req, res) {

}

ctrl.prototype.show = function(req, res) {

}



ctrl.prototype.create = function(req, res) {
  console.log("Hehe created order kinda");
  res.redirect("/profile");
};


module.exports = new ctrl();
