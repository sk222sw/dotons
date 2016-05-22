

const ctrl = function() {};

ctrl.prototype.index = function(req, res) {

}

ctrl.prototype.show = function(req, res) {

}

ctrl.prototype.new = function(req, res) {
  res.render("newOrder", {
    title: "dotons - create order",
    message: req.flash("Hello!"),
    csrfToken: req.csrfToken()
  });
}

ctrl.prototype.create = function(req, res) {
  console.log("Hehe created order kinda");
  res.redirect("/profile");
};


ctrl.prototype.addToOrder = function(req, res) {

};

module.exports = new ctrl();
