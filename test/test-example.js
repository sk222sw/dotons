const mocha = require("mocha");
const expect = require("chai").expect;
// import class that should be tested

function hej (greeting) {
  if (greeting) {
    return greeting;
  }
  return "hej";
}

// 1 describe for the class that's being tested
describe("test-example", () => {
  // 1 describe for the method that's being tested
  describe("hej()", () => {
    // one it for each tested scenario
    it("should return string 'hej' if greeting is empty", () => {
      const expected = "hej";
      expect(hej()).to.equal(expected);
    });

    it("should return return greeting", () => {
      const expected = "privet";
      expect(hej("privet")).to.equal(expected);
    });
  });
});
