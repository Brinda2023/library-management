var supertest = require("supertest");
var tokenUser;

describe("UserController", () => {
  // register
  it("register a user", (done) => {
    supertest(sails.hooks.http.app)
      .post("/user/register")
      .send({
        firstName: "user1fn",
        lastName: "user1ln",
        email: "user1@gmail.com",
        password: "user1#PW",
        username: "user1un",
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
        email: "user1@gmail.com",
        password: "user1#PW",
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
