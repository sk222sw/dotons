const mongoose = require("mongoose");
const credentials = require("../credentials");

console.log(credentials);

const opts = {
  server: {
    socketOptions: { keepAlive: 1 }
  }
};

const db = {};

db.connect = function (env) {
  switch (env) {
    case "development":
      mongoose.connect(credentials.development.connection_string, opts);
      console.log("Connected to dev");
      break;
    case "production":
      mongoose.connect(credentials.production.connection_string, opts);
      console.log("Connected to prod");
      break;
    default:
      throw new Error("Unknown execution enviroment: ${app.get(env)}");
  }
};

module.exports = db;
