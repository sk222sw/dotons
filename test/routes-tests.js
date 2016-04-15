const expect = require("chai").expect;
const request = require("supertest");
const server = request.agent("http://localhost:3000");

describe("server", () => {
  it("/ should return status 200", done => {
    server
      .get("/")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });
});
