const path = require("path");

module.exports = function(app) {
  app.set('views', path.join(__dirname, "../", 'views'));
  app.set('view engine', 'hbs');
};
