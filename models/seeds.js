const DotDesign = require("./dotDesign").model;
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

  User.find((err, user) => {
    if (user.length) return;
    console.log("SEEDING USERS");
    const user1 = new User({
      email: "user@user.com",
      role: "Business",
      companyInfo: {
        companyName: "UserComp AB"
      }
    });
    user1.password = user1.generateHash("hej");

    user1.designs.push({
      name: "Test-dot",
      imageUrl: "uploads/dot_designs/ladda_ned.jpg"
    });
    const design = user1.designs[0];
    console.log(design);
    console.log(design.isNew);
    user1.save(error => {
      if (error) console.log(error);
      console.log("success!");
    });

    const user2 = new User({
      email: "nej@hej.nej",
      role: "Private",
      userInfo: {
        firstName: "User",
        lastName: "Hello"
      }
    });
    user2.password = user2.generateHash("hejsan");
    user2.save(err => {
      if (err) console.log(err);
    });
    console.log("saving user 2");
    const admin = new User({
      email: "admin@dotons.com",
      role: "Admin"
    });
    admin.password = admin.generateHash("123456");
    admin.save(err => {
      if (err) console.log(err);
    });
  });
}

module.exports = seed;
