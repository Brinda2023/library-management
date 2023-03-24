var supertest = require("supertest");
var tokenAdmin;

describe("AuthorController", () => {
  //login
  it("admin login", (done) => {
    supertest(sails.hooks.http.app)
      .post("/admin/login")
      .send({
        email: "admin@zignuts.com",
        password: "VeryStrong@Pwd9812",
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        tokenAdmin = res.body.data.token;

        done();
      });
  });

  var authorID;
  //create
  it("create an author", (done) => {
    supertest(sails.hooks.http.app)
      .post("/author")
      .send({
        name: "Author1",
      })
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        console.log(res.body);
        authorID = res.body.data.author.id;

        done();
      });
  });
  //get
  it("get all the authors", (done) => {
    supertest(sails.hooks.http.app)
      .get("/author")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        console.log(res.body);

        done();
      });
  });
  //update
  it("update an author", (done) => {
    supertest(sails.hooks.http.app)
      .patch("/author/" + authorID)
      .field("name", "Author12")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        console.log(res.body);

        done();
      });
  });
  //delete
  it("delete an author", (done) => {
    supertest(sails.hooks.http.app)
      .delete("/author/" + authorID)
      .set("Authorization", `Bearer ${tokenAdmin}`)
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
