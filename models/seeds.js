const DotDesign = require("./dotDesign");


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
}

module.exports = seed;
