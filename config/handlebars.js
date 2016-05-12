const path = require("path");
const hbs = require("hbs");
const partialsPath = path.join(__dirname, "../", "views", "partials");

/**
 * Sets handlebars as the view engine for the app
 * and configures for the use of partial views
 * 
 * @param app (description)
 */
module.exports = function(app) {
  hbs.registerPartials(partialsPath);
  app.set("view engine", "hbs");
};
