// TODO: Fix a production database setup in the droplet

const mongo = {
  development: {
    connection_string: "mongodb://dotons:dotons2016@ds013300.mlab.com:13300/dotons"
  },
  production: {
    connection_string: "mongodb://dotons:dotons2016@ds013300.mlab.com:13300/dotons"
    // connection_string: process.env.MONGO_URL
  }
};

module.exports = mongo;
