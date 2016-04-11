const DotDesign = require("./dotDesign");
const User = require("./user");

function seed() {
  DotDesign.find((err, dotDesings) => {
    if (dotDesings.length) return;

    const dot = new DotDesign({
      name: "Sonnys Dot",
      imageUrl: "sonny-dot.jpg"
    }).save();

    const dot2 = new DotDesign({
      name: "Alex Dot",
      imageUrl: "alex-dot.jpg"
    }).save();
  });

  User.find((err, user) => {
    if (user.length) return;

    const user1 = new User({
      email: "user@user.com",
      password: "hej",
      accountType: 1,
      companyInfo: {
        companyName: "UserComp AB"
      }
    }).save();

    const user2 = new User({
      email: "nej@hej.nej",
      password: "hejs",
      accountType: 2,
      userInfo: {
        firstName: "User",
        lastName: "Hello"
      }
    }).save();
  });
}

module.exports = seed;
