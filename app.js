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
const helmet = require("helmet");
const csrf = require("csurf");
const multer = require("multer");

// CSRUF middleware


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
  saveUninitialized: false,
  cookie: {
    secure: false, // TODO: fix SSL and set to true in production
    httpOnly: true,
    // TODO: domain and expires
  }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//multer


app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.notAdmin = req.user ? req.user.role.toLowerCase() !== "admin" : true;
  next();
});

// CSP 
app.use(helmet.contentSecurityPolicy({
  defaultSrc: ["'self"],
  scriptSrc: [], // scripts like google analytics go here
  styleSrc: [], // styles (inline) or external allowed here
  imgSrc: [], // images external allowed here
  fontSrc: [],
  objectSrc: [],
  mediaSrc: [],
  frameSrc: []
}));

// XSS
app.use(helmet.xssFilter());

// Deny X-frames
app.use(helmet.frameguard({ action: "deny" }));

// Enforce https
// app.use(helmet.hsts({
//   maxAge: 7776000000,
//   includeSubdomains: true
// }));

// Hide x-powered-by header
app.use(helmet.hidePoweredBy());





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


seeds();

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers
app.use((err, req, res, next) => {
  if (err.code !== "EBADCSRFTOKEN") return next(err);
  res.status(403);
  res.send("Form was tampered with");
});

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
