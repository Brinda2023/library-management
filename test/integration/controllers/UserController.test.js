var supertest = require("supertest");
var tokenUser;

describe("UserController", () => {
  // register
  it("register a user", (done) => {
    supertest(sails.hooks.http.app)
      .post("/user/register")
      .send({
        firstName: "user3fn",
        lastName: "user3ln",
        email: "user3@gmail.com",
        password: "user3#PW",
        username: "user3un",
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        console.log(res.body);

        done();
      });
  });

  // login
  it("login a user", (done) => {
    supertest(sails.hooks.http.app)
      .post("/user/login")
      .send({
        email: "user3@gmail.com",
        password: "user3#PW",
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        console.log(res.body);
        tokenUser = res.body.data.token;

        done();
      });
  });

  // logout
  it("logout a user", (done) => {
    supertest(sails.hooks.http.app)
      .get("/user/logout")
      .set("Authorization", `Bearer ${tokenUser}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        console.log(res.body);

        done();
      });
  });
});
