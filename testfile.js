const User = require("./models/user");
const _ = require("lodash");
// const green = colors.green;

const u = new User();
u.email = "";
u.password = "";

u.save(err => {
  console.log(u);
  if (err) {
    _.forOwn(err.errors, (value) => {
      console.log(value.message);
    });
  } else {
    console.log("det här borde inte funkat men det gör det visst :S");
  }
});
