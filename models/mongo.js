const mongoose = require("mongoose");
const credentials = require("../config/db");

const opts = {
  server: {
    socketOptions: { keepAlive: 1 }
  }
};

const db = {};

db.connect = function (env) {
  switch (env) {
    case "development":
      return mongoose.connect(credentials.development.connection_string, opts);
    case "production":
      return mongoose.connect(credentials.production.connection_string, opts);
    default:
      throw new Error("Unknown execution enviroment: ${app.get(env)}");
  }
};

module.exports = db;
