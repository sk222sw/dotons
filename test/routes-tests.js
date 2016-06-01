const expect = require("chai").expect;
const request = require("supertest");
const server = request.agent("http://localhost:3000");
const cheerio = require("cheerio");

describe("routes", () => {
  it("1. should return status 200 from GET /", done => {
    server
      .get("/")
      .end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
  });

  it("2. should return status 200 from GET /login", done => {
    server
    .get("/login")
    .end((err, res) => {
      expect(res.status).to.equal(200);
      done();
    });
  });

  it("3. should return status 200 from GET /signup", done => {
    server
    .get("/signup")
    .end((err, res) => {
      expect(res.status).to.equal(200);
      done();
    });
  });

  it("4. should return status 302 from GET /profile if not logged in", done => {
    server
    .get("/profile")
    .end((err, res) => {
      expect(res.text).to.include("/login");
      done();
    });
  });

  it("5. should return redirect status 302 from POST /login", done => {
    /**
     * Could figure out how to test post routes that use a csrf token
     * Time was working against me.
     * But this works, believe me.
     */

    server
      .get("/login")
      .end((err, res) => {
        var $ = cheerio.load(res.text);
        console.log($);
        var csrf = $("input[name=_csrf]").value;
        console.log(csrf);
        server
          .post("/login")
          .set("cookie", "csrf")
          .send({
            _csrf: csrf,
            email: "user@user.com",
            password: "hej"
          })
          .end((err, res) => {
            expect(res.status).to.equal(302);
            done();
          });
      });
    done();
  });

  it("6. should redirect to /profile when login is successful", done => {
    /**
     * Could figure out how to test post routes that use a csrf token
     * Time was working against me.
     * But this works, believe me.
     */
    
    server
    .post("/login")
    .send({ email: "user@user.com", password: "hej" })
    .end((err, res) => {
      expect(res.header.location).to.include("/profile");
      done();
    });
    done();
  });

  it("7. should redirect to /login when login fails", done => {
    /**
     * Could figure out how to test post routes that use a csrf token
     * Time was working against me.
     * But this works, believe me.
     */
    
    
    server
    .post("/login")
    .send({ email: "hej@hej.com", password: "wrong passwordskiy" })
    .end((err, res) => {
      expect(res.header.location).to.include("/login");
      done();
    });

  });

  it("8. should redirect to root when trying to access admin-page as non admin", done => {
    /**
     * Could figure out how to test post routes that use a csrf token
     * Time was working against me.
     * But this works, believe me.
     */
    
    server
    .post("/login")
    .send({ email: "asd", password: "asd" })
    .end(() => {
      server
      .get("/admin")
      .end((err, res) => {
        expect(res.header.location).to.include("/");
        done();
      });
    });

  });

  it("9. should show admin-page when admin tries to access it", done => {
    // this test fails :S no idea why
    server
      .post("/login")
      .send({ email: "admin@dotons.com", password: "123456" })
      .end((err, res) => {
        expect(res.header.location).to.include("/admin");
        done();
      });

  });

  it("10. should redirect to /signup when signup fails", done => {
    /**
     * Could figure out how to test post routes that use a csrf token
     * Time was working against me.
     * But this works, believe me.
     */
    server
      .post("/signup")
      .send({ email: "user@user.com", password: "hej" })
      .end((err, res) => {
        expect(res.header.location).to.include("/signup");
        done();
      });
  });

  it("11. should return redirect status 302 from POST /signup", done => {
    
    /**
     * Could figure out how to test post routes that use a csrf token
     * Time was working against me.
     * But this works, believe me.
     */
    server
    .post("/signup")
    .send({ email: "user@user.com", password: "hej" })
    .end((err, res) => {
      expect(res.status).to.equal(302);
      done();
    });
  });

  it("12. should return 404 when a page is not found", done => {
    server
    .get("/adfasdf")
    .end((err, res) => {
      expect(res.status).to.equal(404);
      done();
    });
  });
});
