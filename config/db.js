/**
 * Configuration for mongodb, contains connection strings
 * for development and production.
 */
const mongo = {
  development: {
    connection_string: "mongodb://dotons:dotons2016@ds013300.mlab.com:13300/dotons"
  },
  production: {
    // connection_string: "mongodb://dotons:dotons2016@ds013300.mlab.com:13300/dotons"
    connection_string: process.env.MONGODB_URL
  }
};

module.exports = mongo;
