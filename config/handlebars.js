const path = require("path");
const hbs = require("hbs");
const partialsPath = path.join(__dirname, "../", "views", "partials");

module.exports = function(app) {
  hbs.registerPartials(partialsPath);
  app.set("view engine", "hbs");
};
