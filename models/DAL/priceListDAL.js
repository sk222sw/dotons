const db = require("./models/mongo.js");

db.connect(app.get('env'));
