const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require("passport");
const session = require("express-session");
const favicon = require('serve-favicon');
const db = require("./models/mongo.js");
const flash = require("connect-flash");

const app = express();

require("./config/passport")(passport);
require("./config/handlebars")(app);

app.use(favicon(path.join(__dirname, 'public', "images", 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "dootoons",
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use((req, res, next) => {
  if (req.url.substr(-1) === "/" && req.url.length > 1) {
    res.redirect(301, req.url.slice(0, -1));
  } else {
    next();
  }
});
app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated(); // should be able to get this in handlebars no?
  next();
});

// setup multer for fileupload
require("./routes/routes.js")(app, passport);



connect()
  .on("error", console.log)
  .on("disconnected", connect)
  .once("open", () => {
    console.log("connection to db open");
  });



const seeds = require("./models/seeds");
console.log("seed() called in app.js");

seeds();

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function connect() {
  return db.connect(app.get("env")).connection;
}


module.exports = app;
