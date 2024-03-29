const DotDesign = require("./dotDesign").model;
const User = require("./user");
const PriceList = require("./priceList");
const isProduction = process.env.NODE_ENV === "production";

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
  
  // Dont want to seed production with users
  if (isProduction) return;
  
  User.find((err, user) => {
    if (user.length) return;

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

    user1.save(error => {
      if (error) console.log(error);

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
