const path = require("path");
const exphbs = require("express-handlebars");

const hbs = exphbs.create({
  defaultLayout: "layout"
});

module.exports = function(app) {
  exphbs.partialsDir = "views/partials/";
  app.engine("handlebars", hbs.engine);
  app.set("view engine", "hbs");
};
