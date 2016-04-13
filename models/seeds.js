const DotDesign = require("./dotDesign");
const User = require("./user");
const PriceList = require("./priceList");

function seed() {
  PriceList.find((err, priceLists) => {
    if (priceLists.length) return;

    const priceList = new PriceList({
      businessPrice: 16,
      privatePrice: 69,
      privateRetailsPrice: 35,
      businessRetailPrice: 16
    });
    priceList.save();
  });

  DotDesign.find((err, dotDesings) => {
    if (dotDesings.length) return;

    const dot = new DotDesign({
      name: "Sonnys Dot",
      imageUrl: "sonny-dot.jpg"
    });
    dot.save();

    const dot2 = new DotDesign({
      name: "Alex Dot",
      imageUrl: "alex-dot.jpg"
    });
    dot2.save();
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
    });
    user1.save();

    const user2 = new User({
      email: "nej@hej.nej",
      password: "hejs",
      accountType: 2,
      userInfo: {
        firstName: "User",
        lastName: "Hello"
      }
    });
    user2.save();
  });
}

module.exports = seed;
