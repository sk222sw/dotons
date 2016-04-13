const path = require("path");
const exphbs = require("express-handlebars");

module.exports = function(app) {
  app.engine("handlebars", exphbs({ defaultLayout: "layout" }));
  app.set("view engine", "hbs");
};
